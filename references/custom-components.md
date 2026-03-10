# AxenForm — Custom Component Authoring Guide

## FieldComponentProps Interface

Every custom component assigned to `FieldConfig.component` must implement this interface:

```ts
import type { ChangeEvent, FocusEvent } from 'react'
import type { FieldOption, FormApi } from '@axenstudio/axen-form'

interface FieldComponentProps {
  // Core contract — MUST use these
  name: string                   // field name (used as key in form values)
  value: unknown                 // current field value from form state
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onBlur:   (e: FocusEvent<HTMLElement>) => void
  error: boolean                 // true if field has a validation error

  // Display
  label?:      string
  placeholder?: string
  helperText?:  string            // shown below field (error message or hint)
  disabled?:    boolean
  readOnly?:    boolean
  required?:    boolean

  // Options (for select-like custom components)
  options?: FieldOption[]

  // Full form API access
  form: FormApi

  // Extra props passed via FieldConfig.fieldProps
  [key: string]: unknown
}
```

---

## CSS Class Conventions

Use these built-in AxenForm CSS class names in custom components to ensure consistent spacing, label alignment, and theme compatibility:

| Class | Element | Purpose |
|---|---|---|
| `axen-field-wrapper` | outermost `<div>` | Provides field container spacing and margin |
| `axen-field-label` | `<label>` element | Consistent label typography and color |
| `axen-field-input` | primary `<input>` / `<textarea>` | Consistent input border and focus ring |
| `axen-field-error` | error message `<span>` | Error text color and font size |
| `axen-field-helper` | helper/hint text `<span>` | Subdued helper text styling |

These classes are defined in the auto-injected AxenForm CSS (no extra import needed).

---

## Authoring Patterns

### Pattern 1: Standard DOM Input Override (UnderlineField)

```tsx
import type { FieldComponentProps } from '@axenstudio/axen-form'

function UnderlineField({
  name, value, onChange, onBlur,
  label, placeholder, required, disabled,
  error, helperText,
}: FieldComponentProps) {
  return (
    <div className="axen-field-wrapper" style={{ marginBottom: 16 }}>
      {label && (
        <label className="axen-field-label" htmlFor={name} style={{ display: 'block', marginBottom: 4 }}>
          {label}
          {required && <span style={{ color: 'var(--axen-error, #d32f2f)', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        value={String(value ?? '')}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          border: 'none',
          borderBottom: error
            ? '2px solid var(--axen-error, #d32f2f)'
            : '2px solid var(--axen-color-primary, #1976d2)',
          padding: '8px 0',
          width: '100%',
          background: 'transparent',
          outline: 'none',
          fontSize: 'inherit',
        }}
      />
      {helperText && (
        <span style={{
          fontSize: '0.75em',
          color: error ? 'var(--axen-error, #d32f2f)' : 'var(--axen-text-secondary, #666)',
          marginTop: 4,
          display: 'block',
        }}>
          {helperText}
        </span>
      )}
    </div>
  )
}

// Usage in FieldConfig:
{ name: 'email', label: 'Email', type: 'email', component: UnderlineField, colSpan: 12 }
```

### Pattern 2: Non-DOM Value (StarRating)

When the value is not a native DOM event (e.g., a click selects a number), simulate a change event:

```tsx
function StarRating({ name, value, onChange, onBlur, label, required, error, helperText }: FieldComponentProps) {
  const rating = Number(value) || 0

  const handleClick = (star: number) => {
    // Simulate native ChangeEvent — AxenForm reads e.target.value
    onChange({ target: { name, value: star } } as unknown as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <div className="axen-field-wrapper">
      {label && (
        <label className="axen-field-label">
          {label}
          {required && <span style={{ color: 'var(--axen-error, #d32f2f)' }}> *</span>}
        </label>
      )}
      <div
        role="radiogroup"
        aria-label={label}
        onBlur={onBlur}
        style={{ display: 'flex', gap: 4 }}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            aria-pressed={star <= rating}
            onClick={() => handleClick(star)}
            style={{
              color: star <= rating ? '#f5a623' : '#ccc',
              fontSize: 28,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >★</button>
        ))}
      </div>
      {helperText && (
        <span style={{
          fontSize: '0.75em',
          color: error ? 'var(--axen-error, #d32f2f)' : 'var(--axen-text-secondary, #666)',
        }}>
          {helperText}
        </span>
      )}
    </div>
  )
}

// Usage:
{
  name: 'rating', label: 'Product Rating', type: 'number',
  component: StarRating,
  required: true,
  helperText: 'Click a star to rate',
  colSpan: 6,
}
```

### Pattern 3: fieldProps — Extra Props to Custom Components

Pass arbitrary extra data to a custom component via `FieldConfig.fieldProps`. They arrive as top-level props via the spread `[key: string]: unknown`.

```tsx
// FieldConfig with fieldProps:
{
  name: 'progressBar',
  type: 'number',
  component: ProgressBarInput,
  fieldProps: {
    trackColor: '#e0e0e0',
    fillColor: '#4caf50',
    showLabel: true,
  },
}

// Custom component receives them:
function ProgressBarInput({ name, value, onChange, trackColor, fillColor, showLabel }: FieldComponentProps) {
  const pct = Number(value) || 0
  return (
    <div className="axen-field-wrapper">
      {showLabel && <label className="axen-field-label">{pct}%</label>}
      <div style={{ background: String(trackColor ?? '#e0e0e0'), height: 12, borderRadius: 6 }}>
        <div style={{ background: String(fillColor ?? '#1976d2'), width: `${pct}%`, height: '100%', borderRadius: 6 }} />
      </div>
      <input
        type="range" name={name} value={pct} min={0} max={100}
        onChange={onChange}
        style={{ width: '100%' }}
      />
    </div>
  )
}
```

---

## Key Rules

1. **Always** use `axen-field-wrapper` on the outermost element for consistent margin/spacing.
2. **Always** render `label` + required asterisk manually — built-in wrapper does not add it for custom components.
3. For non-DOM values: simulate with `onChange({ target: { name, value } } as any)`.
4. Ensure `onBlur` is wired to trigger touched state and per-field validation.
5. Render `helperText` conditionally based on `error` state for correct error message display.
6. Use CSS variables (`var(--axen-color-primary)`, `var(--axen-error)`) for theming compatibility.
7. Do not access `window` or `document` directly; let AxenForm manage form state.
