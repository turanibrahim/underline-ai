import { describe, expect, it } from 'vitest'
import { markdownToPlainText } from './markdown'

describe('markdownToPlainText', () => {
  it('returns empty string for empty input', () => {
    expect(markdownToPlainText('')).toBe('')
  })

  it('extracts plain text from a simple heading', () => {
    const out = markdownToPlainText('# Hello world')
    expect(out).toBe('Hello world')
  })

  it('renders bullet list items on separate lines', () => {
    const out = markdownToPlainText('- first\n- second\n- third')
    expect(out.split('\n')).toEqual(['first', 'second', 'third'])
  })

  it('collapses runs of blank lines after HTML whitespace normalization', () => {
    const out = markdownToPlainText('a\n\n\n\n\nb')
    expect(out).not.toMatch(/\n{3,}/)
  })

  it('strips trailing whitespace from each line', () => {
    const out = markdownToPlainText('a   \nb')
    expect(out).not.toMatch(/ \n/)
    expect(out).not.toMatch(/[ \t]$/m)
  })
})
