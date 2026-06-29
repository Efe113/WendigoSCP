-- Create scp_addenda table
CREATE TABLE IF NOT EXISTS public.scp_addenda (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    scp_item_id UUID REFERENCES public.scp_items(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('addendum', 'report', 'incident_log', 'interview', 'note')),
    clearance_level_required INTEGER DEFAULT 1 NOT NULL CHECK (clearance_level_required >= 1 AND clearance_level_required <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create scp_resources table
CREATE TABLE IF NOT EXISTS public.scp_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    scp_item_id UUID REFERENCES public.scp_items(id) ON DELETE CASCADE NOT NULL,
    caption TEXT,
    url TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'audio')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.scp_addenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scp_resources ENABLE ROW LEVEL SECURITY;

-- Policies for scp_addenda
CREATE POLICY "Allow public read access to scp_addenda" ON public.scp_addenda
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to scp_addenda" ON public.scp_addenda
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to scp_addenda" ON public.scp_addenda
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to scp_addenda" ON public.scp_addenda
    FOR DELETE USING (true);

-- Policies for scp_resources
CREATE POLICY "Allow public read access to scp_resources" ON public.scp_resources
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to scp_resources" ON public.scp_resources
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to scp_resources" ON public.scp_resources
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to scp_resources" ON public.scp_resources
    FOR DELETE USING (true);

-- Seed data for scp_addenda
INSERT INTO public.scp_addenda (scp_item_id, title, content, type, clearance_level_required)
SELECT 
    id, 
    'Addendum 173-1: Test Log', 
    'Class D personnel D-4322, D-9821, and D-0012 entered the containment chamber. Line of sight was broken when D-4322 blinked without alerting others. D-4322 was immediately ||neutralized via cervical fracture||. Remaining personnel safely exited.', 
    'addendum', 
    2
FROM public.scp_items WHERE item_number = 'SCP-173'
ON CONFLICT DO NOTHING;

INSERT INTO public.scp_addenda (scp_item_id, title, content, type, clearance_level_required)
SELECT 
    id, 
    'Addendum 096-1: Incident 096-A-1', 
    'A civilian in ||suburban Montana|| accidentally viewed a tiny speck of light in a vacation photograph taken 20 years ago. The speck was determined to be 4 pixels representing SCP-096. Subject entered distressed state, breached containment, ran ||14,000 miles|| to reach the target, and eliminated them. Recovered photo has been burned.', 
    'incident_log', 
    3
FROM public.scp_items WHERE item_number = 'SCP-096'
ON CONFLICT DO NOTHING;

INSERT INTO public.scp_addenda (scp_item_id, title, content, type, clearance_level_required)
SELECT 
    id, 
    'Addendum 682-1: Termination Test Log', 
    '[warn] WARNING: ALL TERMINATION ATTEMPTS MUST BE SANCTIONED BY O5 COMMAND. [/warn] \nAttempt 43-B: Exposure to SCP-173. SCP-682 was placed in chamber with SCP-173. SCP-682 maintained eye contact for 48 hours without blinking, growing multiple eyes on its outer carapace to prevent line of sight failure.', 
    'incident_log', 
    4
FROM public.scp_items WHERE item_number = 'SCP-682'
ON CONFLICT DO NOTHING;
