/**
 * Scenario 06 — Array Fields
 *
 * - AxenArrayField with render-props pattern
 * - useFieldArray hook with push/remove helpers
 * - Repeatable field groups
 */
import { ArrayFieldConfig, AxenArrayField, AxenForm, AxenFormRef, defaultComponentMap, FieldConfig } from '@axenstudio/axen-form'
import { useCallback, useRef, useState } from 'react'
import ScenarioLayout from '../../components/ScenarioLayout'

const SOURCE_CODE = `import { ArrayFieldConfig, AxenArrayField, AxenForm } from '@axenstudio/axen-form'

const teamConfig: ArrayFieldConfig = {
  name: 'members',
  type: 'text',
  isArray: true,
  label: 'Team Members',
  fields: [
    { name: 'firstName', label: 'First Name', type: 'text', colSpan: 6 },
    { name: 'lastName', label: 'Last Name', type: 'text', colSpan: 6 },
    { name: 'email', label: 'Email', type: 'email', colSpan: 12 },
  ],
  minItems: 1,
  maxItems: 5,
  addLabel: '+ Add Member',
  removeLabel: 'Remove',
}

<AxenForm config={config} components={defaultComponentMap} onSubmit={handleSubmit}>
  <AxenArrayField name="members" config={teamConfig}>
    {({ fields: items, helpers, renderField }) => (
      <div>
        {items.map((_, index) => (
          <div key={index}>
            <strong>Member #{index + 1}</strong>
            {renderField(index)}
            <button onClick={() => helpers.remove(index)}>Remove</button>
          </div>
        ))}
        <button onClick={() => helpers.push({ firstName: '', lastName: '', email: '' })}>
          + Add Member
        </button>
      </div>
    )}
  </AxenArrayField>
</AxenForm>`

const personFields: FieldConfig[] = [
  { name: 'firstName', label: 'First Name', type: 'text', required: true, colSpan: 6 },
  { name: 'lastName', label: 'Last Name', type: 'text', required: true, colSpan: 6 },
  { name: 'email', label: 'Email', type: 'email', colSpan: 12 },
]

const teamConfig: ArrayFieldConfig = {
  name: 'members',
  type: 'text',
  isArray: true,
  label: 'Team Members',
  fields: personFields,
  minItems: 1,
  maxItems: 5,
  addLabel: '+ Add Member',
  removeLabel: 'Remove',
}

const fields: (FieldConfig | ArrayFieldConfig)[] = [
  { name: 'teamName', label: 'Team Name', type: 'text', required: true, colSpan: 12 },
]

const initialValues = {
  teamName: '',
  members: [{ firstName: '', lastName: '', email: '' }],
}

export default function S06ArrayFields() {
  const formRef = useRef<AxenFormRef>(null)
  const [result, setResult] = useState<unknown>()
  const nextKeyId = useRef(1)
  const memberKeys = useRef([0])

  const addMember = useCallback((push: (item: Record<string, string>) => void) => {
    push({ firstName: '', lastName: '', email: '' })
    memberKeys.current.push(nextKeyId.current++)
  }, [])

  const removeMember = useCallback((remove: (index: number) => void, index: number) => {
    remove(index)
    memberKeys.current.splice(index, 1)
  }, [])

  return (
    <ScenarioLayout
      title="Array Fields"
      description="Repeatable field groups using AxenArrayField with push/remove helpers."
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

      {/* AxenArrayField must be rendered inside the form context.
          We use a separate AxenForm for the array demo: */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 8 }}>Array Field Demo (Standalone)</h3>
        <AxenForm
          ref={formRef}
          config={{
            fields: [
              { name: 'teamName', label: 'Team Name', type: 'text', required: true, colSpan: 12 },
            ],
            initialValues,
          }}
          components={defaultComponentMap}
          onSubmit={(values) => setResult(values)}
          gap="12px"
        >
          <AxenArrayField name="members" config={teamConfig}>
            {({ fields: items, helpers, renderField }) => (
              <div>
                {items.map((_, index) => (
                  <div
                    key={memberKeys.current[index]}
                    style={{
                      border: '1px solid var(--axen-border, #ddd)',
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 8,
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <strong>Member #{index + 1}</strong>
                      {items.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeMember(helpers.remove, index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {renderField(index)}
                  </div>
                ))}
                {items.length < 5 && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => addMember(helpers.push)}
                  >
                    + Add Member
                  </button>
                )}
              </div>
            )}
          </AxenArrayField>
        </AxenForm>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button className="btn btn-primary" onClick={() => formRef.current?.submit()}>Submit</button>
        <button className="btn btn-outline" onClick={() => { formRef.current?.resetForm(); setResult(undefined) }}>Reset</button>
      </div>
    </ScenarioLayout>
  )
}
