import { useMemo } from 'react'

const KEYWORDS = new Set([
  'import', 'from', 'export', 'default', 'const', 'let', 'var',
  'function', 'return', 'if', 'else', 'type', 'interface', 'as',
  'async', 'await', 'new', 'typeof', 'switch', 'case', 'satisfies',
  'break', 'for', 'of', 'in', 'class', 'extends', 'readonly',
])

const LITERALS = new Set(['true', 'false', 'null', 'undefined'])

function highlightCode(code: string): string {
  const escaped = code.replace(/[&<>]/g, (c) =>
    c === '&' ? '&amp;' : c === '<' ? '&lt;' : '&gt;',
  )

  const TOKEN =
    /\/\/[^\n]*|\/\*[\s\S]*?\*\/|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`|\b[a-zA-Z_$]\w*\b|\b\d+(?:\.\d+)?\b/g

  return escaped.replace(TOKEN, (match) => {
    if (match.startsWith('//') || match.startsWith('/*'))
      return `<span class="sh-cmt">${match}</span>`
    if (match[0] === "'" || match[0] === '"' || match[0] === '`')
      return `<span class="sh-str">${match}</span>`
    if (KEYWORDS.has(match)) return `<span class="sh-kw">${match}</span>`
    if (LITERALS.has(match)) return `<span class="sh-lit">${match}</span>`
    if (/^\d/.test(match)) return `<span class="sh-num">${match}</span>`
    return match
  })
}

interface Props {
  code: string
}

export default function SourceHighlighter({ code }: Readonly<Props>) {
  const html = useMemo(() => highlightCode(code.trim()), [code])

  return (
    <pre
      className="source-pre"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
