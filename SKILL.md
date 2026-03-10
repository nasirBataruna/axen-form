---
name: axen-form
description: "Build config-driven, zero-dependency React forms using @axenstudio/axen-form. Covers FieldConfig schema, 19 built-in field components (CSS Modules + design tokens), reactive form store, layout system (Grid, Box, Stack, Spacer, Divider), field groups/sections, validation adapters (Yup/Zod), conditional fields, array fields, payload mapping, theme system (3 built-in + custom CSS vars), and custom component override."
---

# AxenForm Skill

## Overview

`@axenstudio/axen-form` adalah form engine React **zero-dependency** berbasis `FieldConfig[]`.
Tidak tergantung MUI, Formik, Emotion, atau UI library lain — menggunakan native HTML + CSS Modules + design tokens.
Form didefinisikan sebagai array config, reactive store bawaan mengelola state, dan 19 field component built-in siap pakai.

**Kapan gunakan skill ini:**
- Membuat form baru dengan AxenForm di project React 19+
- Menambah field type baru (custom component override)
- Debugging validasi, conditional logic, array fields, atau payload mapping
- Menyusun form dengan field groups/sections untuk visual sectioning
- Menerapkan theme system (built-in presets atau custom CSS variables)
- Membutuhkan form engine ringan tanpa dependency UI library

**Jangan gunakan jika:** form tidak menggunakan AxenForm, atau project sudah pakai CronoForm (Formik+MUI engine).

## Installation

```bash
pnpm add @axenstudio/axen-form
# optional: pnpm add yup   (for Yup adapter)
# optional: pnpm add zod   (for Zod adapter)
```

Official npm package: https://www.npmjs.com/package/@axenstudio/axen-form. Always use `pnpm`.


---

## Quick Start

```tsx
import { AxenForm, AxenFormRef, defaultComponentMap, FieldConfig } from '@axenstudio/axen-form'
import { useRef } from 'react'

const fields: FieldConfig[] = [
  { name: 'email', label: 'Email', type: 'email', required: true, colSpan: 12 },
  { name: 'role',  label: 'Role',  type: 'select', required: true,
    options: [{ value: 'admin', label: 'Admin' }, { value: 'user', label: 'User' }],
    colSpan: 6 },
]

export default function MyForm() {
  const formRef = useRef<AxenFormRef>(null)

  return (
    <>
      <AxenForm
        ref={formRef}
        config={{ fields, initialValues: { email: '', role: '' } }}
        components={defaultComponentMap}   // REQUIRED — field components won't render without this
        onSubmit={(values) => console.log(values)}
        gap="12px"
      />
      <button onClick={() => formRef.current?.submit()}>Submit</button>
    </>
  )
}
```

---

## Built-in Field Components

19 ready-to-use components, semua native HTML + CSS Modules.
Import otomatis via `defaultComponentMap` — tidak perlu register manual.

| Type key | Component | Catatan |
|---|---|---|
| `text` | `TextField` | Basic text input |
| `textarea` | `TextareaField` | Multiline, prop `rows` |
| `number` | `NumberField` | Prop `min`/`max`/`step` |
| `email` | `EmailField` | Email input |
| `password` | `PasswordField` | Password input |
| `phone` | `PhoneField` | Phone input |
| `date` | `DateField` | Native date picker |
| `time` | `TimeField` | Native time picker |
| `datetime` | `DateTimeField` | Native datetime-local |
| `select` | `SelectField` | Dropdown via `options`, auto default placeholder |
| `checkbox` | `CheckboxField` | Boolean checkbox |
| `radio` | `RadioField` | Via `options` prop |
| `switch` | `SwitchField` | Toggle boolean |
| `slider` | `SliderField` | Range, prop `min`/`max`/`step` |
| `currency` | `CurrencyField` | Formatted currency, prop `currency`+`locale` |
| `color` | `ColorField` | Color picker |
| `autocomplete` | `AutocompleteField` | Client/server search, `fetchOptions` |
| `autocomplete-predict` | `AutocompletePredictField` | Ghost text + Tab-accept |
| `autocomplete-multi` | `AutocompleteMultiField` | Multi-select chips |

### Common FieldConfig Props

Props yang berlaku di semua tipe field:

| Prop | Type | Description |
|---|---|---|
| `name` | `string` | Key di values/errors — **required** |
| `type` | `string` | Tipe field — **required** |
| `label` | `string` | Label teks di atas field |
| `required` | `boolean` | Aktifkan required validation |
| `disabled` | `boolean` | Disable input |
| `readOnly` | `boolean` | Read-only input |
| `hidden` | `boolean \| (values) => boolean` | Sembunyikan/unmount field |
| `colSpan` | `number \| { xs?, sm?, md?, lg?, xl? }` | Responsive grid span (1–12) |
| `helperText` | `string` | Teks subtitle/hint di bawah field |
| `placeholder` | `string` | Placeholder input |
| `validation` | `YupSchema \| ZodSchema` | Per-field schema untuk adapter validasi |
| `component` | `ComponentType<FieldComponentProps>` | Override built-in component |
| `fieldProps` | `Record<string, unknown>` | Extra props di-forward ke component |

Props tambahan per tipe:
- `rows` — `textarea`: jumlah baris visible
- `min` / `max` / `step` — `number`, `slider`: batasan numerik
- `currency` / `locale` — `currency`: misal `'IDR'` / `'id-ID'`
- `options` — `select`, `radio`, `autocomplete`, `autocomplete-multi`: `{ value, label }[]`
- `fetchOptions` — `autocomplete`, `autocomplete-multi`: `async (query, signal) => options[]`
- `optionLabel` — `autocomplete`: key di option object untuk label display

→ Full TypeScript interfaces: `references/fieldconfig-api.md`

---

## Layout System

Built-in layout primitives (importable from `@axenstudio/axen-form`): `Grid` (CSS Grid), `Box` (flex), `Stack` (directional flex), `Spacer`, `Divider`.

Form uses 12-column CSS Grid by default. `gap` prop sets spacing between rows. Per-field span via `colSpan` — a number (`6`) or responsive object `{ xs: 12, md: 6 }`.

### Field Groups / Sections

`FieldGroupConfig` untuk visual sectioning — group header + field cluster:

```tsx
import { FieldConfig, FieldGroupConfig } from '@axenstudio/axen-form'

const fields: (FieldConfig | FieldGroupConfig)[] = [
  { name: 'accountType', type: 'select', ... },  // standalone field
  {
    group: 'Personal Info',
    fields: [
      { name: 'firstName', type: 'text', colSpan: 6 },
      { name: 'lastName', type: 'text', colSpan: 6 },
    ],
  },
  {
    group: 'Address',
    fields: [
      { name: 'street', type: 'text', colSpan: 12 },
      { name: 'city', type: 'text', colSpan: 4 },
    ],
  },
]
```
Group fields inherit parent grid flow via CSS `display: contents`.

---

## Theme System

3 built-in theme presets + extensible custom themes via CSS custom properties:

| Theme | Primary Color | Usage |
|---|---|---|
| `default` | Blue (#1976d2) | Standard business forms |
| `subtle` | Gray (#546e7a) | Low-contrast, form-heavy UIs |
| `green` | Green (#2e7d32) | Nature/eco themed apps |

```tsx
// Built-in presets
<AxenForm theme="default" ... />   // blue  (#1976d2)
<AxenForm theme="subtle"  ... />   // gray  (#546e7a)
<AxenForm theme="green"   ... />   // green (#2e7d32)

// Custom theme — define CSS rule, pass name to theme prop
// [data-axen-theme='brand'] { --axen-color-primary: #e74c3c; ... }
<AxenForm theme="brand" ... />

// Dark mode — wrap with class + override tokens in CSS
// .dark-mode [data-axen-theme] { --axen-color-bg: #1e1e1e; ... }
<div className={isDark ? 'dark-mode' : ''}>
  <AxenForm theme="default" ... />
</div>
```

AxenForm injects `data-axen-theme="{value}"` on its container. CSS rules targeting that selector apply automatically.

→ Full token list + dark mode CSS + per-theme values: `references/theme-tokens.md`

→ Full token catalog: `references/theme-tokens.md`

---

## AxenForm Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `config` | `{ fields, initialValues }` | ✓ | Array field config + initial values object |
| `components` | `ComponentMap` | ✓ | Field component registry — **selalu pass `defaultComponentMap`** |
| `onSubmit` | `(values) => void` | ✓ | Submit handler — hanya dipanggil jika validasi lolos |
| `ref` | `RefObject<AxenFormRef>` | — | Imperative ref (submit, reset, getValues, dll) |
| `gap` | `string` | — | CSS grid gap antar field, misal `"12px"` |
| `columns` | `number` | — | Jumlah kolom grid, default `12` |
| `theme` | `string` | — | Preset: `'default'` \| `'subtle'` \| `'green'` \| custom string |
| `validationAdapter` | `ValidationAdapter` | — | Adapter Yup/Zod dari `adapters/*` |
| `payloadFields` | `string[] \| Record<string, string[]>` | — | Whitelist field yang masuk ke submit payload |
| `payloadDiscriminator` | `string` | — | Nama field penentu payload dinamis |
| `children` | `ReactNode` | — | Dirender di dalam form context — untuk `useFormContext` |

---

## Workflow Patterns

### Basic Form

```tsx
const fields: FieldConfig[] = [
  { name: 'fullName', label: 'Full Name',    type: 'text',     required: true, colSpan: 12 },
  { name: 'email',    label: 'Email',        type: 'email',    required: true, colSpan: 6  },
  { name: 'age',      label: 'Age',          type: 'number',   colSpan: 6  },
  { name: 'role',     label: 'Role',         type: 'select',   required: true,
    options: [{ value: 'admin', label: 'Admin' }, { value: 'user', label: 'User' }],
    colSpan: 6 },
  { name: 'bio',      label: 'Bio',          type: 'textarea', rows: 3, colSpan: 12 },
  { name: 'terms',    label: 'Accept Terms', type: 'checkbox', colSpan: 12 },
]

const initialValues = { fullName: '', email: '', age: '', role: '', bio: '', terms: false }

<AxenForm
  ref={formRef}
  config={{ fields, initialValues }}
  components={defaultComponentMap}
  onSubmit={(values) => console.log(values)}
  gap="12px"
/>
<button onClick={() => formRef.current?.submit()}>Submit</button>
<button onClick={() => formRef.current?.resetForm()}>Reset</button>
```

### Validation Adapters

```tsx
// Yup — pnpm add yup
import { yupAdapter } from '@axenstudio/axen-form/adapters/yup'
import * as yup from 'yup'

const fields: FieldConfig[] = [
  { name: 'name',  type: 'text',  required: true,
    validation: yup.string().min(3, 'Min 3 characters').required('Required') },
  { name: 'email', type: 'email', required: true,
    validation: yup.string().email('Invalid email').required('Required') },
  { name: 'age',   type: 'number',
    validation: yup.number().min(18, 'Must be 18+').max(120) },
]

<AxenForm
  config={{ fields, initialValues }}
  components={defaultComponentMap}
  validationAdapter={yupAdapter(yup)}
  onSubmit={handleSubmit}
/>

// Zod — pnpm add zod
import { zodAdapter } from '@axenstudio/axen-form/adapters/zod'
import { z } from 'zod'

const zodFields: FieldConfig[] = [
  { name: 'username', type: 'text', required: true,
    validation: z.string().min(3, 'Min 3 chars') },
  { name: 'website',  type: 'text',
    validation: z.string().url('Must be a valid URL') },
]

<AxenForm
  config={{ fields: zodFields, initialValues }}
  components={defaultComponentMap}
  validationAdapter={zodAdapter(z)}
  onSubmit={handleSubmit}
/>
```

`validation` per field overrides auto-generated schema from `required`/`min`/`max`. Custom `ValidationAdapter` interface: `references/fieldconfig-api.md`.

### Conditional Fields

`hidden` unmounts the field entirely — not rendered, not validated, not in submit values.

```tsx
const fields: FieldConfig[] = [
  {
    name: 'orderType', label: 'Order Type', type: 'select', required: true,
    options: [{ value: 'pickup', label: 'Pickup' }, { value: 'delivery', label: 'Delivery' }],
  },
  {
    name: 'address', label: 'Delivery Address', type: 'text', required: true,
    hidden: (values) => values.orderType !== 'delivery',  // dynamic: function receives current values
  },
  {
    name: 'pickupTime', label: 'Pickup Time', type: 'time',
    hidden: (values) => values.orderType !== 'pickup',
  },
  {
    name: 'alwaysHidden', type: 'text',
    hidden: true,  // static hide
  },
]
```

### Array Fields (Repeatable Rows)

```tsx
import { AxenArrayField, ArrayFieldConfig } from '@axenstudio/axen-form'

const teamConfig: ArrayFieldConfig = {
  name: 'members', type: 'text', isArray: true,
  label: 'Team Members',
  fields: [
    { name: 'firstName', label: 'First Name', type: 'text',  colSpan: 6 },
    { name: 'lastName',  label: 'Last Name',  type: 'text',  colSpan: 6 },
    { name: 'email',     label: 'Email',      type: 'email', colSpan: 12 },
  ],
  minItems: 1,
  maxItems: 5,
  addLabel: '+ Add Member',
  removeLabel: 'Remove',
}

// initialValues MUST include at least 1 row
const initialValues = {
  teamName: '',
  members: [{ firstName: '', lastName: '', email: '' }],
}

<AxenForm
  config={{ fields: [{ name: 'teamName', label: 'Team Name', type: 'text', colSpan: 12 }], initialValues }}
  components={defaultComponentMap}
  onSubmit={handleSubmit}
>
  <AxenArrayField name="members" config={teamConfig}>
    {({ fields: rows, helpers, renderField }) => (
      <div>
        {rows.map((_, i) => (
          <div key={i} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
            <strong>Member #{i + 1}</strong>
            {renderField(i)}
            {rows.length > 1 && (
              <button onClick={() => helpers.remove(i)}>Remove</button>
            )}
          </div>
        ))}
        <button onClick={() => helpers.push({ firstName: '', lastName: '', email: '' })}>
          + Add Member
        </button>
      </div>
    )}
  </AxenArrayField>
</AxenForm>
```

`ArrayHelpers` API: `push(item)`, `remove(index)`, `insert(index, item)`, `replace(index, item)`, `swap(a, b)`, `move(from, to)`, `length`.

### Ref Control (Imperative API)

```tsx
const formRef = useRef<AxenFormRef>(null)

formRef.current?.submit()              // Trigger submit + validation
formRef.current?.resetForm()           // Reset to initialValues
formRef.current?.resetForm(newValues)  // Reset with new values (replaces initialValues)
formRef.current?.getValues()           // → Record<string, unknown>
formRef.current?.getErrors()           // → Record<string, string>
formRef.current?.isValid()             // → boolean
formRef.current?.isDirty()             // → boolean

// Common patterns
const saved = formRef.current?.getValues()                         // save before navigate
formRef.current?.resetForm({ name: 'John', email: 'j@ex.com' })   // pre-fill
if (formRef.current?.isDirty()) formRef.current?.submit()          // only submit if changed
```

### Payload Mapping

```tsx
// Static whitelist — only listed fields enter onSubmit payload
<AxenForm
  config={{ fields, initialValues }}
  components={defaultComponentMap}
  payloadFields={['fullName', 'email']}
  onSubmit={(values) => console.log(values)}   // only { fullName, email }
/>

// Dynamic — payload set selected by discriminator field value
<AxenForm
  config={{ fields, initialValues }}
  components={defaultComponentMap}
  payloadFields={{
    person:  ['firstName', 'lastName', 'email'],
    company: ['companyName', 'taxId', 'email'],
  }}
  payloadDiscriminator="entityType"
  onSubmit={(values) => console.log(values)}
/>
```

Fields not in `payloadFields` are still rendered and validated — only excluded from the `onSubmit` argument.

### Form Context

`useFormContext` must be called inside a component rendered as **`children`** of `<AxenForm>`.

```tsx
import { useFormContext } from '@axenstudio/axen-form'

function FormStateViewer() {
  const { store } = useFormContext()
  const state = store.getState()
  // state: { values, errors, touched, dirty, isSubmitting, submitCount }
  return (
    <div>
      <p>dirty: {String(state.dirty)}</p>
      <p>isSubmitting: {String(state.isSubmitting)}</p>
      <p>submitCount: {state.submitCount}</p>
      <pre>{JSON.stringify(state.values, null, 2)}</pre>
    </div>
  )
}

function QuickFill() {
  const { store } = useFormContext()
  return (
    <button onClick={() => {
      store.setFieldValue('firstName', 'John')
      store.setFieldValue('email', 'john@example.com')
    }}>Quick Fill</button>
  )
}

<AxenForm config={{ fields, initialValues }} components={defaultComponentMap} onSubmit={handleSubmit}>
  <FormStateViewer />  {/* live state display */}
  <QuickFill />        {/* programmatic value mutation */}
</AxenForm>
```

`store` methods: `getState()`, `getFieldValue(name)`, `setFieldValue(name, value)`, `setFieldTouched(name, bool)`, `subscribeField(name, callback)`.

### Custom Component Override

Override any field with a custom component via the `component` prop on `FieldConfig`.

```tsx
import type { FieldComponentProps } from '@axenstudio/axen-form'

function StarRating({ name, value, onChange, label, required, error, helperText }: FieldComponentProps) {
  const rating = Number(value) || 0
  return (
    <div className="axen-field-wrapper">
      {label && (
        <label className="axen-field-label">
          {label}{required && <span style={{ color: 'var(--axen-error, #d32f2f)' }}> *</span>}
        </label>
      )}
      <div style={{ display: 'flex', gap: 4 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star} type="button"
            onClick={() => onChange({ target: { name, value: star } } as any)}
            style={{ color: star <= rating ? '#f5a623' : '#ccc', fontSize: 24, background: 'none', border: 'none' }}
          >★</button>
        ))}
      </div>
      {error && helperText && <span style={{ fontSize: '0.8em', color: 'var(--axen-error, #d32f2f)' }}>{helperText}</span>}
    </div>
  )
}

const fields: FieldConfig[] = [
  { name: 'productName', label: 'Product Name', type: 'text', required: true, colSpan: 12 },
  { name: 'rating', label: 'Rating', type: 'number', component: StarRating,
    required: true, colSpan: 6, helperText: 'Click a star to rate' },
]
```

Key rules:
- Use `axen-field-wrapper` / `axen-field-label` CSS classes for consistent layout
- For non-DOM values: `onChange({ target: { name, value } } as any)`
- Render `label` + required indicator manually
- Pass extra props via `fieldProps` on FieldConfig; they arrive via `[key: string]: unknown`

→ Full `FieldComponentProps` interface + authoring patterns: `references/custom-components.md`

### Stepper Form (Basic)

Multi-step form: each step renders its own `<AxenForm>` with that step's fields only.

```tsx
interface Step { title: string; fields: FieldConfig[] }

const steps: Step[] = [
  { title: 'Personal Info', fields: [
    { name: 'firstName', label: 'First Name', type: 'text',  required: true, colSpan: 6 },
    { name: 'lastName',  label: 'Last Name',  type: 'text',  required: true, colSpan: 6 },
    { name: 'email',     label: 'Email',      type: 'email', required: true, colSpan: 12 },
  ]},
  { title: 'Address', fields: [
    { name: 'street',  label: 'Street',   type: 'text', required: true, colSpan: 12 },
    { name: 'city',    label: 'City',     type: 'text', required: true, colSpan: 6 },
    { name: 'zipCode', label: 'Zip Code', type: 'text', required: true, colSpan: 6 },
  ]},
]

const initialValues: Record<string, unknown> = {
  firstName: '', lastName: '', email: '',
  street: '', city: '', zipCode: '',
}

export default function StepperForm() {
  const formRef = useRef<AxenFormRef>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [formValues, setFormValues] = useState(initialValues)

  const handleSubmit = (values: Record<string, unknown>) => {
    const merged = { ...formValues, ...values }   // accumulate across steps
    if (currentStep < steps.length - 1) {
      setFormValues(merged)
      setCurrentStep(s => s + 1)
    } else {
      console.log('Final submit:', merged)
    }
  }

  const handlePrev = () => {
    const current = formRef.current?.getValues()  // save current step's unsaved data
    if (current) setFormValues(prev => ({ ...prev, ...current }))
    setCurrentStep(s => s - 1)
  }

  return (
    <>
      <AxenForm
        key={currentStep}                          // force clean re-mount per step
        ref={formRef}
        config={{ fields: steps[currentStep].fields, initialValues: formValues }}
        components={defaultComponentMap}
        onSubmit={handleSubmit}
        gap="12px"
      />
      <button onClick={handlePrev} disabled={currentStep === 0}>← Previous</button>
      <button onClick={() => formRef.current?.submit()}>
        {currentStep < steps.length - 1 ? 'Next →' : 'Submit'}
      </button>
    </>
  )
}
```

Key patterns:
- `key={currentStep}` forces a clean re-mount each step change
- `onSubmit` serves as "advance step" trigger — validation runs automatically
- Accumulate values: `{ ...formValues, ...values }`
- On "Previous": call `getValues()` first to preserve unsaved data

### Stepper Form Complex

Advanced stepper with conditional steps, per-step status tracking, click-to-jump, and review summary.

```tsx
interface StepDef {
  id: string
  title: string
  fields: FieldConfig[]
  condition?: (values: Record<string, unknown>) => boolean  // optional: conditional step
}

const ALL_STEPS: StepDef[] = [
  {
    id: 'account', title: 'Account Type',
    fields: [
      { name: 'accountType', label: 'Account Type', type: 'radio', required: true, colSpan: 12,
        options: [{ value: 'personal', label: 'Personal' }, { value: 'business', label: 'Business' }],
        helperText: 'Choosing "Business" adds a Company Info step.' },
      { name: 'fullName', label: 'Full Name', type: 'text',  required: true, colSpan: 12 },
      { name: 'email',    label: 'Email',     type: 'email', required: true, colSpan: 6  },
      { name: 'phone',    label: 'Phone',     type: 'tel',   colSpan: 6 },
    ],
  },
  {
    id: 'company', title: 'Company Info',
    condition: (values) => values.accountType === 'business',  // conditional: only shown for business
    fields: [
      { name: 'companyName', label: 'Company Name', type: 'text',   required: true, colSpan: 12 },
      { name: 'companySize', label: 'Company Size', type: 'select', required: true, colSpan: 6,
        options: [{ value: '1-10', label: '1–10' }, { value: '11-50', label: '11–50' }, { value: '200+', label: '200+' }] },
      { name: 'taxId',   label: 'Tax ID',  type: 'text', colSpan: 6 },
    ],
  },
  {
    id: 'address', title: 'Address',
    fields: [
      { name: 'street',  label: 'Street',   type: 'text', required: true, colSpan: 12 },
      { name: 'city',    label: 'City',     type: 'text', required: true, colSpan: 4  },
      { name: 'zipCode', label: 'Zip Code', type: 'text', required: true, colSpan: 4  },
      { name: 'country', label: 'Country',  type: 'select', required: true, colSpan: 4,
        options: [{ value: 'ID', label: 'Indonesia' }, { value: 'US', label: 'United States' }, { value: 'SG', label: 'Singapore' }] },
    ],
  },
  {
    id: 'prefs', title: 'Preferences',
    fields: [
      { name: 'newsletter',    label: 'Subscribe to newsletter',          type: 'checkbox', colSpan: 12 },
      { name: 'termsAccepted', label: 'I accept the terms and conditions', type: 'checkbox', required: true, colSpan: 12 },
    ],
  },
]

const initialValues: Record<string, unknown> = {
  accountType: '', fullName: '', email: '', phone: '',
  companyName: '', companySize: '', taxId: '',
  street: '', city: '', zipCode: '', country: '',
  newsletter: false, termsAccepted: false,
}

export default function StepperComplex() {
  const formRef = useRef<AxenFormRef>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [formValues, setFormValues] = useState(initialValues)
  const [showReview, setShowReview] = useState(false)

  // Filter visible steps dynamically based on current values
  const activeSteps = useMemo(
    () => ALL_STEPS.filter(s => !s.condition || s.condition(formValues)),
    [formValues]
  )

  // Clamp step index if a conditional step disappears
  const safeStep = Math.min(currentStep, activeSteps.length - 1)

  type StepStatus = 'pending' | 'valid' | 'invalid'
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>({})

  const handleStepSubmit = (values: Record<string, unknown>) => {
    const merged = { ...formValues, ...values }
    setFormValues(merged)
    setStepStatuses(prev => ({ ...prev, [activeSteps[safeStep].id]: 'valid' }))
    if (safeStep < activeSteps.length - 1) {
      setCurrentStep(s => s + 1)
    } else {
      setShowReview(true)   // show review summary before final submit
    }
  }

  // Click-to-jump: allow only previously visited steps
  const handleJumpToStep = (index: number) => {
    if (index <= safeStep || stepStatuses[activeSteps[index].id]) {
      const current = formRef.current?.getValues()
      if (current) setFormValues(prev => ({ ...prev, ...current }))
      setShowReview(false)
      setCurrentStep(index)
    }
  }

  return (
    <>
      {/* Step indicator with click-to-jump */}
      {activeSteps.map((step, i) => (
        <button key={step.id} onClick={() => handleJumpToStep(i)}
          style={{ fontWeight: i === safeStep ? 'bold' : 'normal' }}>
          {step.title} {stepStatuses[step.id] === 'valid' ? '✓' : ''}
        </button>
      ))}

      {!showReview ? (
        <>
          <AxenForm
            ref={formRef}
            key={activeSteps[safeStep].id}
            config={{ fields: activeSteps[safeStep].fields, initialValues: formValues }}
            components={defaultComponentMap}
            onSubmit={handleStepSubmit}
          />
          <button onClick={() => {
            const current = formRef.current?.getValues()
            if (current) setFormValues(prev => ({ ...prev, ...current }))
            setCurrentStep(s => Math.max(0, s - 1))
          }} disabled={safeStep === 0}>← Previous</button>
          {/* "Next" triggers submit → onSubmit only fires if validation passes */}
          <button onClick={() => formRef.current?.submit()}>
            {safeStep < activeSteps.length - 1 ? 'Next →' : 'Review'}
          </button>
        </>
      ) : (
        <div>
          <pre>{JSON.stringify(formValues, null, 2)}</pre>
          <button onClick={() => setShowReview(false)}>← Back</button>
          <button onClick={() => console.log('Final submit:', formValues)}>Submit</button>
        </div>
      )}
    </>
  )
}
```

---

## Autocomplete Variants

### `autocomplete` — Client/Server Search

```tsx
// Static options
{ name: 'role', type: 'autocomplete', options: roleOptions }

// Server-side with debounce + AbortSignal
{
  name: 'assignee', type: 'autocomplete',
  fetchOptions: async (query, signal) => {
    const res = await fetch(`/api/users?q=${query}`, { signal })
    return res.json()   // must return { value, label }[]
  },
  optionLabel: 'name',
}
```

### `autocomplete-predict` — Ghost Text

```tsx
{ name: 'keyword', type: 'autocomplete-predict',
  options: [{ value: 'react', label: 'React' }, { value: 'typescript', label: 'TypeScript' }] }
```

Inline ghost-text suggestion. Press Tab to accept. Works with static `options` only.

### `autocomplete-multi` — Multi-Select

```tsx
{ name: 'tags', type: 'autocomplete-multi',
  fetchOptions: async (q, signal) => api.searchTags(q, signal) }
```

Value is `string[]`. Displayed as chips. Supports `options` or `fetchOptions`.

---

## Common Pitfalls

| Pitfall | Fix |
|---|---|
| Fields not rendering (empty form) | **Always pass `components={defaultComponentMap}`** — required |
| Validation adapter not running | Import from subpath: `import { yupAdapter } from '@axenstudio/axen-form/adapters/yup'` |
| CSS not applied | CSS is auto-injected by the package; verify build tool supports CSS injection (Vite: OK) |
| `required` on conditionally hidden field | `hidden` fields are unmounted and skipped by all validators — correct behavior |
| Custom `onChange` not updating form | For non-DOM values: `onChange({ target: { name, value } } as any)` |
| Array field has no rows | `initialValues` must include at least 1 row: `{ members: [{ firstName: '' }] }` |
| `payloadFields` field missing from payload | Field must exist in config + initialValues — `payloadFields` only filters the output |
| Responsive `colSpan` not working | Use object format: `colSpan: { xs: 12, md: 6 }` — not a number string |
| `useFormContext` throws error | Hook must be called inside a component rendered as **`children`** of `<AxenForm>` |
| Stepper step data lost on "Previous" | Call `formRef.current?.getValues()` before decrementing step, merge into shared state |

---

## References

- `references/fieldconfig-api.md` — Full TypeScript interfaces: FieldConfig, ArrayFieldConfig, AxenFormProps, AxenFormRef, FormApi, ValidationAdapter
- `references/field-components.md` — All 19 built-in components: type-specific props + initial value guide
- `references/custom-components.md` — FieldComponentProps interface + custom component authoring patterns
- `references/theme-tokens.md` — Full CSS design token catalog + dark mode override
