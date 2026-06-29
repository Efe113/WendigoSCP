/**
 * Dynamic Security Clearance Calculator
 * Computes the required clearance level of an SCP entity based on its 40+ metadata parameters.
 */
export function calculateEscalatedClearance(baseClearance: number, metadata: any = {}): number {
  let score = Number(baseClearance) || 3

  // 1. Risk Class adjustments
  if (metadata.risk_class === 'Critical') score += 1.2
  else if (metadata.risk_class === 'Danger') score += 0.8
  else if (metadata.risk_class === 'Warning') score += 0.4
  else if (metadata.risk_class === 'Notice') score -= 0.4

  // 2. Disruption Class adjustments
  if (metadata.disruption_class === 'Amida') score += 1.0
  else if (metadata.disruption_class === 'Ekhi') score += 0.6
  else if (metadata.disruption_class === 'Keneq') score += 0.3

  // 3. Threat Level adjustments
  if (metadata.threat_level === 'Red') score += 0.8
  else if (metadata.threat_level === 'Black') score += 1.5
  else if (metadata.threat_level === 'Green' || metadata.threat_level === 'White') score -= 0.5

  // 4. Biological, Cognitive, Memetic, or Temporal Hazards
  if (metadata.biological_hazard === 'Yes') score += 0.5
  if (metadata.cognitive_threat === 'Yes') score += 0.5
  if (metadata.memetic_hazard === 'Yes') score += 0.5
  if (metadata.temporal_hazard === 'Yes') score += 0.7

  // 5. Sentience & Guards Count
  if (metadata.sentience_status === 'Sapient') score += 0.5
  const guards = parseInt(metadata.tactical_guards) || 0
  if (guards > 10) score += 1.0
  else if (guards > 5) score += 0.5

  // 6. Special Protocols
  if (metadata.termination_protocol === 'Yes') score += 1.0
  if (metadata.ethics_clearance === 'No') score += 0.4

  // 7. Alternate Dimension origin
  if (metadata.alternate_dimension === 'Yes') score += 0.4

  // Clamp level between 1 and 5
  return Math.max(1, Math.min(5, Math.round(score)))
}
