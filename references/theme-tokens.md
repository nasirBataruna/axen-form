# AxenForm — Theme System & CSS Design Tokens

> All token names verified from `@axenstudio/axen-form` package source.

## Built-in Theme Presets

Pass via `theme` prop on `<AxenForm>`. Only these three are built-in:

| Theme value | Primary Color | Description |
|---|---|---|
| `default` | `#1976d2` (blue) | Standard business forms |
| `subtle` | `#546e7a` (gray) | Low-contrast, form-heavy UIs |
| `green` | `#2e7d32` (green) | Nature/eco themed apps |

```tsx
<AxenForm theme="default" config={config} components={defaultComponentMap} onSubmit={...} />
<AxenForm theme="subtle"  config={config} components={defaultComponentMap} onSubmit={...} />
<AxenForm theme="green"   config={config} components={defaultComponentMap} onSubmit={...} />
```

---

## Custom Theme

Define a CSS rule targeting `[data-axen-theme='your-name']` and pass the name to `theme` prop.
AxenForm injects `data-axen-theme="your-name"` on its container — your CSS rule applies automatically.

```css
/* In your global CSS or <style> block */
[data-axen-theme='brand'] {
  --axen-color-primary: #e74c3c;
  --axen-color-primary-hover: #c0392b;
  --axen-color-primary-light: #fde8e8;
  --axen-color-input-bg: #fef5f5;
  --axen-color-label: #c0392b;
}
```

```tsx
<AxenForm theme="brand" config={config} components={defaultComponentMap} onSubmit={...} />
```

---

## Dark Mode Override

AxenForm is light-only by default. To add dark mode, add a wrapper class and override tokens:

```css
/* In your global CSS — targets any axen-form inside .dark-mode wrapper */
.dark-mode [data-axen-theme] {
  --axen-color-bg: #1e1e1e;
  --axen-color-input-bg: #2a2a2a;
  --axen-color-text: #e0e0e0;
  --axen-color-text-secondary: #999;
  --axen-color-text-disabled: #666;
  --axen-color-label: #b0c4de;
  --axen-color-border: #444;
  --axen-color-border-hover: #666;
  --axen-color-bg-disabled: #333;
  --axen-color-bg-hover: #333;
  --axen-color-error: #ef5350;
  --axen-color-error-light: #3e2424;
  color-scheme: dark;
}

/* Per-theme label/focus adjustments */
.dark-mode [data-axen-theme='default'] {
  --axen-color-label: #90caf9;
  --axen-color-primary-light: #1a3a5c;
}
.dark-mode [data-axen-theme='subtle'] {
  --axen-color-label: #b0bec5;
  --axen-color-primary-light: #37474f;
}
.dark-mode [data-axen-theme='green'] {
  --axen-color-label: #81c784;
  --axen-color-primary-light: #1b3d1e;
}
```

```tsx
<div className={isDark ? 'dark-mode' : ''}>
  <AxenForm theme="default" config={config} components={defaultComponentMap} onSubmit={...} />
</div>
```

---

## Complete CSS Token Reference

### Color Tokens

| Token | Default (light) | Purpose |
|---|---|---|
| `--axen-color-primary` | `#1976d2` | Primary action color (buttons, focus ring, active border) |
| `--axen-color-primary-hover` | `#1565c0` | Hover state of primary |
| `--axen-color-primary-light` | `#e3f2fd` | Tinted background on focus/active states |
| `--axen-color-bg` | `#ffffff` | Page/form background |
| `--axen-color-input-bg` | `#f0f7ff` | Input field background (blue-tinted in default theme) |
| `--axen-color-bg-hover` | `#fafafa` | Hover background for interactive elements |
| `--axen-color-bg-disabled` | `#f5f5f5` | Disabled field background |
| `--axen-color-text` | `#1a1a1a` | Primary text (values, body) |
| `--axen-color-text-secondary` | `#666666` | Helper text, placeholder |
| `--axen-color-text-disabled` | `#9e9e9e` | Disabled field text |
| `--axen-color-label` | `#1565c0` | Field label color (varies per theme) |
| `--axen-color-border` | `#d0d5dd` | Input idle border |
| `--axen-color-border-hover` | `#888888` | Input border on hover |
| `--axen-color-border-focus` | `var(--axen-color-primary)` | Input border on focus |
| `--axen-color-error` | `#d32f2f` | Error state color |
| `--axen-color-error-light` | `#fdecea` | Error background tint |
| `--axen-color-success` | `#2e7d32` | Success state color |
| `--axen-color-warning` | `#ed6c02` | Warning state color |

### Border & Shape Tokens

| Token | Default | Purpose |
|---|---|---|
| `--axen-border-width` | `1px` | Input border width |
| `--axen-border-radius` | `8px` | Standard corner radius |
| `--axen-border-radius-sm` | `4px` | Small radius (checkboxes, etc.) |
| `--axen-border-radius-lg` | `10px` | Large radius (cards, dropdowns) |
| `--axen-border-radius-pill` | `9999px` | Fully rounded (pill buttons) |

### Field Dimension Tokens

| Token | Default | Purpose |
|---|---|---|
| `--axen-field-min-height` | `44px` | Minimum input height |
| `--axen-field-height` | `2.75rem` | Target input height |
| `--axen-field-padding-x` | `0.75rem` | Input horizontal padding |
| `--axen-field-padding-y` | `0.5rem` | Input vertical padding |
| `--axen-label-margin-bottom` | `0.375rem` | Gap between label and input |
| `--axen-helper-margin-top` | `0.25rem` | Gap between input and helper text |

### Typography Tokens

| Token | Default | Purpose |
|---|---|---|
| `--axen-font-family` | `inherit` | Font family for all form elements |
| `--axen-font-size-xs` | `0.75rem` | Helper/error text |
| `--axen-font-size-sm` | `0.875rem` | Labels |
| `--axen-font-size-md` | `1rem` | Input value text |
| `--axen-font-size-lg` | `1.125rem` | Large headings |
| `--axen-font-weight-normal` | `400` | Regular weight |
| `--axen-font-weight-medium` | `500` | Medium weight (labels) |
| `--axen-font-weight-bold` | `600` | Bold weight |
| `--axen-line-height` | `1.5` | Default line height |

### Spacing Tokens

| Token | Default | Purpose |
|---|---|---|
| `--axen-space-xs` | `0.25rem` | Tiny gaps |
| `--axen-space-sm` | `0.5rem` | Small gaps |
| `--axen-space-md` | `1rem` | Medium gaps |
| `--axen-space-lg` | `1.5rem` | Large gaps |
| `--axen-space-xl` | `2rem` | Extra large gaps |

### Focus & Shadow Tokens

| Token | Default | Purpose |
|---|---|---|
| `--axen-focus-ring-width` | `2px` | Focus ring thickness |
| `--axen-focus-ring-offset` | `2px` | Focus ring offset from element |
| `--axen-focus-ring-color` | `rgba(25, 118, 210, 0.5)` | Focus ring color |
| `--axen-shadow-focus` | `0 0 0 2px rgba(25,118,210,0.5)` | Focus box-shadow |
| `--axen-shadow-sm` | `0 1px 3px rgba(0,0,0,0.08)` | Subtle elevation shadow |

### Interaction Tokens

| Token | Default | Purpose |
|---|---|---|
| `--axen-transition-fast` | `150ms ease` | Fast micro-interactions |
| `--axen-transition-normal` | `200ms ease` | Standard transitions |
| `--axen-z-dropdown` | `100` | z-index for dropdown layers |
| `--axen-z-tooltip` | `200` | z-index for tooltip layers |

### Breakpoint Tokens (read-only, used internally)

| Token | Value | Purpose |
|---|---|---|
| `--axen-bp-sm` | `600px` | Small breakpoint |
| `--axen-bp-md` | `900px` | Medium breakpoint |
| `--axen-bp-lg` | `1200px` | Large breakpoint |
| `--axen-bp-xl` | `1536px` | Extra large breakpoint |

---

## Per-Theme Default Values

| Token | `default` | `subtle` | `green` |
|---|---|---|---|
| `--axen-color-primary` | `#1976d2` | `#546e7a` | `#2e7d32` |
| `--axen-color-primary-hover` | `#1565c0` | `#37474f` | `#1b5e20` |
| `--axen-color-primary-light` | `#e3f2fd` | `#eceff1` | `#e8f5e9` |
| `--axen-color-label` | `#1565c0` | `#37474f` | `#1b5e20` |
| `--axen-color-input-bg` | `#f0f7ff` | `#f5f5f5` | `#f1f8e9` |
