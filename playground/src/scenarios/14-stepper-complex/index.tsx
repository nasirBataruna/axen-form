/**
 * Scenario 14 — Stepper Form Complex Case
 *
 * - Per-step validation (cannot proceed if step is invalid)
 * - Conditional step: "Company Info" only appears if accountType === 'business'
 * - Review/summary step before final submit
 * - Step status tracking (visited / valid / invalid)
 * - AxenFormRef.getValues() + isValid() for step-level checks
 */
import { AxenForm, AxenFormRef, defaultComponentMap, FieldConfig } from '@axenstudio/axen-form'
import { useMemo, useRef, useState } from 'react'
import ScenarioLayout from '../../components/ScenarioLayout'

interface StepDef {
  id: string
  title: string
  fields: FieldConfig[]
  /** If set, step is only shown when condition returns true */
  condition?: (values: Record<string, unknown>) => boolean
}

const ALL_STEPS: StepDef[] = [
  {
    id: 'account',
    title: 'Account Type',
    fields: [
      {
        name: 'accountType',
        label: 'Account Type',
        type: 'radio',
        required: true,
        options: [
          { value: 'personal', label: 'Personal' },
          { value: 'business', label: 'Business' },
        ],
        colSpan: 12,
        helperText: 'Choosing "Business" will add an extra Company Info step.',
      },
      { name: 'fullName', label: 'Full Name', type: 'text', required: true, colSpan: 12 },
      { name: 'email', label: 'Email', type: 'email', required: true, colSpan: 6 },
      { name: 'phone', label: 'Phone', type: 'tel', colSpan: 6 },
    ],
  },
  {
    id: 'company',
    title: 'Company Info',
    condition: (values) => values.accountType === 'business',
    fields: [
      { name: 'companyName', label: 'Company Name', type: 'text', required: true, colSpan: 12 },
      { name: 'companySize', label: 'Company Size', type: 'select', required: true, options: [
        { value: '1-10', label: '1–10 employees' },
        { value: '11-50', label: '11–50 employees' },
        { value: '51-200', label: '51–200 employees' },
        { value: '200+', label: '200+ employees' },
      ], colSpan: 6 },
      { name: 'taxId', label: 'Tax ID', type: 'text', colSpan: 6 },
      { name: 'website', label: 'Website', type: 'url', colSpan: 12 },
    ],
  },
  {
    id: 'address',
    title: 'Address',
    fields: [
      { name: 'street', label: 'Street', type: 'text', required: true, colSpan: 12 },
      { name: 'city', label: 'City', type: 'text', required: true, colSpan: 4 },
      { name: 'state', label: 'State / Province', type: 'text', colSpan: 4 },
      { name: 'zipCode', label: 'Zip Code', type: 'text', required: true, colSpan: 4 },
      { name: 'country', label: 'Country', type: 'select', required: true, options: [
        { value: 'ID', label: 'Indonesia' },
        { value: 'US', label: 'United States' },
        { value: 'SG', label: 'Singapore' },
        { value: 'JP', label: 'Japan' },
        { value: 'OTHER', label: 'Other' },
      ], colSpan: 6 },
    ],
  },
  {
    id: 'preferences',
    title: 'Preferences',
    fields: [
      { name: 'language', label: 'Language', type: 'select', options: [
        { value: 'id', label: 'Bahasa Indonesia' },
        { value: 'en', label: 'English' },
        { value: 'ja', label: '日本語' },
      ], colSpan: 6 },
      { name: 'newsletter', label: 'Subscribe to newsletter', type: 'checkbox', colSpan: 12 },
      { name: 'termsAccepted', label: 'I accept the terms and conditions', type: 'checkbox', required: true, colSpan: 12 },
    ],
  },
]

const initialValues: Record<string, unknown> = {
  accountType: '',
  fullName: '',
  email: '',
  phone: '',
  companyName: '',
  companySize: '',
  taxId: '',
  website: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  language: '',
  newsletter: false,
  termsAccepted: false,
}

type StepStatus = 'pending' | 'valid' | 'invalid'

const SOURCE_CODE = `// Complex stepper: conditional steps, per-step validation, review summary

const ALL_STEPS: StepDef[] = [
  { id: 'account', title: 'Account Type', fields: [...] },
  {
    id: 'company', title: 'Company Info',
    condition: (values) => values.accountType === 'business', // Conditional step!
    fields: [...]
  },
  { id: 'address', title: 'Address', fields: [...] },
  { id: 'preferences', title: 'Preferences', fields: [...] },
]

// Filter steps dynamically based on current values
const activeSteps = useMemo(
  () => ALL_STEPS.filter(s => !s.condition || s.condition(formValues)),
  [formValues]
)

// Per-step validation before advancing
const handleNext = () => {
  formRef.current?.submit()  // triggers onSubmit only if valid
}

const handleSubmit = (values) => {
  const merged = { ...formValues, ...values }
  setFormValues(merged)
  setStepStatuses(prev => ({ ...prev, [activeSteps[currentStep].id]: 'valid' }))

  if (currentStep < activeSteps.length - 1) {
    setCurrentStep(s => s + 1)
  } else {
    setShowReview(true)  // Show review summary
  }
}

// Review step: display all collected values before final submit
{showReview && (
  <div className="stepper-review">
    {Object.entries(formValues).map(([key, val]) => (
      <div key={key}><strong>{key}:</strong> {String(val)}</div>
    ))}
    <button onClick={() => setResult(formValues)}>Confirm & Submit</button>
  </div>
)}`

export default function S14StepperComplex() {
  const formRef = useRef<AxenFormRef>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [formValues, setFormValues] = useState<Record<string, unknown>>(initialValues)
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>({})
  const [showReview, setShowReview] = useState(false)
  const [result, setResult] = useState<unknown>()

  // Filter steps based on current form values (conditional step)
  const activeSteps = useMemo(
    () => ALL_STEPS.filter((s) => !s.condition || s.condition(formValues)),
    [formValues],
  )

  // Clamp currentStep if a conditional step disappeared
  const safeStep = Math.min(currentStep, activeSteps.length - 1)
  if (safeStep !== currentStep) setCurrentStep(safeStep)

  const currentStepDef = activeSteps[safeStep]

  const handleStepSubmit = (values: Record<string, unknown>) => {
    const merged = { ...formValues, ...values }
    setFormValues(merged)
    setStepStatuses((prev) => ({ ...prev, [currentStepDef.id]: 'valid' }))

    if (safeStep < activeSteps.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      setShowReview(true)
    }
  }

  const handlePrev = () => {
    if (showReview) {
      setShowReview(false)
      return
    }
    if (safeStep > 0) {
      const current = formRef.current?.getValues()
      if (current) setFormValues((prev) => ({ ...prev, ...current }))
      setCurrentStep((s) => s - 1)
    }
  }

  const handleNext = () => {
    // submit() triggers built-in validation; onSubmit only fires if valid
    formRef.current?.submit()
  }

  const handleConfirm = () => {
    setResult(formValues)
    setShowReview(false)
  }

  const handleReset = () => {
    setCurrentStep(0)
    setFormValues(initialValues)
    setStepStatuses({})
    setShowReview(false)
    setResult(undefined)
  }

  const handleJumpToStep = (index: number) => {
    // Only allow jumping to visited (valid/invalid) steps or previous steps
    if (index <= safeStep || stepStatuses[activeSteps[index].id]) {
      const current = formRef.current?.getValues()
      if (current) setFormValues((prev) => ({ ...prev, ...current }))
      setShowReview(false)
      setCurrentStep(index)
    }
  }

  // Build review data: group by step
  const reviewSections = useMemo(() => {
    return activeSteps.map((step) => ({
      title: step.title,
      entries: step.fields
        .filter((f) => formValues[f.name] !== '' && formValues[f.name] !== false && formValues[f.name] != null)
        .map((f) => {
          let displayValue = String(formValues[f.name] ?? '')
          // Resolve select/radio labels
          if (f.options) {
            const opt = f.options.find((o) => o.value === formValues[f.name])
            if (opt) displayValue = (opt as { label: string }).label
          }
          return { label: f.label || f.name, value: displayValue }
        }),
    }))
  }, [activeSteps, formValues])

  return (
    <ScenarioLayout
      title="Stepper Form — Complex Case"
      description="Per-step validation, conditional steps (Business → Company Info), review summary before submit."
      result={result}
      sourceCode={SOURCE_CODE}
    >
      {/* Step indicator with status */}
      <div className="stepper-indicator">
        {activeSteps.map((step, i) => {
          const status = stepStatuses[step.id] || 'pending'
          const isCurrent = i === safeStep && !showReview
          const isVisited = status === 'valid' || status === 'invalid'
          return (
            <div
              key={step.id}
              className={`stepper-step ${isCurrent ? 'active' : ''} ${status === 'valid' ? 'completed' : ''} ${isVisited ? 'clickable' : ''}`}
              onClick={() => handleJumpToStep(i)}
            >
              <div className={`stepper-circle ${status === 'invalid' ? 'error' : ''}`}>
                {status === 'valid' ? '✓' : i + 1}
              </div>
              <span className="stepper-label">{step.title}</span>
              {i < activeSteps.length - 1 && <div className="stepper-line" />}
            </div>
          )
        })}
        {/* Review indicator */}
        <div className={`stepper-step ${showReview ? 'active' : ''}`}>
          <div className="stepper-circle">✦</div>
          <span className="stepper-label">Review</span>
        </div>
      </div>

      {showReview ? (
        /* Review Summary */
        <div className="stepper-review">
          <h4 style={{ margin: '0 0 12px', fontSize: 16 }}>Review Your Information</h4>
          {reviewSections.map((section) => (
            <div key={section.title} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#1a73e8', marginBottom: 4 }}>
                {section.title}
              </div>
              {section.entries.length === 0 ? (
                <div style={{ fontSize: 13, color: '#999', fontStyle: 'italic' }}>No data</div>
              ) : (
                section.entries.map((e) => (
                  <div key={e.label} className="stepper-review-row">
                    <span className="stepper-review-label">{e.label}</span>
                    <span className="stepper-review-value">{e.value === 'true' ? '✓' : e.value}</span>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Form step */
        <>
          <div className="stepper-step-title">
            Step {safeStep + 1} of {activeSteps.length}: {currentStepDef.title}
            {formValues.accountType === 'business' && currentStepDef.id !== 'company' && (
              <span className="stepper-conditional-hint">★ Company Info step active</span>
            )}
          </div>

          <AxenForm
            key={`${currentStepDef.id}-${safeStep}`}
            ref={formRef}
            config={{ fields: currentStepDef.fields, initialValues: formValues }}
            components={defaultComponentMap}
            onSubmit={handleStepSubmit}
            gap="12px"
          />
        </>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button
          className="btn btn-outline"
          onClick={handlePrev}
          disabled={safeStep === 0 && !showReview}
        >
          ← Previous
        </button>

        {showReview ? (
          <button className="btn btn-primary" onClick={handleConfirm}>
            ✓ Confirm & Submit
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleNext}>
            {safeStep < activeSteps.length - 1 ? 'Next →' : 'Review →'}
          </button>
        )}

        <button className="btn btn-outline" onClick={handleReset} style={{ marginLeft: 'auto' }}>
          Reset All
        </button>
      </div>

      {/* Info box about conditional step */}
      <div className="info-box" style={{ marginTop: 16 }}>
        <strong>Complex Features:</strong> This scenario demonstrates per-step validation
        (can't advance unless current step is valid), a <strong>conditional step</strong> (Company Info
        only appears for Business accounts), clickable step indicators to jump back,
        and a <strong>review summary</strong> before final submission.
      </div>
    </ScenarioLayout>
  )
}
