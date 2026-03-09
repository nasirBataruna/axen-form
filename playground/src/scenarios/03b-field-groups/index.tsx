/**
 * Scenario 12 — Field Groups / Sections
 *
 * - FieldGroupConfig: visual sectioning of fields
 * - Mix flat fields + grouped fields in one form
 * - Each group gets a section header with styled separator
 */
import { AxenForm, AxenFormRef, defaultComponentMap, FieldConfig, FieldGroupConfig } from '@axenstudio/axen-form'
import { useRef, useState } from 'react'
import ScenarioLayout from '../../components/ScenarioLayout'

const fields: (FieldConfig | FieldGroupConfig)[] = [
  // --- Standalone field before any group ---
  { name: 'accountType', label: 'Account Type', type: 'select', required: true, options: [
    { value: 'personal', label: 'Personal' },
    { value: 'business', label: 'Business' },
  ], colSpan: 12 },

  // --- Group 1: Personal Information ---
  {
    group: 'Personal Information',
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text', required: true, colSpan: 6 },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true, colSpan: 6 },
      { name: 'email', label: 'Email', type: 'email', required: true, colSpan: 6 },
      { name: 'phone', label: 'Phone', type: 'phone', colSpan: 6 },
      { name: 'birthDate', label: 'Birth Date', type: 'date', colSpan: 6 },
      { name: 'gender', label: 'Gender', type: 'select', options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
      ], colSpan: 6 },
    ],
  },

  // --- Group 2: Address ---
  {
    group: 'Address',
    fields: [
      { name: 'street', label: 'Street', type: 'text', colSpan: 12 },
      { name: 'city', label: 'City', type: 'text', colSpan: 4 },
      { name: 'state', label: 'State', type: 'text', colSpan: 4 },
      { name: 'zipCode', label: 'Zip Code', type: 'text', colSpan: 4 },
      { name: 'country', label: 'Country', type: 'select', options: [
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'id', label: 'Indonesia' },
        { value: 'sg', label: 'Singapore' },
      ], colSpan: 6 },
    ],
  },

  // --- Group 3: Preferences ---
  {
    group: 'Preferences',
    fields: [
      { name: 'newsletter', label: 'Subscribe Newsletter', type: 'switch', colSpan: 6 },
      { name: 'notifications', label: 'Push Notifications', type: 'switch', colSpan: 6 },
      { name: 'notes', label: 'Additional Notes', type: 'textarea', rows: 2, colSpan: 12 },
    ],
  },
]

const initialValues = {
  accountType: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: '',
  gender: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  newsletter: false,
  notifications: false,
  notes: '',
}

const SOURCE_CODE = `import { AxenForm, FieldConfig, FieldGroupConfig } from '@axenstudio/axen-form'

const fields: (FieldConfig | FieldGroupConfig)[] = [
  // Standalone field (no group)
  { name: 'accountType', type: 'select', options: [...] },

  // Group 1 — section with header
  {
    group: 'Personal Information',
    fields: [
      { name: 'firstName', type: 'text', colSpan: 6 },
      { name: 'lastName', type: 'text', colSpan: 6 },
      { name: 'email', type: 'email', colSpan: 6 },
      { name: 'phone', type: 'phone', colSpan: 6 },
    ],
  },

  // Group 2
  {
    group: 'Address',
    fields: [
      { name: 'street', type: 'text', colSpan: 12 },
      { name: 'city', type: 'text', colSpan: 4 },
      { name: 'state', type: 'text', colSpan: 4 },
      { name: 'zipCode', type: 'text', colSpan: 4 },
    ],
  },

  // Group 3
  {
    group: 'Preferences',
    fields: [
      { name: 'newsletter', type: 'switch', colSpan: 6 },
      { name: 'notifications', type: 'switch', colSpan: 6 },
      { name: 'notes', type: 'textarea', colSpan: 12 },
    ],
  },
]

<AxenForm
  config={{ fields, initialValues }}
  components={defaultComponentMap}
  onSubmit={(values) => console.log(values)}
/>
// Each group renders a styled section header
// Fields inherit parent grid layout`

export default function S12FieldGroups() {
  const formRef = useRef<AxenFormRef>(null)
  const [result, setResult] = useState<unknown>()

  return (
    <ScenarioLayout
      title="Field Groups / Sections"
      description="Organize fields into visual sections using FieldGroupConfig."
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
        <button className="btn btn-primary" onClick={() => formRef.current?.submit()}>Submit</button>
        <button className="btn btn-outline" onClick={() => { formRef.current?.resetForm(); setResult(undefined) }}>Reset</button>
      </div>
    </ScenarioLayout>
  )
}
