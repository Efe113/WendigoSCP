-- Insert additional Ethics Committee mainframe configuration keys into system_config
INSERT INTO public.system_config (key, value) VALUES
  ('ethics_compliance_score', '88'),
  ('dclass_protocol', 'humane'),
  ('whistleblower_protection', 'true'),
  ('sentient_testing_block', 'true'),
  ('termination_moratorium', 'false'),
  ('auto_suspension_complaints', 'true'),
  ('amnestic_ec_override', 'false'),
  ('ethics_violation_condition', 'LEVEL_GREEN')
ON CONFLICT (key) DO NOTHING;
