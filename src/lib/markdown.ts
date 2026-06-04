import DOMPurify from 'dompurify'
import { marked } from 'marked'

export const markdownToPlainText = (source: string): string => {
  if (!source)
    return ''
  const html = marked.parse(source) as string
  const safeHtml = DOMPurify.sanitize(html)
  const doc = new DOMParser().parseFromString(safeHtml, 'text/html')
  const text = doc.body.textContent ?? ''
  return text
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
