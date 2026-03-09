/**
 * Scenario 01 — Basic Form
 *
 * - Config-driven form via FieldConfig[]
 * - Built-in field components (no external UI lib)
 * - Submit via AxenFormRef
 * - Reset form
 */
import { AxenForm, AxenFormRef, defaultComponentMap, FieldConfig } from '@axenstudio/axen-form'
import { useRef, useState } from 'react'
import ScenarioLayout from '../../components/ScenarioLayout'

const fields: FieldConfig[] = [
  { name: 'fullName', label: 'Full Name', type: 'text', required: true, colSpan: 12 },
  { name: 'email', label: 'Email', type: 'email', required: true, colSpan: 6 },
  { name: 'age', label: 'Age', type: 'number', colSpan: 6 },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    required: true,
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'user', label: 'User' },
      { value: 'viewer', label: 'Viewer' },
    ],
    colSpan: 6,
  },
  { name: 'bio', label: 'Bio', type: 'textarea', rows: 3, colSpan: 12 },
  { name: 'subscribe', label: 'Subscribe to newsletter', type: 'checkbox', colSpan: 12 },
]

const initialValues = {
  fullName: '',
  email: '',
  age: '',
  role: '',
  bio: '',
  subscribe: false,
}

const SOURCE_CODE = `const fields: FieldConfig[] = [
  { name: 'fullName', label: 'Full Name', type: 'text', required: true, colSpan: 12 },
  { name: 'email', label: 'Email', type: 'email', required: true, colSpan: 6 },
  { name: 'age', label: 'Age', type: 'number', colSpan: 6 },
  {
    name: 'role', label: 'Role', type: 'select', required: true,
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'user', label: 'User' },
      { value: 'viewer', label: 'Viewer' },
    ],
    colSpan: 6,
  },
  { name: 'bio', label: 'Bio', type: 'textarea', rows: 3, colSpan: 12 },
  { name: 'subscribe', label: 'Subscribe to newsletter', type: 'checkbox', colSpan: 12 },
]

<AxenForm
  ref={formRef}
  config={{ fields, initialValues }}
  components={defaultComponentMap}
  onSubmit={(values) => setResult(values)}
  gap="12px"
/>`

export default function S01Basic() {
  const formRef = useRef<AxenFormRef>(null)
  const [result, setResult] = useState<unknown>()

  return (
    <ScenarioLayout
      title="Basic Form"
      description="Config-driven form with 6 fields, required validation, submit via ref."
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
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button className="btn btn-primary" onClick={() => formRef.current?.submit()}>
          Submit
        </button>
        <button className="btn btn-outline" onClick={() => { formRef.current?.resetForm(); setResult(undefined) }}>
          Reset
        </button>
      </div>
    </ScenarioLayout>
  )
}
