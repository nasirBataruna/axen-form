/**
 * Scenario 13 — Stepper Form
 *
 * - Multi-step form composed from AxenForm + external state
 * - Step navigation: Next / Previous / Submit on last step
 * - Each step has its own FieldConfig[]
 * - Single shared initialValues across all steps
 * - Visual step indicator (custom, no external UI lib)
 */
import { AxenForm, AxenFormRef, defaultComponentMap, FieldConfig } from '@axenstudio/axen-form'
import { useRef, useState } from 'react'
import ScenarioLayout from '../../components/ScenarioLayout'

interface Step {
  title: string
  fields: FieldConfig[]
}

const steps: Step[] = [
  {
    title: 'Personal Info',
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text', required: true, colSpan: 6 },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true, colSpan: 6 },
      { name: 'email', label: 'Email', type: 'email', required: true, colSpan: 12 },
    ],
  },
  {
    title: 'Address',
    fields: [
      { name: 'street', label: 'Street Address', type: 'text', required: true, colSpan: 12 },
      { name: 'city', label: 'City', type: 'text', required: true, colSpan: 6 },
      { name: 'zipCode', label: 'Zip Code', type: 'text', required: true, colSpan: 6 },
    ],
  },
  {
    title: 'Preferences',
    fields: [
      {
        name: 'contactMethod',
        label: 'Preferred Contact',
        type: 'select',
        required: true,
        options: [
          { value: 'email', label: 'Email' },
          { value: 'phone', label: 'Phone' },
          { value: 'sms', label: 'SMS' },
        ],
        colSpan: 6,
      },
      { name: 'newsletter', label: 'Subscribe to newsletter', type: 'checkbox', colSpan: 12 },
      { name: 'notes', label: 'Additional Notes', type: 'textarea', rows: 3, colSpan: 12 },
    ],
  },
]

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  street: '',
  city: '',
  zipCode: '',
  contactMethod: '',
  newsletter: false,
  notes: '',
}

const SOURCE_CODE = `interface Step {
  title: string
  fields: FieldConfig[]
}

const steps: Step[] = [
  {
    title: 'Personal Info',
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text', required: true, colSpan: 6 },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true, colSpan: 6 },
      { name: 'email', label: 'Email', type: 'email', required: true, colSpan: 12 },
    ],
  },
  {
    title: 'Address',
    fields: [
      { name: 'street', label: 'Street Address', type: 'text', required: true, colSpan: 12 },
      { name: 'city', label: 'City', type: 'text', required: true, colSpan: 6 },
      { name: 'zipCode', label: 'Zip Code', type: 'text', required: true, colSpan: 6 },
    ],
  },
  {
    title: 'Preferences',
    fields: [
      { name: 'contactMethod', label: 'Preferred Contact', type: 'select', ... },
      { name: 'newsletter', label: 'Subscribe to newsletter', type: 'checkbox' },
      { name: 'notes', label: 'Additional Notes', type: 'textarea', rows: 3 },
    ],
  },
]

// State: current step + accumulated values
const [currentStep, setCurrentStep] = useState(0)
const [formValues, setFormValues] = useState(initialValues)

// Each step renders AxenForm with that step's fields only
<AxenForm
  ref={formRef}
  config={{ fields: steps[currentStep].fields, initialValues: formValues }}
  components={defaultComponentMap}
  onSubmit={(values) => {
    const merged = { ...formValues, ...values }
    if (currentStep < steps.length - 1) {
      setFormValues(merged)
      setCurrentStep(s => s + 1)
    } else {
      setResult(merged)  // Final submit
    }
  }}
/>

// Navigation
<button onClick={() => setCurrentStep(s => s - 1)}>Previous</button>
<button onClick={() => formRef.current?.submit()}>
  {currentStep < steps.length - 1 ? 'Next' : 'Submit'}
</button>`

export default function S13StepperForm() {
  const formRef = useRef<AxenFormRef>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [formValues, setFormValues] = useState<Record<string, unknown>>(initialValues)
  const [result, setResult] = useState<unknown>()

  const handleSubmit = (values: Record<string, unknown>) => {
    const merged = { ...formValues, ...values }
    if (currentStep < steps.length - 1) {
      setFormValues(merged)
      setCurrentStep((s) => s + 1)
    } else {
      setResult(merged)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      const current = formRef.current?.getValues()
      if (current) setFormValues((prev) => ({ ...prev, ...current }))
      setCurrentStep((s) => s - 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setFormValues(initialValues)
    setResult(undefined)
  }

  return (
    <ScenarioLayout
      title="Stepper Form"
      description="Multi-step form: navigate steps with Next/Previous, submit on the last step."
      result={result}
      sourceCode={SOURCE_CODE}
    >
      {/* Step indicator */}
      <div className="stepper-indicator">
        {steps.map((step, i) => (
          <div key={step.title} className={`stepper-step ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}>
            <div className="stepper-circle">{i < currentStep ? '✓' : i + 1}</div>
            <span className="stepper-label">{step.title}</span>
            {i < steps.length - 1 && <div className="stepper-line" />}
          </div>
        ))}
      </div>

      <div className="stepper-step-title">
        Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
      </div>

      <AxenForm
        key={currentStep}
        ref={formRef}
        config={{ fields: steps[currentStep].fields, initialValues: formValues }}
        components={defaultComponentMap}
        onSubmit={handleSubmit}
        gap="12px"
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button
          className="btn btn-outline"
          onClick={handlePrev}
          disabled={currentStep === 0}
        >
          ← Previous
        </button>
        <button
          className="btn btn-primary"
          onClick={() => formRef.current?.submit()}
        >
          {currentStep < steps.length - 1 ? 'Next →' : 'Submit'}
        </button>
        <button className="btn btn-outline" onClick={handleReset} style={{ marginLeft: 'auto' }}>
          Reset All
        </button>
      </div>
    </ScenarioLayout>
  )
}
