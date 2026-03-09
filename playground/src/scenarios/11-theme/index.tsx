/**
 * Scenario 11 — Theme System
 *
 * - Built-in theme presets: default (blue), subtle (gray), green
 * - Custom theme via CSS custom properties
 * - Dark / Light mode toggle (consumer-side override)
 * - Live theme switching
 */
import { AxenForm, AxenFormRef, defaultComponentMap, FieldConfig } from '@axenstudio/axen-form'
import { useRef, useState } from 'react'
import ScenarioLayout from '../../components/ScenarioLayout'

const fields: FieldConfig[] = [
  { name: 'fullName', label: 'Full Name', type: 'text', required: true, colSpan: 6 },
  { name: 'email', label: 'Email', type: 'email', required: true, colSpan: 6 },
  { name: 'phone', label: 'Phone', type: 'phone', colSpan: 6 },
  { name: 'age', label: 'Age', type: 'number', min: 0, max: 150, colSpan: 6 },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'editor', label: 'Editor' },
      { value: 'viewer', label: 'Viewer' },
    ],
    colSpan: 6,
  },
  { name: 'newsletter', label: 'Subscribe to newsletter', type: 'checkbox', colSpan: 6 },
  { name: 'bio', label: 'Bio', type: 'textarea', rows: 2, colSpan: 12 },
]

const initialValues = {
  fullName: '',
  email: '',
  phone: '',
  age: '',
  role: '',
  newsletter: false,
  bio: '',
}

const THEMES = [
  { value: 'default', label: 'Default (Blue)', color: '#1976d2' },
  { value: 'subtle', label: 'Subtle (Gray)', color: '#546e7a' },
  { value: 'green', label: 'Green', color: '#2e7d32' },
  { value: 'coral', label: 'Coral (Custom)', color: '#e74c3c' },
  { value: 'purple', label: 'Purple (Custom)', color: '#7b1fa2' },
]

const SOURCE_CODE = `import { AxenForm, defaultComponentMap } from '@axenstudio/axen-form'

// Built-in themes: 'default' | 'subtle' | 'green'
<AxenForm theme="subtle" config={config} components={defaultComponentMap} />

// Custom theme via CSS custom properties:
// [data-axen-theme='coral'] {
//   --axen-color-primary: #e74c3c;
//   --axen-color-primary-hover: #c0392b;
//   --axen-color-primary-light: #fde8e8;
//   --axen-color-input-bg: #fef5f5;
//   --axen-color-label: #c0392b;
// }

// ── Dark Mode (consumer-side) ──
// axen-form is light-only by default. To add dark mode,
// override CSS tokens on a wrapper element:
//
// .dark-mode [data-axen-theme] {
//   --axen-color-bg: #1e1e1e;
//   --axen-color-input-bg: #2a2a2a;
//   --axen-color-text: #e0e0e0;
//   --axen-color-label: #b0c4de;
//   --axen-color-border: #444;
//   --axen-color-text-secondary: #999;
//   --axen-color-text-disabled: #666;
//   --axen-color-bg-disabled: #333;
//   --axen-color-bg-hover: #333;
//   color-scheme: dark;
// }
//
// <div className={isDark ? 'dark-mode' : ''}>
//   <AxenForm theme="default" ... />
// </div>`

export default function S11Theme() {
  const formRef = useRef<AxenFormRef>(null)
  const [result, setResult] = useState<unknown>()
  const [theme, setTheme] = useState('default')
  const [isDark, setIsDark] = useState(false)

  return (
    <ScenarioLayout
      title="Theme System"
      description="Switch between built-in presets, custom themes, and dark/light mode."
      result={result}
      sourceCode={SOURCE_CODE}
    >
      {/* Custom theme + dark mode CSS */}
      <style>{`
        [data-axen-theme='coral'] {
          --axen-color-primary: #e74c3c;
          --axen-color-primary-hover: #c0392b;
          --axen-color-primary-light: #fde8e8;
          --axen-color-input-bg: #fef5f5;
          --axen-color-label: #c0392b;
        }
        [data-axen-theme='purple'] {
          --axen-color-primary: #7b1fa2;
          --axen-color-primary-hover: #6a1b9a;
          --axen-color-primary-light: #f3e5f5;
          --axen-color-input-bg: #faf5fc;
          --axen-color-label: #6a1b9a;
        }

        /* Dark mode overrides — applied on wrapper, cascades into [data-axen-theme] */
        .theme-dark-wrapper [data-axen-theme] {
          --axen-color-bg: #1e1e1e;
          --axen-color-input-bg: #2a2a2a;
          --axen-color-text: #e0e0e0;
          --axen-color-text-secondary: #999;
          --axen-color-text-disabled: #666;
          --axen-color-border: #444;
          --axen-color-border-hover: #666;
          --axen-color-bg-disabled: #333;
          --axen-color-bg-hover: #333;
          --axen-color-error: #ef5350;
          --axen-color-error-light: #3e2424;
          color-scheme: dark;
        }

        /* Per-theme dark label colors */
        .theme-dark-wrapper [data-axen-theme='default'] {
          --axen-color-label: #90caf9;
          --axen-color-primary-light: #1a3a5c;
          --axen-shadow-focus: 0 0 0 2px rgba(144, 202, 249, 0.4);
        }
        .theme-dark-wrapper [data-axen-theme='subtle'] {
          --axen-color-label: #b0bec5;
          --axen-color-primary-light: #37474f;
          --axen-shadow-focus: 0 0 0 2px rgba(176, 190, 197, 0.4);
        }
        .theme-dark-wrapper [data-axen-theme='green'] {
          --axen-color-label: #81c784;
          --axen-color-primary-light: #1b3d1e;
          --axen-shadow-focus: 0 0 0 2px rgba(129, 199, 132, 0.4);
        }
        .theme-dark-wrapper [data-axen-theme='coral'] {
          --axen-color-label: #ef9a9a;
          --axen-color-primary-light: #3e2424;
          --axen-shadow-focus: 0 0 0 2px rgba(239, 154, 154, 0.4);
        }
        .theme-dark-wrapper [data-axen-theme='purple'] {
          --axen-color-label: #ce93d8;
          --axen-color-primary-light: #3a1a4a;
          --axen-shadow-focus: 0 0 0 2px rgba(206, 147, 216, 0.4);
        }

        /* Dark wrapper background for visual contrast */
        .theme-dark-wrapper {
          background: #1e1e1e;
          border-radius: 8px;
          padding: 16px;
          transition: background 0.2s;
        }
        .theme-light-wrapper {
          background: transparent;
          border-radius: 8px;
          padding: 16px;
          transition: background 0.2s;
        }
      `}</style>

      {/* Controls row: theme picker + dark/light toggle */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>
            Theme Preset
          </label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {THEMES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTheme(t.value)}
                style={{
                  padding: '6px 14px',
                  fontSize: 13,
                  fontWeight: theme === t.value ? 700 : 500,
                  borderRadius: 6,
                  border: theme === t.value ? `2px solid ${t.color}` : '1px solid #ccc',
                  background: theme === t.value ? `${t.color}15` : '#fff',
                  color: theme === t.value ? t.color : '#555',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: t.color,
                    display: 'inline-block',
                  }}
                />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>
            Mode
          </label>
          <div style={{ display: 'flex', gap: 0, borderRadius: 6, overflow: 'hidden', border: '1px solid #ccc' }}>
            <button
              type="button"
              onClick={() => setIsDark(false)}
              style={{
                padding: '6px 16px',
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: !isDark ? '#fff3e0' : '#fff',
                color: !isDark ? '#e65100' : '#888',
              }}
            >
              ☀️ Light
            </button>
            <button
              type="button"
              onClick={() => setIsDark(true)}
              style={{
                padding: '6px 16px',
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                borderLeft: '1px solid #ccc',
                cursor: 'pointer',
                background: isDark ? '#263238' : '#fff',
                color: isDark ? '#90caf9' : '#888',
              }}
            >
              🌙 Dark
            </button>
          </div>
        </div>
      </div>

      {/* Form inside dark/light wrapper */}
      <div className={isDark ? 'theme-dark-wrapper' : 'theme-light-wrapper'}>
        <AxenForm
          ref={formRef}
          config={{ fields, initialValues }}
          components={defaultComponentMap}
          theme={theme}
          onSubmit={(values) => setResult({ ...values, _appliedTheme: theme, _darkMode: isDark })}
          gap="12px"
        />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button className="btn btn-primary" onClick={() => formRef.current?.submit()}>
          Submit
        </button>
        <button className="btn btn-outline" onClick={() => { formRef.current?.resetForm(); setResult(undefined) }}>
          Reset
        </button>
      </div>

      <div className="info-box" style={{ marginTop: 16 }}>
        <strong>Dark Mode:</strong> axen-form is light-only by default. Dark mode is implemented
        by overriding CSS custom properties (<code>--axen-color-*</code>) on a wrapper element.
        This gives consumers full control over dark mode colors per theme.
      </div>
    </ScenarioLayout>
  )
}
