-- Create scp_items table
CREATE TABLE IF NOT EXISTS public.scp_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_number TEXT NOT NULL UNIQUE,
    codename TEXT NOT NULL,
    object_class TEXT NOT NULL CHECK (object_class IN ('Safe', 'Euclid', 'Keter', 'Thaumiel')),
    containment_procedures TEXT NOT NULL,
    description TEXT NOT NULL,
    clearance_level_required INTEGER NOT NULL CHECK (clearance_level_required >= 1 AND clearance_level_required <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT,
    clearance_level INTEGER DEFAULT 1 NOT NULL CHECK (clearance_level >= 1 AND clearance_level <= 5)
);

-- Enable Row Level Security
ALTER TABLE public.scp_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for scp_items
CREATE POLICY "Allow public read access to scp_items" ON public.scp_items
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to scp_items" ON public.scp_items
    FOR INSERT WITH CHECK (true);

-- Policies for user_profiles
CREATE POLICY "Allow public read access to user_profiles" ON public.user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow users to insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Trigger for creating user profile automatically on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, clearance_level)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    1
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Seed data for scp_items
INSERT INTO public.scp_items (item_number, codename, object_class, containment_procedures, description, clearance_level_required)
VALUES 
(
  'SCP-173', 
  'The Sculpture', 
  'Euclid', 
  'Item SCP-173 is to be kept in a locked container at all times. When personnel must enter SCP-173''s container, no fewer than three may enter at any time and the door is to be relocked behind them. Two persons must maintain direct eye contact with SCP-173 at all times until all personnel have vacated and relocked the container.', 
  'Moved to Site-19 1993. Origin is as of yet unknown. It is constructed from concrete and rebar with traces of Krylon brand spray paint. SCP-173 is extremely hostile and active. The object cannot move while within a direct line of sight. Line of sight must not be broken at any time with SCP-173. Personnel assigned to enter container are instructed to alert one another before blinking.', 
  2
),
(
  'SCP-096', 
  'The Shy Guy', 
  'Euclid', 
  'SCP-096 is to be kept in its cell, a 5m x 5m x 5m airtight steel cube, at all times. Weekly checks for any cracks or holes are mandatory. There are to be absolutely no video surveillance or optical tools of any kind inside SCP-096''s cell.', 
  'SCP-096 is a humanoid creature measuring approximately 2.38 meters in height. Subject shows very little muscle mass, with preliminary analysis of body mass suggesting mild malnutrition. Arms are grossly out of proportion with the rest of the subject''s body, with an approximate length of 1.5 meters each. Skin is mostly devoid of pigmentation, with no sign of any body hair. When someone views SCP-096''s face (whether directly, via video recording, or even a photograph), it will enter a state of extreme emotional distress. SCP-096 will cover its face with its hands and begin screaming, crying, and babbling incoherently. Approximately one to two minutes after the first view, SCP-096 will begin running to the position of the individual who viewed its face (who will from this point on be referred to as SCP-096-1) to kill them.', 
  3
),
(
  'SCP-682', 
  'Hard-to-Destroy Reptile', 
  'Keter', 
  'SCP-682 must be destroyed as soon as possible. At this time, no means available to SCP teams are capable of destroying SCP-682, only able to cause massive physical damage. SCP-682 should be kept within a 5m x 5m x 5m chamber with 25cm reinforced acid-resistant steel plate lining all internal surfaces. The containment chamber should be filled with hydrochloric acid until SCP-682 is submerged and incapacitated.', 
  'SCP-682 is a large, vaguely reptile-like creature of unknown origin. It appears to be extremely intelligent, and was observed to engage in complex communication with SCP-079 during their limited time of exposure. SCP-682 appears to have a hatred of all life, which has been expressed in several interviews during containment. SCP-682 has always possessed extremely high strength, speed, and reflexes, though exact levels vary with its form. SCP-682''s physical body grows and changes very quickly, growling or decreasing in size as it consumes or sheds material.', 
  4
),
(
  'SCP-999', 
  'The Tickle Monster', 
  'Safe', 
  'SCP-999 is allowed to roam the facility freely if they desire, but otherwise must stay in its playpen. SCP-999 is not to be allowed out of its playpen at night, or off-facility grounds at any time. Playpen is to be kept clean, and food/water replaced daily.', 
  'SCP-999 appears to be a large, amorphous, gelatinous mass of translucent orange slime, weighing approximately 54 kg with a consistency similar to that of peanut butter. Subject''s temperament is best described as playful and dog-like. When approached, SCP-999 will react with overwhelming glee, slithering over to the nearest person and nudging them with its pseudopods while emitting high-pitched gurgling and cooing noises. The surface of SCP-999 emits a pleasing odor that varies depending on who it is interacting with (common scents include chocolate, fresh laundry, and play-doh). Simply touching SCP-999''s surface induces an immediate feeling of mild euphoria, which intensifies the longer one is exposed to SCP-999.', 
  1
),
(
  'SCP-3000', 
  'Anantashesha', 
  'Thaumiel', 
  'SCP-3000 is contained within the Bay of Bengal, designated Site-151. SCP-3000 is to be monitored constantly by Foundation naval assets. Under no circumstances are civilian vessels allowed near Site-151. Divers harvesting Y-909 compounds must be monitored for cognitive deterioration.', 
  'SCP-3000 is a massive, aquatic, serpentine entity located in the Bay of Bengal. Estimates place the length of the entity at approximately 600 to 900 kilometers. SCP-3000 is cognitively hazardous; direct observation of the entity or being in its proximity causes severe mental deterioration, memory loss, and hallucinations. Despite these dangers, SCP-3000 is the only known source of Y-909, a compound critical in the production of high-grade memory-erasing amnestics, making its containment and harvest a top priority for the Foundation.', 
  5
)
ON CONFLICT (item_number) DO NOTHING;
