import { type ReactNode, useState } from 'react'
import SourceHighlighter from './SourceHighlighter'

interface Props {
  title: string
  description?: string
  children: ReactNode
  result?: unknown
  sourceCode?: string
}

export default function ScenarioLayout({ title, description, children, result, sourceCode }: Readonly<Props>) {
  const [activeTab, setActiveTab] = useState<'result' | 'source'>('result')

  return (
    <div className="panel-grid">
      <div className="panel form-panel">
        <h3>{title}</h3>
        {description && <p style={{ fontSize: 14, color: '#666', margin: '0 0 8px' }}>{description}</p>}
        <hr />
        {children}
      </div>

      <div className="panel result-panel">
        <div className="tab-bar">
          <button
            className={`tab-btn ${activeTab === 'result' ? 'active' : ''}`}
            onClick={() => setActiveTab('result')}
          >
            Submit Result
          </button>
          {sourceCode && (
            <button
              className={`tab-btn ${activeTab === 'source' ? 'active' : ''}`}
              onClick={() => setActiveTab('source')}
            >
              Source Code
            </button>
          )}
        </div>
        <hr />
        {activeTab === 'result' ? (
          result === undefined ? (
            <p className="result-empty">Submit the form to see the output here.</p>
          ) : (
            <pre className="result-pre">{JSON.stringify(result, null, 2)}</pre>
          )
        ) : sourceCode ? (
          <SourceHighlighter code={sourceCode} />
        ) : null}
      </div>
    </div>
  )
}
