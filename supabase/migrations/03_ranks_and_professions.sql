-- Alter user_profiles table to support rank and profession
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS profession TEXT DEFAULT 'Researcher' NOT NULL CHECK (
    profession IN (
        'Security Guard', 
        'Field Agent', 
        'Containment Specialist', 
        'Researcher', 
        'Medical Officer', 
        'Mobile Task Force Operative', 
        'Site Director', 
        'Ethics Committee Liaison', 
        'Administrative Staff', 
        'Overseer'
    )
),
ADD COLUMN IF NOT EXISTS rank TEXT DEFAULT 'Level 1 Personnel (Junior)' NOT NULL CHECK (
    rank IN (
        'Level 1 Personnel (Junior)',
        'Level 2 Personnel (Standard)',
        'Level 3 Personnel (Senior)',
        'Level 4 Personnel (Lead / Director)',
        'Level 5 Personnel (O5 Overseer)'
    )
);

-- Trigger to sync clearance level based on rank
CREATE OR REPLACE FUNCTION public.sync_clearance_level()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.rank = 'Level 1 Personnel (Junior)' THEN
    NEW.clearance_level := 1;
  ELSIF NEW.rank = 'Level 2 Personnel (Standard)' THEN
    NEW.clearance_level := 2;
  ELSIF NEW.rank = 'Level 3 Personnel (Senior)' THEN
    NEW.clearance_level := 3;
  ELSIF NEW.rank = 'Level 4 Personnel (Lead / Director)' THEN
    NEW.clearance_level := 4;
  ELSIF NEW.rank = 'Level 5 Personnel (O5 Overseer)' THEN
    NEW.clearance_level := 5;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_profile_rank_changed
  BEFORE INSERT OR UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.sync_clearance_level();

-- Update existing default handler to support registering with metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, clearance_level, profession, rank)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    1, -- Will be automatically calculated by the on_profile_rank_changed trigger
    COALESCE(NEW.raw_user_meta_data->>'profession', 'Researcher'),
    COALESCE(NEW.raw_user_meta_data->>'rank', 'Level 1 Personnel (Junior)')
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    username = EXCLUDED.username,
    profession = EXCLUDED.profession,
    rank = EXCLUDED.rank;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
