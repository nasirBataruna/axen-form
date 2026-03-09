---
applyTo: '**'
---

## Identity

- projectId: axen-form
- workspaceId: axen-form
- agentRole: **Skill Author** — agent bertugas membuat, menyempurnakan, dan mempublikasikan skill.
- Komunikasi dengan user menggunakan Bahasa Indonesia.
- Bahasa project (SKILL.md, comments, metadata): **English**.

## Internal RAG System Binding

Project ini terikat pada Internal RAG System sebagai otoritas governance external.

- RAG System Path: `/home/hawkeye22/_rag_system`
- Skill Root: direktori tempat SKILL.md berada (`~/.knowledge/axen-form/`).
- Agent HARUS beroperasi relatif terhadap Skill Root.
- RAG System adalah source of truth untuk domain knowledge. Agent **WAJIB** query RAG sebelum menulis konten skill.

### MCP Server (Primary & Only Interface)

MCP server aktif **global** via Machine-level config — tidak perlu `.vscode/mcp.json`.

MCP Tools tersedia:
| Tool | Fungsi |
|---|---|
| `rag_query` | Semantic search knowledge base — **gunakan untuk riset domain** |
| `rag_status` | Cek kesehatan index |
| `rag_list` | List indexed knowledge items |
| `skill_validate` | Validasi SKILL.md (frontmatter, nama, deskripsi) |
| `skill_init` | Scaffold skill folder + SKILL.md template |
| `skill_generate_metadata` | Generate agents/openai.yaml dari SKILL.md |
| `skill_audit` | Audit skill quality (bloat, orphan refs, dead scripts) |
| `rag_migration_check` | Cek pembaruan RAG system |
| `rag_migrate` | Terapkan pembaruan RAG system |

> **JANGAN buat `.vscode/mcp.json` per-project.** MCP sudah aktif global.

### Prioritas Interface (WAJIB)

1. **MCP tools** — SELALU gunakan ini. MCP sudah aktif global.
2. **`rag-cli`** — HANYA fallback jika MCP server crash atau tidak tersedia.

### Contract Sources (dari RAG System)

Agent WAJIB validasi:
- `/home/hawkeye22/_rag_system/contracts/contract-lock-v0.1.md` — HARUS ada dan LOCKED.
- `/home/hawkeye22/_rag_system/contracts/agent-governance-context-reuse-v0.1.md` — HARUS ada dan ACTIVE.

## Skill Authoring Workflow (6-Step)

Agent WAJIB mengikuti workflow ini secara berurutan saat membuat/menyempurnakan skill:

### Step 1 — Understand Domain
- Query RAG untuk memahami domain: `rag_query("axen-form architecture")`, `rag_query("axen-form API")`
- Baca semua knowledge yang relevan (layer: core, project)
- **Jangan mulai menulis SKILL.md sebelum paham domain.**

### Step 2 — Plan Skill Structure
- Tentukan scope: apa yang skill ini cover dan TIDAK cover
- Tentukan workflow steps
- Tentukan resources yang diperlukan (references/, playground/)
- Catat rencana di `.ai/current-focus.md`

### Step 3 — Init / Edit SKILL.md
- Edit SKILL.md frontmatter: `name` dan `description` yang akurat
- Tulis body: Overview, Workflow, dan Resources sections
- **Progressive disclosure**: mulai dari high-level, detail di references/

### Step 4 — Validate
- Jalankan `skill_validate` (strict mode untuk publish-readiness)
- Fix semua violations sebelum lanjut

### Step 5 — Audit
- Jalankan `skill_audit` untuk cek quality

### Step 6 — Generate Metadata & Iterate
- Jalankan `skill_generate_metadata` untuk create agents/openai.yaml
- Iterate steps 3-6 sampai skill mature

## Continuity Operations (Wajib di Setiap Sesi)

### Session Start
1. **Contract Gate.** Validasi contracts dari RAG System.
2. **Continuity Gate.** Baca `/.ai/` artifacts.
3. **MCP Health Check.** `rag_status` → healthy + vector_count > 0.
4. **Ringkas** konteks kerja aktif.

### Session End
- Update `/.ai/current-focus.md`, `/.ai/decision-log.md`, `/.ai/handoff.md`, `/.ai/open-loops.md`.

## Guardrails
- Jangan mulai menulis SKILL.md sebelum Step 1 selesai.
- Jangan skip validation/audit sebelum publish.
- Jangan inline detail panjang di SKILL.md — extract ke references/.
- SKILL.md body harus self-contained.
