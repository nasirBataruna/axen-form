/**
 * Scenario 02 — All 19 Field Types
 *
 * Showcases every built-in field type:
 * text, email, password, phone, textarea, number, currency, slider,
 * date, time, datetime, select, checkbox, radio, switch, color,
 * autocomplete, autocomplete-multi, autocomplete-predict
 */
import { AxenForm, AxenFormRef, defaultComponentMap, FieldConfig } from '@axenstudio/axen-form'
import { useRef, useState } from 'react'
import ScenarioLayout from '../../components/ScenarioLayout'

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
]

const colorOptions = [
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
]

const tagOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
]

const fields: FieldConfig[] = [
  // Text Inputs
  { name: 'text', label: 'Text', type: 'text', colSpan: 6 },
  { name: 'email', label: 'Email', type: 'email', colSpan: 6 },
  { name: 'password', label: 'Password', type: 'password', colSpan: 6 },
  { name: 'phone', label: 'Phone', type: 'phone', colSpan: 6 },
  { name: 'textarea', label: 'Textarea', type: 'textarea', rows: 2, colSpan: 12 },

  // Numeric
  { name: 'number', label: 'Number', type: 'number', min: 0, max: 100, step: 1, colSpan: 4 },
  { name: 'currency', label: 'Currency (IDR)', type: 'currency', currency: 'IDR', locale: 'id-ID', colSpan: 4 },
  { name: 'slider', label: 'Slider', type: 'slider', min: 0, max: 100, step: 5, colSpan: 4 },

  // Date & Time
  { name: 'date', label: 'Date', type: 'date', colSpan: 4 },
  { name: 'time', label: 'Time', type: 'time', colSpan: 4 },
  { name: 'datetime', label: 'Date & Time', type: 'datetime', colSpan: 4 },

  // Selection
  { name: 'select', label: 'Select', type: 'select', options: roleOptions, colSpan: 6 },
  { name: 'radio', label: 'Favorite Color', type: 'radio', options: colorOptions, colSpan: 6 },
  { name: 'checkbox', label: 'Accept Terms', type: 'checkbox', colSpan: 6 },
  { name: 'switch', label: 'Dark Mode', type: 'switch', colSpan: 6 },

  // Misc
  { name: 'color', label: 'Brand Color', type: 'color', colSpan: 6 },

  // Autocomplete
  { name: 'autocomplete', label: 'Autocomplete', type: 'autocomplete', options: roleOptions, colSpan: 6 },
  {
    name: 'autocompleteMulti',
    label: 'Multi-Select Tags',
    type: 'autocomplete-multi',
    options: tagOptions,
    colSpan: 6,
  },
  {
    name: 'autocompletePredict',
    label: 'Predict (type to see ghost text)',
    type: 'autocomplete-predict',
    options: tagOptions,
    colSpan: 6,
  },
]

const initialValues: Record<string, unknown> = {
  text: '',
  email: '',
  password: '',
  phone: '',
  textarea: '',
  number: '',
  currency: '',
  slider: 50,
  date: '',
  time: '',
  datetime: '',
  select: '',
  radio: '',
  checkbox: false,
  switch: false,
  color: '#1a73e8',
  autocomplete: '',
  autocompleteMulti: [],
  autocompletePredict: '',
}

const SOURCE_CODE = `// 19 built-in field types:
// text, email, password, phone, textarea,
// number, currency, slider,
// date, time, datetime,
// select, checkbox, radio, switch,
// autocomplete, autocomplete-multi, autocomplete-predict,
// color

const fields: FieldConfig[] = [
  { name: 'text', label: 'Text', type: 'text', colSpan: 6 },
  { name: 'email', label: 'Email', type: 'email', colSpan: 6 },
  { name: 'password', label: 'Password', type: 'password', colSpan: 6 },
  { name: 'phone', label: 'Phone', type: 'phone', colSpan: 6 },
  { name: 'textarea', label: 'Textarea', type: 'textarea', rows: 2 },
  { name: 'number', label: 'Number', type: 'number', min: 0, max: 100 },
  { name: 'currency', label: 'Currency', type: 'currency', currency: 'IDR', locale: 'id-ID' },
  { name: 'slider', label: 'Slider', type: 'slider', min: 0, max: 100 },
  { name: 'date', label: 'Date', type: 'date' },
  { name: 'time', label: 'Time', type: 'time' },
  { name: 'datetime', label: 'DateTime', type: 'datetime' },
  { name: 'select', label: 'Select', type: 'select', options: [...] },
  { name: 'radio', label: 'Radio', type: 'radio', options: [...] },
  { name: 'checkbox', label: 'Checkbox', type: 'checkbox' },
  { name: 'switch', label: 'Switch', type: 'switch' },
  { name: 'autocomplete', label: 'Autocomplete', type: 'autocomplete', options: [...] },
  { name: 'multi', label: 'Multi', type: 'autocomplete-multi', options: [...] },
  { name: 'predict', label: 'Predict', type: 'autocomplete-predict', options: [...] },
  { name: 'color', label: 'Color', type: 'color' },
]`

export default function S02AllFields() {
  const formRef = useRef<AxenFormRef>(null)
  const [result, setResult] = useState<unknown>()

  return (
    <ScenarioLayout
      title="All 19 Field Types"
      description="Every built-in field component — zero external UI dependency."
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
