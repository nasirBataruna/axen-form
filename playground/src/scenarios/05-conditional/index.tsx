/**
 * Scenario 05 — Conditional Hidden
 *
 * - hidden: boolean — static hide
 * - hidden: (values) => boolean — dynamic conditional hide
 * - Fields hidden = unmounted (no validation applied)
 */
import { AxenForm, AxenFormRef, defaultComponentMap, FieldConfig } from '@axenstudio/axen-form'
import { useRef, useState } from 'react'
import ScenarioLayout from '../../components/ScenarioLayout'

const fields: FieldConfig[] = [
  {
    name: 'orderType',
    label: 'Order Type',
    type: 'select',
    required: true,
    options: [
      { value: 'pickup', label: 'Pickup' },
      { value: 'delivery', label: 'Delivery' },
    ],
    colSpan: 12,
  },
  {
    name: 'address',
    label: 'Delivery Address',
    type: 'text',
    required: true,
    hidden: (values) => values.orderType !== 'delivery',
    colSpan: 12,
    helperText: 'Only shown when Order Type = Delivery',
  },
  {
    name: 'deliveryNotes',
    label: 'Delivery Notes',
    type: 'textarea',
    rows: 2,
    hidden: (values) => values.orderType !== 'delivery',
    colSpan: 12,
  },
  {
    name: 'pickupTime',
    label: 'Pickup Time',
    type: 'time',
    hidden: (values) => values.orderType !== 'pickup',
    colSpan: 6,
    helperText: 'Only shown when Order Type = Pickup',
  },
  {
    name: 'itemName',
    label: 'Item Name',
    type: 'text',
    required: true,
    colSpan: 6,
  },
  {
    name: 'quantity',
    label: 'Quantity',
    type: 'number',
    min: 1,
    max: 100,
    colSpan: 6,
  },
]

const initialValues = {
  orderType: '',
  address: '',
  deliveryNotes: '',
  pickupTime: '',
  itemName: '',
  quantity: 1,
}

const SOURCE_CODE = `const fields: FieldConfig[] = [
  {
    name: 'orderType', label: 'Order Type', type: 'select',
    required: true,
    options: [
      { value: 'pickup', label: 'Pickup' },
      { value: 'delivery', label: 'Delivery' },
    ],
  },
  {
    name: 'address', label: 'Delivery Address', type: 'text',
    required: true,
    // Dynamic hide: function receives current values
    hidden: (values) => values.orderType !== 'delivery',
  },
  {
    name: 'pickupTime', label: 'Pickup Time', type: 'time',
    hidden: (values) => values.orderType !== 'pickup',
  },
  {
    name: 'itemName', label: 'Item Name', type: 'text',
    required: true,
  },
]

// Hidden fields are unmounted — no validation applied`

export default function S05Conditional() {
  const formRef = useRef<AxenFormRef>(null)
  const [result, setResult] = useState<unknown>()

  return (
    <ScenarioLayout
      title="Conditional Hidden Fields"
      description="Change 'Order Type' to see fields appear/disappear dynamically."
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
