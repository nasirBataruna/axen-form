/**
 * Scenario 09 — Form Context
 *
 * - useFormContext hook for accessing form state in child components
 * - Read values, errors, dirty, isSubmitting from context
 */
import { AxenForm, AxenFormRef, defaultComponentMap, FieldConfig, useFormContext } from '@axenstudio/axen-form'
import { useRef, useState } from 'react'
import ScenarioLayout from '../../components/ScenarioLayout'

const fields: FieldConfig[] = [
  { name: 'firstName', label: 'First Name', type: 'text', required: true, colSpan: 6 },
  { name: 'lastName', label: 'Last Name', type: 'text', required: true, colSpan: 6 },
  { name: 'email', label: 'Email', type: 'email', required: true, colSpan: 12 },
  { name: 'role', label: 'Role', type: 'select', options: [
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
  ], colSpan: 6 },
  { name: 'active', label: 'Active', type: 'switch', colSpan: 6 },
]

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  active: false,
}

/**
 * Child component that uses useFormContext to display live form state.
 * Must be rendered inside AxenForm's children slot.
 */
function FormStateViewer() {
  const { store } = useFormContext()
  const state = store.getState()

  return (
    <div style={{
      marginTop: 16,
      padding: 12,
      border: '1px solid var(--axen-border, #ddd)',
      borderRadius: 8,
      background: '#f8f9fa',
    }}>
      <h4 style={{ marginBottom: 8 }}>Live Form State (via useFormContext)</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.9em' }}>
        <div>
          <strong>dirty:</strong> {String(state.dirty)}
        </div>
        <div>
          <strong>isSubmitting:</strong> {String(state.isSubmitting)}
        </div>
        <div>
          <strong>submitCount:</strong> {state.submitCount}
        </div>
        <div>
          <strong>isValid:</strong> {String(Object.keys(state.errors).length === 0)}
        </div>
      </div>
      <details style={{ marginTop: 8 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Values</summary>
        <pre style={{ fontSize: '0.85em', marginTop: 4 }}>
          {JSON.stringify(state.values, null, 2)}
        </pre>
      </details>
      <details style={{ marginTop: 4 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Errors</summary>
        <pre style={{ fontSize: '0.85em', marginTop: 4 }}>
          {JSON.stringify(state.errors, null, 2)}
        </pre>
      </details>
      <details style={{ marginTop: 4 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Touched</summary>
        <pre style={{ fontSize: '0.85em', marginTop: 4 }}>
          {JSON.stringify(state.touched, null, 2)}
        </pre>
      </details>
    </div>
  )
}

/**
 * Child component that uses context to set field values programmatically.
 */
function QuickFill() {
  const { store } = useFormContext()

  return (
    <div style={{ marginTop: 12 }}>
      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={() => {
          store.setFieldValue('firstName', 'John')
          store.setFieldValue('lastName', 'Doe')
          store.setFieldValue('email', 'john@example.com')
          store.setFieldValue('role', 'admin')
          store.setFieldValue('active', true)
        }}
      >
        Quick Fill (via context)
      </button>
    </div>
  )
}

const SOURCE_CODE = `// useFormContext — access form state in child components
function FormStateViewer() {
  const { store } = useFormContext()
  const state = store.getState()

  return (
    <div>
      <p>dirty: {String(state.dirty)}</p>
      <p>isSubmitting: {String(state.isSubmitting)}</p>
      <pre>{JSON.stringify(state.values, null, 2)}</pre>
    </div>
  )
}

// Quick Fill — set values programmatically
function QuickFill() {
  const { store } = useFormContext()
  return (
    <button onClick={() => {
      store.setFieldValue('firstName', 'John')
      store.setFieldValue('email', 'john@example.com')
    }}>Quick Fill</button>
  )
}

// Render children inside AxenForm to access context
<AxenForm
  config={{ fields, initialValues }}
  components={defaultComponentMap}
  onSubmit={(values) => console.log(values)}
>
  <FormStateViewer />
  <QuickFill />
</AxenForm>`

export default function S09FormContext() {
  const formRef = useRef<AxenFormRef>(null)
  const [result, setResult] = useState<unknown>()

  return (
    <ScenarioLayout
      title="Form Context"
      description="Child components access form state via useFormContext hook."
      result={result}
      sourceCode={SOURCE_CODE}
    >
      <AxenForm
        ref={formRef}
        config={{ fields, initialValues }}
        components={defaultComponentMap}
        onSubmit={(values) => setResult(values)}
        gap="12px"
      >
        <FormStateViewer />
        <QuickFill />
      </AxenForm>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button className="btn btn-primary" onClick={() => formRef.current?.submit()}>Submit</button>
        <button className="btn btn-outline" onClick={() => { formRef.current?.resetForm(); setResult(undefined) }}>Reset</button>
      </div>
    </ScenarioLayout>
  )
}
