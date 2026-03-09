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

---

## Quick Start

```tsx
import { AxenForm, AxenFormRef, FieldConfig } from '@axenstudio/axen-form'
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
Lihat playground `03a-layout` dan `03b-field-groups`.

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
```

Theme menginject via `data-axen-theme` attribute. Custom theme hanya perlu override CSS variables `--axen-color-*`.
Lihat playground `11-theme`.

---

## Workflow Patterns

### 1. Basic Form
Definisikan `FieldConfig[]` + `initialValues` → pass ke `<AxenForm>`.
Submit via `formRef.current?.submit()`, reset via `formRef.current?.resetForm()`.
Lihat playground `01-basic`.

### 2. All Field Types
Semua 19 tipe field tersedia langsung. Cukup set `type` di `FieldConfig`.
Lihat playground `02-all-fields`.

### 3. Layout & Grid
Gunakan `colSpan` di FieldConfig untuk grid span per field.
Gabungkan dengan Grid, Box, Stack, Spacer, Divider untuk layout kompleks.
Lihat playground `03a-layout`.

### 3b. Field Groups / Sections
Gunakan `FieldGroupConfig` untuk mengelompokkan field ke dalam visual sections.
Mix standalone `FieldConfig` dan `FieldGroupConfig` dalam satu `fields` array.
Lihat playground `03b-field-groups`.

### 4. Validation Adapters
AxenForm mendukung plugin validation via `validationAdapter` prop:
```tsx
import { createYupAdapter } from '@axenstudio/axen-form'
import * as Yup from 'yup'

const yupAdapter = createYupAdapter(Yup)

<AxenForm validationAdapter={yupAdapter} ... />
```
Adapter tersedia untuk **Yup** dan **Zod**. Bisa buat adapter custom yang implement `ValidationAdapter`.
Auto-schema: adapter generate schema dari `required`/`min`/`max` di FieldConfig.
Custom schema: set `validation` pada individual FieldConfig.
Lihat playground `04-validation`.

### 5. Conditional Fields
```tsx
{ name: 'address', label: 'Address', type: 'text',
  hidden: (values) => values.orderType !== 'delivery' }
```
Field yang `hidden` di-**unmount** sepenuhnya — tidak terrender, tidak tervalidasi.
`hidden` bisa boolean statis atau function `(values) => boolean` untuk conditional.
Lihat playground `05-conditional`.

### 6. Array Fields (Repeatable Rows)
```tsx
import { AxenArrayField, ArrayFieldConfig } from '@axenstudio/axen-form'

const teamConfig: ArrayFieldConfig = {
  name: 'members', type: 'text', isArray: true,
  fields: [
    { name: 'firstName', label: 'First Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
  ],
}

<AxenForm config={...}>
  <AxenArrayField name="members" config={teamConfig}>
    {({ fields, helpers, renderField }) => (
      <div>
        {fields.map((_, i) => (
          <div key={i}>
            {renderField(i)}
            <button onClick={() => helpers.remove(i)}>Remove</button>
          </div>
        ))}
        <button onClick={() => helpers.push({ firstName: '', email: '' })}>Add</button>
      </div>
    )}
  </AxenArrayField>
</AxenForm>
```
`ArrayHelpers`: `push`, `remove`, `swap`, `insert`, `replace`, `move`, `length`.
Lihat playground `06-array-fields`.

### 7. Ref Control (Imperative API)
`AxenFormRef` expose:
- `submit()` — trigger submit + validasi
- `resetForm(nextValues?)` — reset ke initial atau ke values baru
- `getValues()` — baca current values
- `getErrors()` — baca current errors
- `isValid()` — cek apakah form valid
- `isDirty()` — cek apakah ada perubahan dari initial

Lihat playground `07-ref-control`.

### 8. Payload Mapping
```tsx
// Static: hanya fields terpilih di-submit
<AxenForm payloadFields={['name', 'email']} ... />

// Dynamic: berdasarkan discriminator field
<AxenForm
  payloadFields={{
    person: ['firstName', 'lastName', 'email'],
    company: ['companyName', 'taxId', 'email'],
  }}
  payloadDiscriminator="entityType"
  ...
/>
```
Fields yang tidak ada di `payloadFields` tetap terrender dan tervalidasi, tapi **tidak** masuk ke `onSubmit` values.
Lihat playground `08-payload-map`.

### 9. Form Context
`useFormContext` hook untuk akses form state di child components:
```tsx
import { useFormContext } from '@axenstudio/axen-form'

function StatusBar() {
  const { store } = useFormContext()
  const state = store.getState()
  return <div>Dirty: {String(state.dirty)}</div>
}

// Render inside AxenForm children slot:
<AxenForm config={...} onSubmit={...}>
  <StatusBar />
</AxenForm>
```
`store` expose: `getState()`, `setFieldValue()`, `setFieldTouched()`, `getFieldValue()`, `subscribeField()`, dll.
Lihat playground `09-form-context`.

### 10. Custom Component Override
Override built-in component per field via `component` prop:
```tsx
{ name: 'rating', type: 'number', component: StarRating }
```
Custom component harus implement `FieldComponentProps`:
```tsx
interface FieldComponentProps {
  name: string
  value: unknown
  onChange: (e: ChangeEvent<...>) => void
  onBlur: (e: FocusEvent<...>) => void
  error: boolean
  helperText?: string
  label?: string
  disabled?: boolean
  required?: boolean
  options?: FieldOption[]
  form: FormApi
}
```
Lihat playground `10-custom-component`.

### 11. Theme System
Apply theme presets via `theme` prop, atau buat custom theme dengan CSS variables:
```tsx
<AxenForm theme="subtle" ... />
```
Custom theme: wrap parent element dengan CSS variables `--axen-color-primary`, `--axen-color-primary-hover`, dll.
Lihat playground `11-theme`.

### 12. Full Custom Registration Form
Demonstrates complete custom component override — semua field menggunakan custom `UnderlineField` (underline-style input), SVG illustration header, card wrapper, dan rounded submit button:
```tsx
const fields: FieldConfig[] = [
  { name: 'firstName', type: 'text', colSpan: 6, component: UnderlineField },
  { name: 'email', type: 'email', colSpan: 12, component: UnderlineField },
  { name: 'password', type: 'password', colSpan: 12, component: UnderlineField },
]
```
Pattern: custom component per-field via `component` prop + wrapping `<AxenForm>` di dalam custom layout.
Lihat playground `12-custom-registration`.

---

## Autocomplete Variants

Tiga variant tersedia:

### `autocomplete` — Client/Server Search
```tsx
{
  name: 'assignee', type: 'autocomplete',
  fetchOptions: async (query, signal) => {
    const res = await fetch(`/api/users?q=${query}`, { signal })
    return res.json()
  },
  optionLabel: 'name',
}
```
- Debounce bawaan, AbortSignal untuk cancel
- `options` untuk static data, `fetchOptions` untuk server-side

### `autocomplete-predict` — Ghost Text
```tsx
{ name: 'keyword', type: 'autocomplete-predict',
  options: [{ value: 'react', label: 'React' }, ...] }
```
- Inline ghost text prediction
- Tab untuk accept

### `autocomplete-multi` — Multi-Select
```tsx
{ name: 'tags', type: 'autocomplete-multi',
  fetchOptions: async (q) => api.searchTags(q) }
```
- Value berupa array: `['v1', 'v2']`
- Chip-based display

---

## FieldComponentProps Interface

Semua custom component harus implement `FieldComponentProps`:

```tsx
interface FieldComponentProps {
  name: string
  value: unknown
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onBlur: (e: FocusEvent<HTMLElement>) => void
  error: boolean
  helperText?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  options?: FieldOption[]
  form: FormApi    // full form API access
  [key: string]: unknown    // extra props via fieldProps
}
```

**Pattern yang benar di custom component:**
- Simulate change event: `onChange({ target: { name, value } } as any)` untuk value types non-standard
- Label + required indicator harus di-render manual

---

## Common Pitfalls

| Pitfall | Fix |
|---|---|
| Lupa import CSS tokens/reset | Tambahkan `import '@axenstudio/axen-form/tokens.css'` dan `reset.css` |
| `required: true` pada field yang bisa hidden | Built-in simpleValidator otomatis skip validasi field hidden — behavior correct. Jika pakai Yup/Zod adapter, pastikan schema juga handle conditional required |
| Custom component onChange tidak trigger update | Simulate event: `onChange({ target: { name, value } } as any)` |
| Array field tidak ada initial row | `initialValues.items = [{ name: '' }]` minimal 1 row |
| `payloadFields` tapi field tidak terrender | payloadFields hanya filter output, field tetap harus ada di config |
| colSpan responsive tidak kerja | Pastikan pakai object format: `colSpan: { xs: 12, md: 6 }` |
| Validation adapter tidak jalan | Pastikan `validationAdapter` prop di-pass ke AxenForm, bukan per-field |

---

## Resources

- `references/fieldconfig-api.md` — FieldConfig, FieldGroupConfig, AxenFormProps, FormApi, AxenFormRef full API reference
- `references/field-components.md` — All 19 field component props and behavior
- `references/patterns.md` — Pattern recipes with code
- `playground/` — 13 scenario working examples (01-basic → 12-custom-registration)
- npm: `@axenstudio/axen-form`
