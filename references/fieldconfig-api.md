# AxenForm — Full TypeScript API Reference

## FieldConfig

```ts
interface FieldConfig {
  // Identity
  name: string                     // unique field name, used as key in values/errors
  type: FieldType                  // see: Built-in Field Types below
  label?: string                   // display label
  placeholder?: string             // HTML placeholder attribute

  // Layout
  colSpan?: number | ColSpanConfig // 1–12 grid columns; object for responsive breakpoints
  // ColSpanConfig: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }

  // Validation
  required?: boolean               // marks field required; displayed as asterisk
  min?: number                     // numeric: minimum value; string: minimum length
  max?: number                     // numeric: maximum value; string: maximum length
  validation?: unknown             // yup schema | zod schema — overrides auto-generated schema

  // Behavior
  disabled?: boolean               // disables the field input
  readOnly?: boolean               // renders as read-only (no user interaction)
  hidden?: boolean | ((values: Record<string, unknown>) => boolean)
  // hidden: true → always unmounted (not rendered, not validated)
  // hidden: (values) → boolean → computed per render cycle

  // Content
  options?: FieldOption[]          // static options for select/radio/checkbox-group
  helperText?: string              // displayed below field (shown on error OR always, by theme)
  rows?: number                    // textarea: number of visible rows (default: 3)

  // Lookup (autocomplete)
  fetchOptions?: (query: string, signal: AbortSignal) => Promise<FieldOption[]>
  optionLabel?: string             // key in returned objects to use as label (default: 'label')
  optionValue?: string             // key in returned objects to use as value (default: 'value')
  debounce?: number                // autocomplete debounce in ms (default: 300)

  // Slider
  step?: number                    // slider: step increment
  marks?: boolean | Mark[]         // slider: show marks along the track

  // Custom component
  component?: React.ComponentType<FieldComponentProps>
  fieldProps?: Record<string, unknown>  // extra props passed to custom component

  // Field groups
  // When used as a field group rather than a plain FieldConfig:
  // See FieldGroupConfig below
}

type FieldType =
  | 'text' | 'email' | 'password' | 'textarea' | 'number' | 'tel'
  | 'date' | 'time' | 'datetime-local'
  | 'select' | 'radio' | 'checkbox' | 'checkbox-group' | 'switch'
  | 'slider' | 'rating' | 'color' | 'file'
  | 'autocomplete' | 'autocomplete-predict' | 'autocomplete-multi'

interface FieldOption {
  value: string | number
  label: string
  [key: string]: unknown  // extra fields for optionLabel/optionValue
}
```

## FieldGroupConfig

Visual grouping of fields into a bordered/titled section.

```ts
interface FieldGroupConfig {
  isGroup: true                    // REQUIRED discriminator — distinguishes from FieldConfig
  groupLabel?: string              // section title displayed above grouped fields
  fields: FieldConfig[]            // fields belonging to this group
  colSpan?: number | ColSpanConfig
}

// Usage in config.fields — mix groups and standalone fields:
const fields: (FieldConfig | FieldGroupConfig)[] = [
  { name: 'title', label: 'Title', type: 'text', colSpan: 12 },
  {
    isGroup: true,
    groupLabel: 'Contact Details',
    fields: [
      { name: 'email', label: 'Email', type: 'email', colSpan: 6 },
      { name: 'phone', label: 'Phone', type: 'tel',   colSpan: 6 },
    ],
  },
]
```

## ArrayFieldConfig

Extends FieldConfig for repeatable row arrays.

```ts
interface ArrayFieldConfig extends Omit<FieldConfig, 'type'> {
  type: string                     // must be a valid FieldType (acts as structural type)
  isArray: true                    // REQUIRED discriminator
  fields: FieldConfig[]            // sub-fields of each row
  minItems?: number                // minimum row count (UI: disables remove when at min)
  maxItems?: number                // maximum row count (UI: disables add when at max)
  addLabel?: string                // custom text for Add button (default: 'Add')
  removeLabel?: string             // custom text for Remove button (default: 'Remove')
}
```

## AxenFormProps

```ts
interface AxenFormProps {
  config: {
    fields: (FieldConfig | FieldGroupConfig)[]
    initialValues: Record<string, unknown>
  }
  components: ComponentMap              // REQUIRED — pass defaultComponentMap
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>
  ref?: React.Ref<AxenFormRef>

  // Validation
  validationAdapter?: ValidationAdapter
  validateOnChange?: boolean           // default: false (validates on blur/submit)
  validateOnBlur?: boolean             // default: true

  // Layout
  gap?: string | number               // CSS gap between field rows (default: '8px')
  theme?: string                      // 'default' | 'subtle' | 'outlined' | 'filled' | custom

  // Payload filtering
  payloadFields?: string[] | Record<string, string[]>
  payloadDiscriminator?: string       // field name whose value selects payloadFields key

  // Slot
  children?: React.ReactNode          // components in children get useFormContext access
}
```

## AxenFormRef

Imperative handle returned by `useRef<AxenFormRef>()`.

```ts
interface AxenFormRef {
  submit(): void
  // Triggers full validation then calls onSubmit if valid.

  resetForm(nextValues?: Record<string, unknown>): void
  // Without arg: resets to config.initialValues.
  // With arg: resets to provided values (replaces initialValues baseline).

  getValues(): Record<string, unknown>
  // Returns current form values snapshot (before submit).

  getErrors(): Record<string, string>
  // Returns current validation errors: { fieldName: errorMessage }.

  isValid(): boolean
  // True if getErrors() is empty and all required fields pass.

  isDirty(): boolean
  // True if any value differs from initialValues.
}
```

## FormApi / FormState

Accessed via `useFormContext` hook inside AxenForm children.

```ts
interface FormState {
  values:       Record<string, unknown>  // live field values
  errors:       Record<string, string>   // field error messages (key = field name)
  touched:      Record<string, boolean>  // true if field was blurred at least once
  dirty:        boolean                  // any value ≠ initialValue
  isSubmitting: boolean                  // true while onSubmit Promise is pending
  submitCount:  number                   // number of submit attempts in current session
}

interface FormApi {
  getState():                          FormState
  getFieldValue(name: string):         unknown
  setFieldValue(name: string, value: unknown): void
  setFieldTouched(name: string, touched: boolean): void
  subscribeField(name: string, callback: (value: unknown) => void): () => void
  // Returns unsubscribe function
}

// Access pattern:
import { useFormContext } from '@axenstudio/axen-form'

function Child() {
  const { store } = useFormContext()    // store: FormApi
  const state = store.getState()       // FormState
  store.setFieldValue('name', 'Alice')
}
```

## ValidationAdapter Interface

```ts
interface ValidationAdapter {
  validate(
    values: Record<string, unknown>,
    fields: FieldConfig[]
  ): Promise<Record<string, string>>
  // Returns map of fieldName → error message.
  // Return {} (empty) if all fields valid.

  validateField?(
    name: string,
    value: unknown,
    field: FieldConfig
  ): Promise<string | undefined>
  // Optional: per-field validation for validateOnChange mode.
}

// Built-in adapters:
import { yupAdapter } from '@axenstudio/axen-form/adapters/yup'
import { zodAdapter } from '@axenstudio/axen-form/adapters/zod'

// Usage:
<AxenForm validationAdapter={yupAdapter(yup)} ... />
<AxenForm validationAdapter={zodAdapter(z)} ... />
```

## ArrayHelpers

API available in `AxenArrayField` render prop.

```ts
interface ArrayHelpers {
  push(item: Record<string, unknown>): void
  remove(index: number): void
  insert(index: number, item: Record<string, unknown>): void
  replace(index: number, item: Record<string, unknown>): void
  swap(indexA: number, indexB: number): void
  move(from: number, to: number): void
  length: number
}
```
