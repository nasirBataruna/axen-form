/**
 * Scenario 10 — Custom Component
 *
 * - Override built-in field type with custom component
 * - Implement FieldComponentProps interface
 * - Use `component` prop on FieldConfig
 */
import { AxenForm, AxenFormRef, defaultComponentMap, FieldComponentProps, FieldConfig } from '@axenstudio/axen-form'
import { useRef, useState } from 'react'
import ScenarioLayout from '../../components/ScenarioLayout'

/**
 * Custom star rating component implementing FieldComponentProps.
 */
function StarRating({ name, value, onChange, error, helperText, label, required }: Readonly<FieldComponentProps>) {
  const rating = Number(value) || 0

  const handleClick = (star: number) => {
    // Simulate a change event
    const event = {
      target: { name, value: star },
    } as unknown as React.ChangeEvent<HTMLInputElement>
    onChange(event)
  }

  return (
    <div className="axen-field-wrapper">
      {label && (
        <label className="axen-field-label">
          {label}{required && <span style={{ color: 'var(--axen-error, #d32f2f)' }}> *</span>}
        </label>
      )}
      <div style={{ display: 'flex', gap: 4, cursor: 'pointer', fontSize: 24 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            style={{
              color: star <= rating ? '#f5a623' : '#ccc',
              transition: 'color 0.2s',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontSize: 'inherit',
            }}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
        {rating > 0 && (
          <span style={{ fontSize: 14, color: '#666', alignSelf: 'center', marginLeft: 8 }}>
            {rating}/5
          </span>
        )}
      </div>
      {(error && helperText) && (
        <span style={{ fontSize: '0.8em', color: 'var(--axen-error, #d32f2f)' }}>{helperText}</span>
      )}
      {(!error && helperText) && (
        <span style={{ fontSize: '0.8em', color: '#666' }}>{helperText}</span>
      )}
    </div>
  )
}

/**
 * Custom color swatch picker component.
 */
function ColorSwatchPicker({ name, value, onChange, label, required }: Readonly<FieldComponentProps>) {
  const colors = ['#f44336', '#e91e63', '#9c27b0', '#3f51b5', '#2196f3', '#4caf50', '#ff9800', '#795548']

  const handlePick = (color: string) => {
    const event = {
      target: { name, value: color },
    } as unknown as React.ChangeEvent<HTMLInputElement>
    onChange(event)
  }

  return (
    <div className="axen-field-wrapper">
      {label && (
        <label className="axen-field-label">
          {label}{required && <span style={{ color: 'var(--axen-error, #d32f2f)' }}> *</span>}
        </label>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => handlePick(color)}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: color,
              border: value === color ? '3px solid #333' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'border 0.2s',
              padding: 0,
            }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
      {typeof value === 'string' && value !== '' && (
        <span style={{ fontSize: '0.85em', color: '#666', marginTop: 4 }}>
          Selected: {value}
        </span>
      )}
    </div>
  )
}

const fields: FieldConfig[] = [
  { name: 'productName', label: 'Product Name', type: 'text', required: true, colSpan: 12 },
  {
    name: 'rating',
    label: 'Rating',
    type: 'number',                   // base type
    component: StarRating,            // override with custom component
    required: true,
    colSpan: 6,
    helperText: 'Click a star to rate',
  },
  {
    name: 'themeColor',
    label: 'Theme Color',
    type: 'color',                    // base type
    component: ColorSwatchPicker,     // override with custom component
    colSpan: 6,
  },
  { name: 'review', label: 'Review', type: 'textarea', rows: 3, colSpan: 12 },
]

const initialValues = {
  productName: '',
  rating: 0,
  themeColor: '',
  review: '',
}

const SOURCE_CODE = `// Custom component implementing FieldComponentProps
function StarRating({ name, value, onChange, label, required }
  : FieldComponentProps) {
  const rating = Number(value) || 0
  const handleClick = (star: number) => {
    onChange({ target: { name, value: star } } as any)
  }
  return (
    <div>
      {[1,2,3,4,5].map(s => (
        <span key={s} onClick={() => handleClick(s)}
          style={{ color: s <= rating ? '#f5a623' : '#ccc' }}>
          ★
        </span>
      ))}
    </div>
  )
}

// Use component prop on FieldConfig
const fields: FieldConfig[] = [
  { name: 'productName', type: 'text', required: true },
  {
    name: 'rating',
    type: 'number',        // base type
    component: StarRating,  // override renderer
    required: true,
  },
  {
    name: 'themeColor',
    type: 'color',
    component: ColorSwatchPicker,
  },
]`

export default function S10CustomComponent() {
  const formRef = useRef<AxenFormRef>(null)
  const [result, setResult] = useState<unknown>()

  return (
    <ScenarioLayout
      title="Custom Components"
      description="Override built-in field types with custom components via the \`component\` prop."
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
