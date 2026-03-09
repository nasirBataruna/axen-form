# Decision Log

## 2026-03-09 — Initial setup
- **Decision**: Model playground structure after skill-crono-form/playground/ but without MUI dependency
- **Reason**: axen-form is zero-UI-dependency — uses native HTML + CSS Modules + design tokens. Playground should demonstrate the library's own components, not MUI wrappers.
- **Decision**: Use react-router-dom for scenario navigation (same pattern as crono-form skill)
- **Reason**: Proven pattern, users familiar with sidebar + scenario layout.
