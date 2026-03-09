/**
 * Scenario 13 — Custom Registration (Full Custom Component)
 *
 * - Fully custom form card with illustration header
 * - Custom component override for all fields (minimal underline style)
 * - Close button, city SVG illustration, rounded submit
 * - Demonstrates FieldComponentProps + full layout customization
 */
import { AxenForm, AxenFormRef, FieldComponentProps, FieldConfig, defaultComponentMap } from '@axenstudio/axen-form'
import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import ScenarioLayout from '../../components/ScenarioLayout'

/* ────────────────────────────────────────────
   City Skyline SVG Illustration
   ──────────────────────────────────────────── */
function CityIllustration() {
  return (
    <svg viewBox="0 0 400 140" style={{ width: '100%', maxWidth: 320, display: 'block', margin: '0 auto' }}>
      {/* Sun */}
      <circle cx="200" cy="18" r="10" fill="none" stroke="#4ecdc4" strokeWidth="2" />
      <line x1="200" y1="2" x2="200" y2="6" stroke="#4ecdc4" strokeWidth="1.5" />
      <line x1="200" y1="30" x2="200" y2="34" stroke="#4ecdc4" strokeWidth="1.5" />
      <line x1="184" y1="18" x2="188" y2="18" stroke="#4ecdc4" strokeWidth="1.5" />
      <line x1="212" y1="18" x2="216" y2="18" stroke="#4ecdc4" strokeWidth="1.5" />

      {/* Buildings */}
      <rect x="20" y="50" width="30" height="90" fill="none" stroke="#4ecdc4" strokeWidth="1.5" rx="1" />
      <rect x="24" y="58" width="6" height="8" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="34" y="58" width="6" height="8" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="24" y="72" width="6" height="8" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="34" y="72" width="6" height="8" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="24" y="86" width="6" height="8" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="34" y="86" width="6" height="8" fill="none" stroke="#4ecdc4" strokeWidth="1" />

      <rect x="60" y="35" width="25" height="105" fill="none" stroke="#4ecdc4" strokeWidth="1.5" rx="1" />
      <rect x="64" y="42" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="73" y="42" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="64" y="56" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="73" y="56" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="64" y="70" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="73" y="70" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />

      <rect x="95" y="60" width="35" height="80" fill="none" stroke="#4ecdc4" strokeWidth="1.5" rx="1" />
      <rect x="100" y="67" width="6" height="8" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="112" y="67" width="6" height="8" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="100" y="82" width="6" height="8" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="112" y="82" width="6" height="8" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="103" y="106" width="10" height="34" fill="none" stroke="#4ecdc4" strokeWidth="1" />

      {/* Center tall building */}
      <rect x="145" y="25" width="22" height="115" fill="none" stroke="#4ecdc4" strokeWidth="1.5" rx="1" />
      <rect x="149" y="32" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="158" y="32" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="149" y="46" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="158" y="46" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="149" y="60" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="158" y="60" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />

      {/* Tower with antenna */}
      <rect x="180" y="40" width="18" height="100" fill="none" stroke="#4ecdc4" strokeWidth="1.5" rx="1" />
      <line x1="189" y1="40" x2="189" y2="28" stroke="#4ecdc4" strokeWidth="1.5" />
      <rect x="183" y="48" width="4" height="6" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="190" y="48" width="4" height="6" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="183" y="62" width="4" height="6" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="190" y="62" width="4" height="6" fill="none" stroke="#4ecdc4" strokeWidth="1" />

      {/* Right side buildings */}
      <rect x="210" y="55" width="28" height="85" fill="none" stroke="#4ecdc4" strokeWidth="1.5" rx="1" />
      <rect x="214" y="62" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="225" y="62" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="214" y="76" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="225" y="76" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />

      {/* House with roof */}
      <rect x="250" y="85" width="30" height="55" fill="none" stroke="#4ecdc4" strokeWidth="1.5" rx="1" />
      <polygon points="250,85 265,68 280,85" fill="none" stroke="#4ecdc4" strokeWidth="1.5" />
      <rect x="259" y="108" width="12" height="32" fill="none" stroke="#4ecdc4" strokeWidth="1" />

      {/* Far right tall building */}
      <rect x="290" y="42" width="22" height="98" fill="none" stroke="#4ecdc4" strokeWidth="1.5" rx="1" />
      <rect x="294" y="50" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="303" y="50" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="294" y="64" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="303" y="64" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="294" y="78" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="303" y="78" width="5" height="7" fill="none" stroke="#4ecdc4" strokeWidth="1" />

      <rect x="322" y="70" width="30" height="70" fill="none" stroke="#4ecdc4" strokeWidth="1.5" rx="1" />
      <rect x="326" y="78" width="6" height="8" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="338" y="78" width="6" height="8" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="326" y="94" width="6" height="8" fill="none" stroke="#4ecdc4" strokeWidth="1" />
      <rect x="338" y="94" width="6" height="8" fill="none" stroke="#4ecdc4" strokeWidth="1" />

      {/* Trees */}
      <circle cx="365" cy="115" r="10" fill="none" stroke="#4ecdc4" strokeWidth="1.5" />
      <line x1="365" y1="125" x2="365" y2="140" stroke="#4ecdc4" strokeWidth="1.5" />
      <circle cx="380" cy="120" r="8" fill="none" stroke="#4ecdc4" strokeWidth="1.5" />
      <line x1="380" y1="128" x2="380" y2="140" stroke="#4ecdc4" strokeWidth="1.5" />
    </svg>
  )
}

/* ────────────────────────────────────────────
   Minimal Underline Field Component
   ──────────────────────────────────────────── */
const labelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#555',
  marginBottom: 4,
  display: 'block',
}

const inputStyle: CSSProperties = {
  width: '100%',
  border: 'none',
  borderBottom: '2px solid #ccc',
  padding: '8px 0',
  fontSize: 14,
  background: 'transparent',
  color: '#333',
  outline: 'none',
  transition: 'border-color 0.2s',
}

function UnderlineField({ name, value, onChange, onBlur, label, error, required }: Readonly<FieldComponentProps>) {
  const isPassword = name.toLowerCase().includes('password')
  const isEmail = name === 'email'
  return (
    <div style={{ marginBottom: 8 }}>
      {label && (
        <label style={labelStyle} htmlFor={name}>
          {label}
          {required && <span style={{ color: '#e74c3c' }}> *</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={isPassword ? 'password' : isEmail ? 'email' : 'text'}
        value={typeof value === 'string' ? value : ''}
        onChange={onChange}
        onBlur={onBlur}
        style={{
          ...inputStyle,
          borderBottomColor: error ? '#e74c3c' : undefined,
        }}
        onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#4ecdc4' }}
      />
      {error && <span style={{ fontSize: 11, color: '#e74c3c', marginTop: 2, display: 'block' }}>{error}</span>}
    </div>
  )
}

/* ────────────────────────────────────────────
   Card Wrapper
   ──────────────────────────────────────────── */
function FormCard({ children, onClose }: Readonly<{ children: ReactNode; onClose?: () => void }>) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      maxWidth: 420,
      margin: '0 auto',
      padding: '32px 28px 24px',
      position: 'relative',
    }}>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none', fontSize: 20, color: '#999',
            cursor: 'pointer', lineHeight: 1,
          }}
          aria-label="Close"
        >
          ×
        </button>
      )}
      {children}
    </div>
  )
}

/* ────────────────────────────────────────────
   Form Config
   ──────────────────────────────────────────── */
const fields: FieldConfig[] = [
  { name: 'firstName', label: 'First Name', type: 'text', required: true, colSpan: 6, component: UnderlineField },
  { name: 'lastName', label: 'Last Name', type: 'text', required: true, colSpan: 6, component: UnderlineField },
  { name: 'username', label: 'Username', type: 'text', required: true, colSpan: 12, component: UnderlineField },
  { name: 'email', label: 'Email', type: 'email', required: true, colSpan: 12, component: UnderlineField },
  { name: 'phone', label: 'Ph. Number', type: 'text', colSpan: 12, component: UnderlineField },
  { name: 'password', label: 'Password', type: 'password', required: true, colSpan: 12, component: UnderlineField },
  { name: 'confirmPassword', label: 'Confirm Password', type: 'password', required: true, colSpan: 12, component: UnderlineField },
]

const initialValues = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

const SOURCE_CODE = `import {
  AxenForm, AxenFormRef, FieldComponentProps,
  FieldConfig, defaultComponentMap,
} from '@axenstudio/axen-form'

// ── Minimal Underline Field Component ──────────
function UnderlineField({
  name, value, onChange, onBlur, label,
  error, required,
}: FieldComponentProps) {
  const isPassword = name.toLowerCase().includes('password')
  return (
    <div style={{ marginBottom: 8 }}>
      <label style={{
        fontSize: 11, fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em', color: '#555',
      }}>
        {label}{required && <span style={{color:'#e74c3c'}}> *</span>}
      </label>
      <input
        name={name}
        type={isPassword ? 'password' : 'text'}
        value={typeof value === 'string' ? value : ''}
        onChange={onChange}
        onBlur={onBlur}
        style={{
          width: '100%', border: 'none',
          borderBottom: '2px solid #ccc',
          padding: '8px 0', fontSize: 14,
          background: 'transparent',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderBottomColor = '#4ecdc4'
        }}
      />
    </div>
  )
}

// ── Card Wrapper with Close + Illustration ─────
function FormCard({ children, onClose }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      maxWidth: 420, margin: '0 auto',
      padding: '32px 28px 24px',
      position: 'relative',
    }}>
      <button onClick={onClose} style={{
        position: 'absolute', top: 16, right: 16,
        background: 'none', border: 'none',
        fontSize: 20, color: '#999', cursor: 'pointer',
      }}>×</button>
      {children}
    </div>
  )
}

// ── Field Config ───────────────────────────────
const fields: FieldConfig[] = [
  { name: 'firstName', label: 'First Name',
    type: 'text', colSpan: 6,
    component: UnderlineField },
  { name: 'lastName', label: 'Last Name',
    type: 'text', colSpan: 6,
    component: UnderlineField },
  { name: 'username', label: 'Username',
    type: 'text', colSpan: 12,
    component: UnderlineField },
  { name: 'email', label: 'Email',
    type: 'email', colSpan: 12,
    component: UnderlineField },
  { name: 'phone', label: 'Ph. Number',
    type: 'text', colSpan: 12,
    component: UnderlineField },
  { name: 'password', label: 'Password',
    type: 'password', colSpan: 12,
    component: UnderlineField },
  { name: 'confirmPassword', label: 'Confirm Password',
    type: 'password', colSpan: 12,
    component: UnderlineField },
]

// ── Render ─────────────────────────────────────
function RegistrationForm() {
  const formRef = useRef<AxenFormRef>(null)
  return (
    <FormCard onClose={() => alert('Close clicked')}>
      <CityIllustration />
      <AxenForm
        ref={formRef}
        config={{ fields, initialValues }}
        components={defaultComponentMap}
        onSubmit={(values) => console.log(values)}
        gap="8px"
      />
      <button
        onClick={() => formRef.current?.submit()}
        style={{
          width: '60%', margin: '20px auto 0',
          display: 'block', padding: '12px 0',
          background: '#4ecdc4', color: '#fff',
          border: 'none', borderRadius: 24,
          fontSize: 14, fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}
      >SUBMIT</button>
    </FormCard>
  )
}`

export default function S13CustomRegistration() {
  const formRef = useRef<AxenFormRef>(null)
  const [result, setResult] = useState<unknown>()
  const [closed, setClosed] = useState(false)

  if (closed) {
    return (
      <ScenarioLayout
        title="Custom Registration Card"
        description="Full custom component demo inspired by modern card-style registration forms."
        result={result}
        sourceCode={SOURCE_CODE}
      >
        <div style={{ textAlign: 'center', padding: 48, color: '#999' }}>
          <p style={{ fontSize: 16 }}>Form closed.</p>
          <button className="btn btn-primary" onClick={() => setClosed(false)}>Reopen</button>
        </div>
      </ScenarioLayout>
    )
  }

  return (
    <ScenarioLayout
      title="Custom Registration Card"
      description="Full custom component demo inspired by modern card-style registration forms."
      result={result}
      sourceCode={SOURCE_CODE}
    >
      <FormCard onClose={() => setClosed(true)}>
        <CityIllustration />
        <div style={{ marginTop: 24 }}>
          <AxenForm
            ref={formRef}
            config={{ fields, initialValues }}
            components={defaultComponentMap}
            onSubmit={(values) => setResult(values)}
            gap="8px"
          />
        </div>
        <button
          onClick={() => formRef.current?.submit()}
          style={{
            width: '60%',
            margin: '20px auto 0',
            display: 'block',
            padding: '12px 0',
            background: '#4ecdc4',
            color: '#fff',
            border: 'none',
            borderRadius: 24,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#45b7aa' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#4ecdc4' }}
        >
          SUBMIT
        </button>
      </FormCard>
    </ScenarioLayout>
  )
}
