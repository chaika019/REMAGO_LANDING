// Explicit, reproducible lab profiles. Mobile networks vary; these are not speed guarantees.
export const profiles = [
  { id: '2g', name: '2G', downloadMbps: 0.25, uploadMbps: 0.05, latencyMs: 800, timeoutMs: 240000 },
  { id: '3g', name: '3G', downloadMbps: 0.75, uploadMbps: 0.25, latencyMs: 400, timeoutMs: 120000 },
  { id: '4g-slow', name: 'Slow 4G', downloadMbps: 1.6, uploadMbps: 0.75, latencyMs: 150, timeoutMs: 90000 },
  { id: '4g-fast', name: 'Fast 4G', downloadMbps: 9, uploadMbps: 1.5, latencyMs: 60, timeoutMs: 60000 },
]
export function selectProfiles(value) {
  const ids = value ? value.split(',').map(id => id.trim()) : profiles.map(profile => profile.id)
  if (!ids.length || new Set(ids).size !== ids.length || ids.some(id => !profiles.some(profile => profile.id === id))) {
    throw new Error('REMAGO_PERF_PROFILES: use unique 2g,3g,4g-slow,4g-fast IDs')
  }
  return ids.map(id => profiles.find(profile => profile.id === id))
}
export function median(values) {
  if (!values.length) return null
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}
export function validRun(run) {
  return !run.failed && !run.navigationError && Number.isFinite(run.lcp) && run.lcp > 0 &&
    Number.isFinite(run.fcp) && run.fcp > 0 && Number.isFinite(run.cls) && run.cls >= 0 &&
    run.errors?.length === 0 && run.imageAudit?.complete === true && run.imageAudit.problems.length === 0
}
export function meetsBudget(run) {
  return validRun(run) && run.lcp <= 3000 && run.cls <= 0.1
}
