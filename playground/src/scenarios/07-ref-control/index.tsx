/**
 * Scenario 07 — Ref Control
 *
 * - AxenFormRef imperative API
 * - submit(), resetForm(), getValues(), getErrors(), isValid(), isDirty()
 */
import { AxenForm, AxenFormRef, defaultComponentMap, FieldConfig } from '@axenstudio/axen-form'
import { useRef, useState } from 'react'
import ScenarioLayout from '../../components/ScenarioLayout'

const SOURCE_CODE = `import { useRef } from 'react'
import type { AxenFormRef } from '@axenstudio/axen-form'

const formRef = useRef<AxenFormRef>(null)

<AxenForm ref={formRef} config={config} components={defaultComponentMap} onSubmit={handleSubmit} />

// Imperative API
formRef.current?.submit()           // Trigger form submit
formRef.current?.resetForm()        // Reset to initial values
formRef.current?.resetForm(values)  // Reset with new values
formRef.current?.getValues()        // Get current values
formRef.current?.getErrors()        // Get validation errors
formRef.current?.isValid()          // Check if valid
formRef.current?.isDirty()          // Check if changed`

const fields: FieldConfig[] = [
  { name: 'username', label: 'Username', type: 'text', required: true, colSpan: 6 },
  { name: 'email', label: 'Email', type: 'email', required: true, colSpan: 6 },
  { name: 'age', label: 'Age', type: 'number', min: 18, max: 120, colSpan: 6 },
  { name: 'bio', label: 'Bio', type: 'textarea', rows: 3, colSpan: 12 },
]

const initialValues = {
  username: '',
  email: '',
  age: 0,
  bio: '',
}

export default function S07RefControl() {
  const formRef = useRef<AxenFormRef>(null)
  const [result, setResult] = useState<unknown>()
  const [refOutput, setRefOutput] = useState<string>('')

  const logAction = (label: string, data: unknown) => {
    setRefOutput(prev => `${label}: ${JSON.stringify(data, null, 2)}\n\n${prev}`)
  }

  return (
    <ScenarioLayout
      title="AxenFormRef Imperative Control"
      description="Call AxenFormRef methods programmatically to read/control form state."
      result={result}
      sourceCode={SOURCE_CODE}
    >
      <AxenForm
        ref={formRef}
        config={{ fields, initialValues }}
        components={defaultComponentMap}
        onSubmit={(values) => setResult(values)}
        gap="12px"
      />

      <div style={{ marginTop: 16 }}>
        <h4 style={{ marginBottom: 8 }}>Ref Actions</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button className="btn btn-primary" onClick={() => formRef.current?.submit()}>
            submit()
          </button>
          <button className="btn btn-outline" onClick={() => {
            formRef.current?.resetForm()
            setResult(undefined)
            logAction('resetForm()', 'done')
          }}>
            resetForm()
          </button>
          <button className="btn btn-outline" onClick={() => {
            const v = formRef.current?.getValues()
            logAction('getValues()', v)
          }}>
            getValues()
          </button>
          <button className="btn btn-outline" onClick={() => {
            const e = formRef.current?.getErrors()
            logAction('getErrors()', e)
          }}>
            getErrors()
          </button>
          <button className="btn btn-outline" onClick={() => {
            const valid = formRef.current?.isValid()
            logAction('isValid()', valid)
          }}>
            isValid()
          </button>
          <button className="btn btn-outline" onClick={() => {
            const dirty = formRef.current?.isDirty()
            logAction('isDirty()', dirty)
          }}>
            isDirty()
          </button>
          <button className="btn btn-outline" onClick={() => {
            formRef.current?.resetForm({ username: 'prefilled', email: 'test@example.com', age: 25, bio: 'Hello!' })
            logAction('resetForm(newValues)', { username: 'prefilled', email: 'test@example.com' })
          }}>
            resetForm(values)
          </button>
        </div>
      </div>

      {refOutput && (
        <div style={{ marginTop: 16 }}>
          <h4 style={{ marginBottom: 8 }}>Ref Output Log</h4>
          <pre className="result-pre" style={{ maxHeight: 200, overflow: 'auto', fontSize: '0.85em' }}>
            {refOutput}
          </pre>
        </div>
      )}
    </ScenarioLayout>
  )
}
