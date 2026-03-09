import { Component, type ErrorInfo, type ReactNode, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'

import S01Basic from './scenarios/01-basic'
import S02AllFields from './scenarios/02-all-fields'
import S03aLayout from './scenarios/03a-layout'
import S03bFieldGroups from './scenarios/03b-field-groups'
import S04Validation from './scenarios/04-validation'
import S05Conditional from './scenarios/05-conditional'
import S06ArrayFields from './scenarios/06-array-fields'
import S07RefControl from './scenarios/07-ref-control'
import S08PayloadMap from './scenarios/08-payload-map'
import S09FormContext from './scenarios/09-form-context'
import S10CustomComponent from './scenarios/10-custom-component'
import S11Theme from './scenarios/11-theme'
import S12CustomRegistration from './scenarios/12-custom-registration'
import S13StepperForm from './scenarios/13-stepper-form'
import S14StepperComplex from './scenarios/14-stepper-complex'

const SCENARIOS = [
  { path: '/01-basic', label: '01 · Basic Form', level: 'Basic', component: S01Basic },
  { path: '/02-all-fields', label: '02 · All 19 Field Types', level: 'Basic', component: S02AllFields },
  { path: '/03a-layout', label: '03a · Layout System', level: 'Intermediate', component: S03aLayout },
  { path: '/03b-field-groups', label: '03b · Field Groups', level: 'Intermediate', component: S03bFieldGroups },
  { path: '/04-validation', label: '04 · Yup / Zod Validation', level: 'Intermediate', component: S04Validation },
  { path: '/05-conditional', label: '05 · Conditional Hidden', level: 'Intermediate', component: S05Conditional },
  { path: '/06-array-fields', label: '06 · Array Fields', level: 'Advanced', component: S06ArrayFields },
  { path: '/07-ref-control', label: '07 · Ref Control', level: 'Advanced', component: S07RefControl },
  { path: '/08-payload-map', label: '08 · Payload Mapping', level: 'Advanced', component: S08PayloadMap },
  { path: '/09-form-context', label: '09 · Form Context', level: 'Expert', component: S09FormContext },
  { path: '/10-custom-component', label: '10 · Custom Component', level: 'Expert', component: S10CustomComponent },
  { path: '/11-theme', label: '11 · Theme System', level: 'Expert', component: S11Theme },
  { path: '/12-custom-registration', label: '12 · Custom Registration', level: 'Expert', component: S12CustomRegistration },
  { path: '/13-stepper-form', label: '13 · Stepper Form', level: 'Advanced', component: S13StepperForm },
  { path: '/14-stepper-complex', label: '14 · Stepper Complex', level: 'Expert', component: S14StepperComplex },
]

const BADGE_CLASS: Record<string, string> = {
  Basic: 'badge badge-basic',
  Intermediate: 'badge badge-intermediate',
  Advanced: 'badge badge-advanced',
  Expert: 'badge badge-expert',
}

const BP_WIDTHS: Record<string, string> = {
  xs: '375px',
  sm: '600px',
  md: '900px',
  lg: '1200px',
  full: '100%',
}

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Scenario error:', error, info) }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, color: '#c62828' }}>
          <h3>Something went wrong</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13 }}>{this.state.error.message}</pre>
          <button className="btn btn-outline" onClick={() => this.setState({ error: null })}>Retry</button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  const { pathname } = useLocation()
  const [breakpoint, setBreakpoint] = useState('full')

  return (
    <>
      <nav className="sidebar">
        <h2>AxenForm Playground</h2>
        <p className="subtitle">15 scenarios · Basic → Expert</p>
        <hr />

        {['Basic', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
          <div key={level}>
            <div className="group-label">{level}</div>
            {SCENARIOS.filter((s) => s.level === level).map((s) => (
              <Link
                key={s.path}
                to={s.path}
                className={pathname === s.path ? 'active' : ''}
              >
                {s.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <div className="landing">
                <h1>AxenForm Playground</h1>
                <p>Zero-dependency, config-driven React forms. Pick a scenario from the sidebar.</p>
                <div className="badges">
                  {['Basic', 'Intermediate', 'Advanced', 'Expert'].map((l) => (
                    <span key={l} className={BADGE_CLASS[l]}>{l}</span>
                  ))}
                </div>
              </div>
            }
          />
          {SCENARIOS.map(({ path, component: Component, level, label }) => (
            <Route
              key={path}
              path={path}
              element={
                <div
                  className={breakpoint !== 'full' ? 'bp-active' : ''}
                  style={{ '--bp-max-width': BP_WIDTHS[breakpoint] } as React.CSSProperties}
                >
                  <div className="scenario-header">
                    <h1>{label}</h1>
                    <span className={BADGE_CLASS[level]}>{level}</span>
                    <div className="bp-controls">
                      {Object.keys(BP_WIDTHS).map((bp) => (
                        <button
                          key={bp}
                          className={`bp-btn ${breakpoint === bp ? 'active' : ''}`}
                          onClick={() => setBreakpoint(bp)}
                        >
                          {bp}
                        </button>
                      ))}
                    </div>
                  </div>
                  <ErrorBoundary>
                    <Component />
                  </ErrorBoundary>
                </div>
              }
            />
          ))}
        </Routes>
      </main>
    </>
  )
}
