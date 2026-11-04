import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { faqItems } from '../src/data/site.ts'

// Independent transcription from the downloaded Figma PDF, not from site.ts.
const reference = JSON.parse(readFileSync(new URL('./references/faq-copy.json', import.meta.url), 'utf8'))
assert.equal(faqItems.length, reference.items.length, 'FAQ question count')

for (const [index, item] of reference.items.entries()) {
  const expectedQuestion = reference.questionOverrides[String(index)]?.text ?? item.q
  assert.equal(faqItems[index].q, expectedQuestion, `FAQ ${index + 1}: question`)
  assert.equal(faqItems[index].a, item.a, `FAQ ${index + 1}: answer`)
}

console.log('FAQ: all 7 answers and 7 questions match the recorded reference and explicit user correction')
