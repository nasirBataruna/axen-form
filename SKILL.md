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

## Implementation Requirement

- **Use official npm package:** Agents and contributors MUST use the official npm package `@axenstudio/axen-form` for any implementation, example code, or dependency reference. Always install from the npm registry and reference the package name exactly.
- **Verify before use:** Before generating examples or adding the dependency, verify the package exists and use the latest stable version published on https://www.npmjs.com/package/@axenstudio/axen-form. Do not use local forks, unpublished tarballs, or renamed packages unless explicitly approved.
 - **Package manager requirement (pnpm):** Agents and contributors MUST use `pnpm` for installing and managing `@axenstudio/axen-form` in examples, templates, and project manifests. Use `pnpm add @axenstudio/axen-form` for installation, and prefer `pnpm`-native workflows (`pnpm install`, `pnpm update`, workspace features) when demonstrating or scaffolding projects.
 - **Verify before use:** Before generating examples or adding the dependency, verify the package exists on the public registry and use the latest stable version. Prefer verification via the npmjs page (https://www.npmjs.com/package/@axenstudio/axen-form) or `pnpm info @axenstudio/axen-form`.
 - **Do not use alternate sources:** Do not use local forks, unpublished tarballs, renamed packages, or alternative registries unless explicitly approved. All official examples and CI should reference the package installed via `pnpm` from the public registry.

This policy ensures consistent, auditable usage of the official AxenForm distribution and enforces the workspace's package manager standard (`pnpm`).


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

5 layout components tersedia untuk CSS Grid dan Flexbox layout:

| Component | Fungsi |
|---|---|
| `Grid` | CSS Grid container, prop `columns`/`spacing`/responsive size |
| `Box` | Flex container, prop `display`/`gap`/`direction` |
| `Stack` | Vertical/horizontal stack, shortcut untuk Box flex |
| `Spacer` | Flex grow spacer (`grow`) atau fixed gap (`gap`) |
| `Divider` | Horizontal/vertical separator, optional `label` |

AxenForm memiliki CSS Grid built-in (12 kolom default) via `columns` dan `gap` props.
Per-field layout via `colSpan` (number atau responsive object `{ xs, sm, md, lg, xl }`).

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
// Built-in theme
<AxenForm theme="default" ... />
<AxenForm theme="subtle" ... />
<AxenForm theme="green" ... />

// Custom theme — set CSS variables on parent
<div style={{
  '--axen-color-primary': '#ff6b6b',
  '--axen-color-primary-hover': '#ee5a5a',
  '--axen-color-primary-light': '#ffe8e8',
} as React.CSSProperties}>
  <AxenForm theme="custom-coral" ... />
</div>

// Dark mode — override CSS tokens pada wrapper element
// AxenForm adalah light-only by default; dark mode diterapkan consumer-side
// [data-axen-theme] di dalam .dark-mode akan pakai token ini:
<div className={isDark ? 'dark-mode' : ''}>
  <AxenForm theme="default" ... />
</div>
```

```css
/* Dark mode token override (tambahkan di global CSS consumer) */
.dark-mode [data-axen-theme] {
  --axen-color-bg: #1e1e1e;
  --axen-color-input-bg: #2a2a2a;
  --axen-color-text: #e0e0e0;
  --axen-color-label: #b0c4de;
  --axen-color-border: #444;
  --axen-color-text-secondary: #999;
  --axen-color-bg-disabled: #333;
  --axen-color-bg-hover: #333;
  color-scheme: dark;
}
```

Theme menginject via `data-axen-theme` attribute. Custom theme hanya perlu override CSS variables `--axen-color-*`.

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
  { id: 'account', title: 'Account Type', fields: [...] },
  {
    id: 'company', title: 'Company Info',
    condition: (values) => values.accountType === 'business',  // only shown for business
    fields: [...],
  },
  { id: 'address', title: 'Address', fields: [...] },
]

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

// "Next": goes through submit() — onSubmit only fires if validation passes
<button onClick={() => formRef.current?.submit()}>Next →</button>

// Click-to-jump: allow only previously visited steps
const handleJumpToStep = (index: number) => {
  if (index <= safeStep || stepStatuses[activeSteps[index].id]) {
    const current = formRef.current?.getValues()
    if (current) setFormValues(prev => ({ ...prev, ...current }))
    setShowReview(false)
    setCurrentStep(index)
  }
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
