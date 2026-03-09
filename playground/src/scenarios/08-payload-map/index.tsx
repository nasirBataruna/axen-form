/**
 * Scenario 08 — Payload Map
 *
 * - payloadFields: string[] — static whitelist
 * - payloadFields: Record<string, string[]> — dynamic per discriminator
 * - payloadDiscriminator — field name that selects which payload set
 */
import { AxenForm, AxenFormRef, defaultComponentMap, FieldConfig } from '@axenstudio/axen-form'
import { useRef, useState } from 'react'
import ScenarioLayout from '../../components/ScenarioLayout'

// --- Static payloadFields demo ---
const staticFields: FieldConfig[] = [
  { name: 'fullName', label: 'Full Name', type: 'text', required: true, colSpan: 6 },
  { name: 'email', label: 'Email', type: 'email', required: true, colSpan: 6 },
  { name: 'internalNotes', label: 'Internal Notes (excluded)', type: 'textarea', rows: 2, colSpan: 12, helperText: 'This field is NOT in payloadFields — will be excluded from submit' },
  { name: 'debugFlag', label: 'Debug Flag (excluded)', type: 'switch', colSpan: 12, helperText: 'Also excluded from submitted payload' },
]

const staticInitial = { fullName: '', email: '', internalNotes: '', debugFlag: false }

// --- Dynamic payloadFields demo ---
const dynamicFields: FieldConfig[] = [
  {
    name: 'entityType',
    label: 'Entity Type',
    type: 'select',
    required: true,
    options: [
      { value: 'person', label: 'Person' },
      { value: 'company', label: 'Company' },
    ],
    colSpan: 12,
  },
  { name: 'firstName', label: 'First Name', type: 'text', colSpan: 6, hidden: (values: Record<string, unknown>) => values.entityType !== 'person' },
  { name: 'lastName', label: 'Last Name', type: 'text', colSpan: 6, hidden: (values: Record<string, unknown>) => values.entityType !== 'person' },
  { name: 'companyName', label: 'Company Name', type: 'text', colSpan: 6, hidden: (values: Record<string, unknown>) => values.entityType !== 'company' },
  { name: 'taxId', label: 'Tax ID', type: 'text', colSpan: 6, hidden: (values: Record<string, unknown>) => values.entityType !== 'company' },
  { name: 'email', label: 'Email', type: 'email', colSpan: 12 },
]

const dynamicInitial = {
  entityType: 'person',
  firstName: '',
  lastName: '',
  companyName: '',
  taxId: '',
  email: '',
}

const SOURCE_CODE = `// Static payloadFields — whitelist array
<AxenForm
  config={{ fields: staticFields, initialValues }}
  payloadFields={['fullName', 'email']}
  onSubmit={(values) => console.log(values)}
/>
// → Only fullName, email included in submit payload

// Dynamic payloadFields — discriminator-based
const dynamicFields = [
  { name: 'entityType', type: 'select', options: [...] },
  { name: 'firstName', type: 'text',
    hidden: (v) => v.entityType !== 'person' },
  { name: 'companyName', type: 'text',
    hidden: (v) => v.entityType !== 'company' },
]

<AxenForm
  config={{ fields: dynamicFields, initialValues }}
  payloadFields={{
    person:  ['firstName', 'lastName', 'email'],
    company: ['companyName', 'taxId', 'email'],
  }}
  payloadDiscriminator="entityType"
  onSubmit={(values) => console.log(values)}
/>`

export default function S08PayloadMap() {
  const staticRef = useRef<AxenFormRef>(null)
  const dynamicRef = useRef<AxenFormRef>(null)
  const [staticResult, setStaticResult] = useState<unknown>()
  const [dynamicResult, setDynamicResult] = useState<unknown>()

  return (
    <>
      <ScenarioLayout
        title="Payload Map — Static"
        description="Only whitelisted fields are included in the submitted payload."
        result={staticResult}
        sourceCode={SOURCE_CODE}
      >
        <p style={{ fontSize: '0.9em', color: '#666', marginBottom: 12 }}>
          Only <code>fullName</code> and <code>email</code> are submitted.{' '}
          <code>internalNotes</code> and <code>debugFlag</code> are excluded.
        </p>
        <AxenForm
          ref={staticRef}
          config={{ fields: staticFields, initialValues: staticInitial }}
          components={defaultComponentMap}
          onSubmit={(values) => setStaticResult(values)}
          payloadFields={['fullName', 'email']}
          gap="12px"
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className="btn btn-primary" onClick={() => staticRef.current?.submit()}>Submit (Static)</button>
          <button className="btn btn-outline" onClick={() => { staticRef.current?.resetForm(); setStaticResult(undefined) }}>Reset</button>
        </div>
      </ScenarioLayout>

      <ScenarioLayout
        title="Payload Map — Dynamic Discriminator"
        description="Payload fields change based on the discriminator value."
        result={dynamicResult}
      >
        <p style={{ fontSize: '0.9em', color: '#666', marginBottom: 12 }}>
          When entity = Person → only firstName, lastName, email submitted.<br />
          When entity = Company → only companyName, taxId, email submitted.
        </p>
        <AxenForm
          ref={dynamicRef}
          config={{ fields: dynamicFields, initialValues: dynamicInitial }}
          components={defaultComponentMap}
          onSubmit={(values) => setDynamicResult(values)}
          payloadFields={{
            person: ['firstName', 'lastName', 'email'],
            company: ['companyName', 'taxId', 'email'],
          }}
          payloadDiscriminator="entityType"
          gap="12px"
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className="btn btn-primary" onClick={() => dynamicRef.current?.submit()}>Submit (Dynamic)</button>
          <button className="btn btn-outline" onClick={() => { dynamicRef.current?.resetForm(); setDynamicResult(undefined) }}>Reset</button>
        </div>
      </ScenarioLayout>
    </>
  )
}
