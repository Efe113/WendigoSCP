-- Add metadata JSONB column to scp_items
ALTER TABLE public.scp_items 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb NOT NULL;
