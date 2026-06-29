-- Insert additional O5-1 mainframe configuration keys into system_config
INSERT INTO public.system_config (key, value) VALUES
  ('red_alert', 'false'),
  ('blackout_mode', 'false'),
  ('alpha_warhead_active', 'false'),
  ('alpha_warhead_time', '90'),
  ('mtf_dispatched', 'None'),
  ('redaction_level', 'hover'),
  ('sound_warnings', 'false'),
  ('site_lockdown_sectors', 'None'),
  ('amnestic_stock_a', '100'),
  ('amnestic_stock_b', '100'),
  ('amnestic_stock_c', '100'),
  ('security_alarm', 'false'),
  ('radiation_threshold', '0.05'),
  ('intrusion_attempts', '0'),
  ('scanline_density', 'medium'),
  ('key_rotation_date', '2026-06-01'),
  ('ethics_audits', 'true'),
  ('exposure_warning', 'false'),
  ('eval_interval_days', '30'),
  ('cog_filter_strength', '100')
ON CONFLICT (key) DO NOTHING;
