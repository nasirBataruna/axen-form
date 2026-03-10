# axen-form Skill Authoring Project

> 🔗 **Playground Demo:** https://stackblitz.com/~/github.com/nasirBataruna/axen-form-playground  
> 📦 **Source Repository:** https://github.com/nasirBataruna/axen-form-playground.git


Comprehensive skill-authoring workspace for `@axenstudio/axen-form`, including:
- Skill definition (`SKILL.md`) for AI-assisted guidance.
- Metadata for agent discovery (`agents/openai.yaml`).
- Interactive React playground hosted at [axen-form-playground](https://github.com/nasirBataruna/axen-form-playground) (StackBlitz-ready).

## What This Repository Is For

This repository is designed to maintain and evolve a skill that helps users work with Axen Form effectively.

Primary goals:
- Document practical usage patterns of `@axenstudio/axen-form`.
- Provide runnable examples for common and advanced form scenarios.
- Keep skill instructions, metadata, and demo code in sync.

## Repository Layout

```text
.
|- SKILL.md                     # Main skill spec and guidance
|- agents/
|  |- openai.yaml               # Skill metadata for agent registration
|- references/                  # Deep-dive docs
|- axen-form-playground/        # Vite + React demo app (gitignored, separate repo)
|- README.md
|- LICENSE
```

## Tech Stack

- React 19
- TypeScript
- Vite
- `@axenstudio/axen-form` (core form engine)
- `yup` and `zod` (validation examples)

## Prerequisites

- Node.js 20+ recommended
- `pnpm` (lockfile is `pnpm-lock.yaml`)

## Quick Start (Playground)

The playground lives in its own repo. Clone it separately:

```bash
git clone https://github.com/nasirBataruna/axen-form-playground.git
cd axen-form-playground
pnpm install
pnpm dev
```

Or open it instantly via StackBlitz (no local setup needed):

> https://stackblitz.com/~/github.com/nasirBataruna/axen-form-playground

## Playground Scenario Catalog

Each scenario demonstrates one focused capability:

- `01-basic`: minimal form setup.
- `02-all-fields`: showcase of available field types.
- `03a-layout`: grid/layout composition.
- `03b-field-groups`: grouped/sectioned fields.
- `04-validation`: Yup/Zod and validation flow.
- `05-conditional`: conditional rendering with `hidden` logic.
- `06-array-fields`: repeatable list fields.
- `07-ref-control`: imperative API via form ref.
- `08-payload-map`: payload field mapping strategies.
- `09-form-context`: context-driven form behavior.
- `10-custom-component`: custom field component integration.
- `11-theme`: built-in and custom theming.
- `12-custom-registration`: custom component registration.
- `13-stepper-form`: multi-step form basics.
- `14-stepper-complex`: advanced stepper orchestration.

## Typical Contributor Workflow

1. Update behavior/docs in `SKILL.md` when guidance changes.
2. Add or refine runnable examples in `axen-form-playground/src/scenarios/`.
3. Ensure scenario navigation and labels are updated in the app shell.
4. Build the playground to verify type and bundle health:

```bash
cd axen-form-playground
pnpm build
```

## Writing New Scenarios

Recommended pattern:

1. Create a new folder under `axen-form-playground/src/scenarios/`.
2. Export a scenario component from `index.tsx`.
3. Add it to the scenario registry/router used by `App.tsx`.
4. Keep the scenario focused on one concept and provide realistic initial values.

## Skill Maintenance Notes

- Keep `SKILL.md` concise at top level; move deep technical details into `references/` as needed.
- Keep metadata in `agents/openai.yaml` aligned with current skill intent.
- Prefer updating both docs and scenario code in the same change so guidance stays verifiable.

## Versioning and Dependencies

- Playground repo: [axen-form-playground](https://github.com/nasirBataruna/axen-form-playground)
- Current dependency target: `@axenstudio/axen-form@^0.1.16`

When upgrading core package versions, re-test all scenarios, especially:
- Validation adapter behavior (`04-validation`)
- Custom component registration (`10` and `12`)
- Stepper flows (`13` and `14`)

## License

See `LICENSE`.
