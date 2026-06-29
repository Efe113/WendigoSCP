-- Add columns to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS is_o5_1 BOOLEAN DEFAULT FALSE NOT NULL,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'suspended', 'rejected'));

-- Create system_config table
CREATE TABLE IF NOT EXISTS public.system_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Create custom_roles table with 21 columns (Clearance, Title, Description, Purpose + 17 extra fields)
CREATE TABLE IF NOT EXISTS public.custom_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role_type TEXT NOT NULL CHECK (role_type IN ('rank', 'profession')),
    title TEXT NOT NULL UNIQUE,
    clearance_level INTEGER DEFAULT 1 NOT NULL CHECK (clearance_level >= 1 AND clearance_level <= 5),
    description TEXT NOT NULL,
    purpose TEXT NOT NULL,
    department TEXT NOT NULL,
    responsibilities TEXT NOT NULL,
    equipment_auth TEXT NOT NULL,
    reporting_to TEXT NOT NULL,
    hazard_allowance TEXT NOT NULL,
    psych_eval_freq TEXT NOT NULL,
    weapons_auth TEXT NOT NULL,
    anomaly_limit TEXT NOT NULL,
    medical_freq TEXT NOT NULL,
    site_access TEXT NOT NULL,
    override_code TEXT NOT NULL,
    termination_protocol TEXT NOT NULL,
    amnestic_susceptibility TEXT NOT NULL,
    active_status TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create ethics_complaints table
CREATE TABLE IF NOT EXISTS public.ethics_complaints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_name TEXT DEFAULT 'ANONYMOUS' NOT NULL,
    subject TEXT NOT NULL,
    complaint_body TEXT NOT NULL,
    target_user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending_review' NOT NULL CHECK (status IN ('pending_review', 'under_investigation', 'resolved', 'dismissed')),
    action_taken TEXT,
    reviewer_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ethics_complaints ENABLE ROW LEVEL SECURITY;

-- Policies for system_config
CREATE POLICY "Allow public read access to system_config" ON public.system_config
    FOR SELECT USING (true);

CREATE POLICY "Allow O5-1 to modify system_config" ON public.system_config
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND is_o5_1 = true
        )
    );

-- Policies for custom_roles
CREATE POLICY "Allow public read access to custom_roles" ON public.custom_roles
    FOR SELECT USING (true);

CREATE POLICY "Allow O5-1 to modify custom_roles" ON public.custom_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND is_o5_1 = true
        )
    );

-- Policies for ethics_complaints
CREATE POLICY "Allow public insert access to ethics_complaints" ON public.ethics_complaints
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow Ethics Liaisons and O5-1 to read ethics_complaints" ON public.ethics_complaints
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND (is_o5_1 = true OR profession = 'Ethics Committee Liaison')
        )
    );

CREATE POLICY "Allow Ethics Liaisons and O5-1 to update ethics_complaints" ON public.ethics_complaints
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND (is_o5_1 = true OR profession = 'Ethics Committee Liaison')
        )
    );

-- Update user triggers: o5-1@site19.scp gets automatically approved and has is_o5_1 = true.
-- Also other users default to pending status.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_o5 BOOLEAN;
  reg_status TEXT;
  reg_rank TEXT;
BEGIN
  IF NEW.email = 'o5-1@site19.scp' THEN
    is_o5 := TRUE;
    reg_status := 'approved';
    reg_rank := 'Level 5 Personnel (O5 Overseer)';
  ELSE
    is_o5 := FALSE;
    reg_status := 'pending';
    reg_rank := COALESCE(NEW.raw_user_meta_data->>'rank', 'Level 1 Personnel (Junior)');
  END IF;

  INSERT INTO public.user_profiles (id, username, clearance_level, profession, rank, is_o5_1, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    1, -- Auto-synced by rank trigger
    COALESCE(NEW.raw_user_meta_data->>'profession', 'Researcher'),
    reg_rank,
    is_o5,
    reg_status
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    username = EXCLUDED.username,
    profession = EXCLUDED.profession,
    rank = EXCLUDED.rank,
    is_o5_1 = EXCLUDED.is_o5_1,
    status = EXCLUDED.status;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed system configuration
INSERT INTO public.system_config (key, value) VALUES
('maintenance_mode', 'false'),
('threat_level', 'LEVEL_GREEN')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
