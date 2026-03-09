/**
 * Scenario 04 — Yup / Zod Validation
 *
 * Demonstrates pluggable validation adapters:
 * - Yup adapter (yupAdapter)
 * - Zod adapter (zodAdapter)
 * Both imported from @axenstudio/axen-form/adapters/*
 */
import { AxenForm, AxenFormRef, defaultComponentMap, FieldConfig } from '@axenstudio/axen-form'
import { useEffect, useRef, useState } from 'react'
import ScenarioLayout from '../../components/ScenarioLayout'

const SOURCE_CODE = `// Yup Adapter
import { yupAdapter } from '@axenstudio/axen-form/adapters/yup'
import * as yup from 'yup'

const yupFields = [
  {
    name: 'name', type: 'text', required: true,
    validation: yup.string().min(3, 'Min 3 characters').required(),
  },
  {
    name: 'email', type: 'email', required: true,
    validation: yup.string().email('Invalid email').required(),
  },
]

<AxenForm
  config={{ fields: yupFields, initialValues }}
  validationAdapter={yupAdapter(yup)}
  onSubmit={handleSubmit}
/>

// Zod Adapter
import { zodAdapter } from '@axenstudio/axen-form/adapters/zod'
import { z } from 'zod'

const zodFields = [
  {
    name: 'username', type: 'text', required: true,
    validation: z.string().min(3, 'Min 3 characters'),
  },
  {
    name: 'website', type: 'text',
    validation: z.string().url('Must be a valid URL'),
  },
]

<AxenForm
  config={{ fields: zodFields, initialValues }}
  validationAdapter={zodAdapter(z)}
  onSubmit={handleSubmit}
/>`

interface AdapterState {
  yupAdapter?: unknown
  yupFields: FieldConfig[]
  zodAdapter?: unknown
  zodFields: FieldConfig[]
}

async function loadAdapters(): Promise<AdapterState> {
  const state: AdapterState = { yupFields: [], zodFields: [] }

  try {
    const yup = await import('yup')
    const { yupAdapter } = await import('@axenstudio/axen-form/adapters/yup')
    state.yupAdapter = yupAdapter(yup)
    state.yupFields = [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        validation: yup.string().min(3, 'Min 3 characters').required('Name is required'),
        colSpan: 12,
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        validation: yup.string().email('Invalid email').required('Email is required'),
        colSpan: 6,
      },
      {
        name: 'age',
        label: 'Age',
        type: 'number',
        validation: yup.number().min(18, 'Must be 18+').max(120, 'Too old').required('Age is required'),
        colSpan: 6,
      },
    ]
  } catch {
    // yup not installed
  }

  try {
    const { z } = await import('zod')
    const { zodAdapter } = await import('@axenstudio/axen-form/adapters/zod')
    state.zodAdapter = zodAdapter(z)
    state.zodFields = [
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        validation: z.string().min(3, 'Min 3 characters'),
        colSpan: 12,
      },
      {
        name: 'website',
        label: 'Website',
        type: 'text',
        validation: z.string().url('Must be a valid URL'),
        colSpan: 6,
      },
      {
        name: 'score',
        label: 'Score',
        type: 'number',
        validation: z.number().min(0, 'Min 0').max(100, 'Max 100'),
        colSpan: 6,
      },
    ]
  } catch {
    // zod not installed
  }

  return state
}

export default function S04Validation() {
  const yupRef = useRef<AxenFormRef>(null)
  const zodRef = useRef<AxenFormRef>(null)
  const [yupResult, setYupResult] = useState<unknown>()
  const [zodResult, setZodResult] = useState<unknown>()
  const [adapters, setAdapters] = useState<AdapterState | null>(null)

  useEffect(() => {
    loadAdapters().then(setAdapters)
  }, [])

  if (!adapters) {
    return <p style={{ color: '#999', padding: 24 }}>Loading validation adapters…</p>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Yup Section */}
      <ScenarioLayout
        title="Yup Validation"
        description="Plugin-based: import { yupAdapter } from '@axenstudio/axen-form/adapters/yup'. Fields are validated on blur and on submit."
        result={yupResult}
        sourceCode={SOURCE_CODE}
      >
        {adapters.yupAdapter ? (
          <>
            <div className="info-box">
              <strong>Tip:</strong> Try submitting with empty fields or invalid values to see Yup validation messages.
            </div>
            <AxenForm
              ref={yupRef}
              config={{ fields: adapters.yupFields, initialValues: { name: '', email: '', age: '' } }}
              components={defaultComponentMap}
              validationAdapter={adapters.yupAdapter as never}
              onSubmit={(values) => setYupResult(values)}
              gap="12px"
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="btn btn-primary" onClick={() => yupRef.current?.submit()}>Submit (Yup)</button>
              <button className="btn btn-outline" onClick={() => { yupRef.current?.resetForm(); setYupResult(undefined) }}>Reset</button>
            </div>
          </>
        ) : (
          <div className="info-box warn">
            <strong>Yup not available.</strong> Install it: <code>pnpm add yup</code>
          </div>
        )}
      </ScenarioLayout>

      {/* Zod Section */}
      <ScenarioLayout
        title="Zod Validation"
        description="Plugin-based: import { zodAdapter } from '@axenstudio/axen-form/adapters/zod'. Same validation UX, different schema library."
        result={zodResult}
        sourceCode={SOURCE_CODE}
      >
        {adapters.zodAdapter ? (
          <>
            <div className="info-box">
              <strong>Tip:</strong> Zod validates the same way — try an invalid URL in the Website field.
            </div>
            <AxenForm
              ref={zodRef}
              config={{ fields: adapters.zodFields, initialValues: { username: '', website: '', score: '' } }}
              components={defaultComponentMap}
              validationAdapter={adapters.zodAdapter as never}
              onSubmit={(values) => setZodResult(values)}
              gap="12px"
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="btn btn-primary" onClick={() => zodRef.current?.submit()}>Submit (Zod)</button>
              <button className="btn btn-outline" onClick={() => { zodRef.current?.resetForm(); setZodResult(undefined) }}>Reset</button>
            </div>
          </>
        ) : (
          <div className="info-box warn">
            <strong>Zod not available.</strong> Install it: <code>pnpm add zod</code>
          </div>
        )}
      </ScenarioLayout>
    </div>
  )
}
