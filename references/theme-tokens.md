# AxenForm — Theme System & CSS Design Tokens

## Built-in Theme Presets

Pass via `theme` prop on `<AxenForm>`:

```tsx
<AxenForm theme="default"  ... />  // Default: subtle borders, standard focus ring
<AxenForm theme="subtle"   ... />  // Low-contrast, minimal borders
<AxenForm theme="outlined" ... />  // Prominent outlined inputs
<AxenForm theme="filled"   ... />  // Background-filled inputs
```

Default when `theme` is omitted: `"default"`.

---

## CSS Design Tokens

AxenForm injects a CSS module with these custom properties on the `[data-axen-theme]` attribute. Override them by setting values on a parent element.

### Color Tokens

| Token | Default (light) | Purpose |
|---|---|---|
| `--axen-color-primary` | `#1976d2` | Primary action color (focus ring, active border) |
| `--axen-color-primary-hover` | `#1565c0` | Hover state of primary color |
| `--axen-color-primary-light` | `#e3f2fd` | Light tint for hover backgrounds |
| `--axen-color-primary-rgb` | `25, 118, 210` | RGB values for `rgba()` usage |
| `--axen-error` | `#d32f2f` | Error state color (borders, messages) |
| `--axen-warning` | `#f57c00` | Warning state color |
| `--axen-success` | `#388e3c` | Success state color |

### Background Tokens

| Token | Default (light) | Purpose |
|---|---|---|
| `--axen-bg` | `#ffffff` | Field input background |
| `--axen-bg-secondary` | `#f5f5f5` | Secondary/hover background |
| `--axen-bg-disabled` | `#fafafa` | Disabled field background |
| `--axen-surface` | `#ffffff` | Card/surface background |

### Text Tokens

| Token | Default (light) | Purpose |
|---|---|---|
| `--axen-text-primary` | `#212121` | Primary text (labels, values) |
| `--axen-text-secondary` | `#757575` | Helper text, placeholder color |
| `--axen-text-disabled` | `#bdbdbd` | Disabled field text |
| `--axen-text-on-primary` | `#ffffff` | Text on primary-colored backgrounds |

### Border & Shape Tokens

| Token | Default | Purpose |
|---|---|---|
| `--axen-border-color` | `#e0e0e0` | Input border color (idle) |
| `--axen-border-color-hover` | `#9e9e9e` | Input border color on hover |
| `--axen-border-radius` | `4px` | Input corner radius |
| `--axen-border-radius-lg` | `8px` | Larger radius (cards, dropdowns) |

### Typography Tokens

| Token | Default | Purpose |
|---|---|---|
| `--axen-font-family` | `inherit` | Font family for all form elements |
| `--axen-font-size-xs` | `0.75rem` | Helper text, error messages |
| `--axen-font-size-sm` | `0.875rem` | Label text |
| `--axen-font-size-base` | `1rem` | Input value text |
| `--axen-font-weight-label` | `500` | Font weight for field labels |

### Spacing & Size Tokens

| Token | Default | Purpose |
|---|---|---|
| `--axen-spacing-xs` | `4px` | Tiny gaps (icon padding) |
| `--axen-spacing-sm` | `8px` | Field inner padding |
| `--axen-spacing-md` | `16px` | Between-field spacing |
| `--axen-spacing-lg` | `24px` | Section spacing |
| `--axen-input-height` | `40px` | Standard input height |
| `--axen-input-height-sm` | `32px` | Compact input height |

---

## Custom Theme via `style` Prop (Inline Scope)

Override tokens scoped to a single form instance:

```tsx
<AxenForm
  theme="outlined"
  style={{
    '--axen-color-primary': '#7c3aed',        // purple brand
    '--axen-color-primary-hover': '#6d28d9',
    '--axen-color-primary-light': '#ede9fe',
    '--axen-border-radius': '8px',
    '--axen-input-height': '44px',
  } as React.CSSProperties}
  config={{ fields, initialValues }}
  components={defaultComponentMap}
  onSubmit={handleSubmit}
/>
```

---

## Custom Theme via Parent CSS (Page/Component Scope)

Wrap the form in a `div` and define variables on it:

```tsx
<div className="my-custom-theme">
  <AxenForm theme="default" config={...} components={defaultComponentMap} onSubmit={...} />
</div>
```

```css
.my-custom-theme [data-axen-theme] {
  --axen-color-primary: #0d9488;        /* teal brand */
  --axen-color-primary-hover: #0f766e;
  --axen-color-primary-light: #ccfbf1;
  --axen-bg: #f0fdf4;
  --axen-border-color: #a7f3d0;
  --axen-border-radius: '12px';
  --axen-font-family: 'Inter', sans-serif;
}
```

---

## Dark Mode Override

Apply dark mode by adding a class to a parent element. AxenForm responds to `[data-axen-theme]` inside the classed parent:

```css
/* In your global CSS */
.dark-mode [data-axen-theme] {
  --axen-color-primary: #90caf9;
  --axen-color-primary-hover: #64b5f6;
  --axen-color-primary-light: #0d2137;
  --axen-bg: #1e1e1e;
  --axen-bg-secondary: #2a2a2a;
  --axen-bg-disabled: #333333;
  --axen-surface: #252525;
  --axen-text-primary: #e0e0e0;
  --axen-text-secondary: #9e9e9e;
  --axen-text-disabled: #616161;
  --axen-border-color: #444444;
  --axen-border-color-hover: #616161;
  --axen-error: #ef9a9a;
}
```

Toggle dark mode by toggling the class on a parent element:

```tsx
<div className={isDark ? 'dark-mode' : ''}>
  <AxenForm theme="default" ... />
</div>
```

---

## Theme Application Order (Specificity)

Styles are applied in this precedence (lowest → highest wins):

1. AxenForm package default tokens (injected at runtime)
2. Parent CSS class targeting `[data-axen-theme]`
3. `style` prop on `<AxenForm>` (inline, highest specificity)

---

## Per-Field Sizing (not via tokens)

Grid layout and field spacing is controlled via:

- `gap` prop on `<AxenForm>`: CSS gap string (`'12px'`, `'1rem 2rem'`)
- `colSpan` on `FieldConfig`: `1`–`12` grid columns, or responsive object `{ xs: 12, md: 6 }`

These are not CSS tokens — they are computed styles injected by the layout engine.
