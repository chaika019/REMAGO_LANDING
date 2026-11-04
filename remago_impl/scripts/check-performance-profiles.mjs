import test from 'node:test'
import assert from 'node:assert/strict'
import { profiles, selectProfiles, median, validRun, meetsBudget } from './performance-profiles.mjs'

test('all requested networks are present and ordered by increasing bandwidth', () => {
  assert.deepEqual(selectProfiles().map(profile => profile.id), ['2g', '3g', '4g-slow', '4g-fast'])
  for (let index = 1; index < profiles.length; index++) {
    assert.ok(profiles[index].downloadMbps > profiles[index - 1].downloadMbps)
    assert.ok(profiles[index].latencyMs < profiles[index - 1].latencyMs)
  }
  assert.deepEqual(selectProfiles('4g-fast,2g').map(profile => profile.id), ['4g-fast', '2g'])
  for (const invalid of ['', 'lte', '2g,2g', '2g,']) {
    if (invalid) assert.throws(() => selectProfiles(invalid))
  }
})
test('median preserves missing data and handles even and odd samples', () => {
  assert.equal(median([]), null)
  assert.equal(median([8, 1, 3]), 3)
  assert.equal(median([8, 1, 3, 4]), 3.5)
})
test('fast first paint cannot mask a failed or incomplete image audit', () => {
  const run = { lcp: 1000, fcp: 800, cls: 0.02, errors: [], imageAudit: { complete: true, problems: [] } }
  assert.ok(validRun(run))
  assert.ok(meetsBudget(run))
  assert.equal(validRun({ ...run, imageAudit: { complete: false, problems: [] } }), false)
  assert.equal(validRun({ ...run, imageAudit: { complete: true, problems: [{ url: '/broken.webp' }] } }), false)
  assert.equal(validRun({ ...run, navigationError: 'timeout' }), false)
  assert.equal(validRun({ ...run, lcp: null }), false)
  for (const cls of [null, undefined, NaN, -0.01]) {
    assert.equal(validRun({ ...run, cls }), false)
    assert.equal(meetsBudget({ ...run, cls }), false)
  }
  assert.equal(validRun({ ...run, lcp: 0 }), false)
  assert.equal(validRun({ ...run, fcp: -1 }), false)
  assert.equal(validRun({ ...run, errors: ['404'] }), false)
  assert.equal(meetsBudget({ ...run, cls: 0.101 }), false)
  assert.equal(meetsBudget({ ...run, lcp: 3001 }), false)
})
