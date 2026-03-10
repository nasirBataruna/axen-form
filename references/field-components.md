# AxenForm — Built-in Field Components Reference

All 19 built-in field types. Pass via `type` in `FieldConfig`.

## Text Inputs

| type | Component behavior | Notes |
|---|---|---|
| `text` | Standard single-line text input | |
| `email` | Text input with email keyboard hint | Browser validates format |
| `password` | Text input with show/hide toggle | |
| `tel` | Text input with tel keyboard hint | |
| `textarea` | Multi-line text area | `rows?: number` (default: 3) |

**Initial value:** `''` (empty string)

## Numeric

| type | Component behavior | Notes |
|---|---|---|
| `number` | Numeric input with increment/decrement | `min`, `max`, `step` supported |
| `slider` | Range slider | `min`, `max`, `step`, `marks` supported |
| `rating` | Star rating (1–5) | None; uses `number` value internally |

**Initial value:**
- `number`: `''` or `0`
- `slider`: `50` (numeric, not string)
- `rating`: `0`

## Date & Time

| type | Component behavior | Notes |
|---|---|---|
| `date` | Date picker | Value: ISO date string `'YYYY-MM-DD'` |
| `time` | Time picker | Value: `'HH:MM'` |
| `datetime-local` | Date + time combined | Value: `'YYYY-MM-DDTHH:MM'` |

**Initial value:** `''`

## Selection

| type | Component behavior | Notes |
|---|---|---|
| `select` | Dropdown select | Requires `options: FieldOption[]` |
| `radio` | Radio group | Requires `options: FieldOption[]` |
| `checkbox` | Single boolean checkbox | No `options`; value is `true`/`false` |
| `checkbox-group` | Multi-checkbox from options list | Requires `options`; value is `string[]` |
| `switch` | Toggle switch | No `options`; value is `true`/`false` |

**Initial values:**
- `select`: `''`
- `radio`: `''`
- `checkbox`: `false`
- `checkbox-group`: `[]`
- `switch`: `false`

## Other

| type | Component behavior | Notes |
|---|---|---|
| `color` | Color picker (native HTML) | Value: hex string `'#rrggbb'` |
| `file` | File upload input | Value: `File` object or `null` |

**Initial value:**
- `color`: `'#000000'`
- `file`: `null`

## Autocomplete Variants

### `autocomplete`

Full-text search with dropdown suggestions. Supports static and server-side options.

```tsx
// Static
{ name: 'role', type: 'autocomplete',
  options: [{ value: 'admin', label: 'Admin' }, { value: 'user', label: 'User' }] }

// Server-side
{ name: 'assignee', type: 'autocomplete',
  fetchOptions: async (query: string, signal: AbortSignal) => {
    const res = await fetch(`/api/users?q=${query}`, { signal })
    return res.json()  // must return { value: string, label: string }[]
  },
  optionLabel: 'name',    // if API returns { id, name } — use name as label
  optionValue: 'id',      // use id as value
  debounce: 300,          // ms (default)
}
```

- Value: `string` (the selected `value` from FieldOption)
- Initial value: `''`

### `autocomplete-predict`

Inline ghost-text prediction. Press Tab to accept. Static options only.

```tsx
{ name: 'language', type: 'autocomplete-predict',
  options: [
    { value: 'typescript', label: 'TypeScript' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
  ] }
```

- Value: `string`
- Initial value: `''`
- Does NOT support `fetchOptions`

### `autocomplete-multi`

Multi-select with chip display. Supports static and server-side options.

```tsx
{ name: 'tags', type: 'autocomplete-multi',
  fetchOptions: async (q, signal) => api.searchTags(q, signal),
  options: [...],  // or static
}
```

- Value: `string[]` (array of selected values)
- Initial value: `[]` (empty array, NOT `''`)
- Displayed as removable chips

---

## Type-Specific Props Summary

| Prop | Applicable types | Description |
|---|---|---|
| `options` | `select`, `radio`, `checkbox-group`, `autocomplete`, `autocomplete-predict`, `autocomplete-multi` | Static option list |
| `fetchOptions` | `autocomplete`, `autocomplete-multi` | Async option fetcher; receives `(query, signal)` |
| `optionLabel` | `autocomplete`, `autocomplete-multi` | Key in option object to use as label |
| `optionValue` | `autocomplete`, `autocomplete-multi` | Key in option object to use as value |
| `debounce` | `autocomplete`, `autocomplete-multi` | Debounce delay for `fetchOptions` in ms |
| `rows` | `textarea` | Number of visible text rows |
| `min` | `number`, `slider` | Minimum value |
| `max` | `number`, `slider` | Maximum value |
| `step` | `number`, `slider` | Increment step |
| `marks` | `slider` | Tick marks along track — `true` or `Mark[]` |

---

## Initial Value Guide

Set these in `config.initialValues` to avoid uncontrolled→controlled warnings:

```ts
const initialValues = {
  // Text inputs
  name:          '',      // text, email, password, tel
  description:   '',      // textarea
  website:       '',      // text

  // Numeric
  quantity:      '',      // number — '' or 0
  volume:        50,      // slider — number (not '')
  stars:         0,       // rating

  // Date/time
  birthday:      '',      // date
  startTime:     '',      // time
  scheduledAt:   '',      // datetime-local

  // Selection
  status:        '',      // select
  gender:        '',      // radio
  agreeTerms:    false,   // checkbox
  preferences:   [],      // checkbox-group — MUST be []
  notifications: false,   // switch

  // Other
  themeColor:    '#000000',  // color
  avatar:        null,       // file

  // Autocomplete
  assignee:      '',         // autocomplete — single string
  tags:          [],         // autocomplete-multi — MUST be []
  keyword:       '',         // autocomplete-predict
}
```
