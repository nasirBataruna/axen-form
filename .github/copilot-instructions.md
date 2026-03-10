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
| `rag_query_compiled` | Multi-step retrieval + compiled prompt |
| `rag_plan_query` | Query planner (problem decomposition) |
| `rag_reason_tools` | Policy engine pemilihan tool |
| `rag_compile_prompt` | Deterministic Prompt Compiler |
| `rag_prompt_delta` | Delta compiled prompt untuk token efficiency |
| `rag_conformance_check` | Validasi UPCC payload lintas channel |
| `rag_index` | Index knowledge files (hanya untuk RAG system maintainer) |
| `rag_context_pack` | Build provider-agnostic Context Priming Pack (UPCC) |
| `rag_stale_report` | Deteksi stale chunk/orphan vector |
| `rag_stale_cleanup` | Cleanup stale chunk dari vector index |
| `rag_bootstrap` | Bootstrap project baru ke governance |
| `rag_auto_migrate_project` | Enforce migration ke asset RAG terbaru |
| `skill_publish_tool` | Publish skill ke knowledge index |
| `skill_unpublish_tool` | Unpublish skill dari knowledge index |
| `skill_list` | List semua skill yang dipublish di knowledge base |
| `skill_search` | Semantic search khusus skill knowledge layer |

> **JANGAN buat `.vscode/mcp.json` per-project.** MCP sudah aktif global.

### Environment Variable (Wajib di Shell)

Agent mengasumsikan environment variable berikut tersedia:

| Variable | Fungsi |
|---|---|
| `RAG_SYSTEM_PATH` | Absolute path ke Internal RAG System |
| `PATH` | Mengandung `$RAG_SYSTEM_PATH/bin` agar `rag-cli` tersedia global |

Jika `rag-cli` tidak tersedia di PATH, fallback ke:
`cd /home/hawkeye22/_rag_system && python -m runtime_stub.rag_cli <command>`

### Prioritas Interface (WAJIB)

1. **MCP tools** — SELALU gunakan ini. MCP sudah aktif global.
2. **`rag-cli`** — HANYA fallback jika MCP server crash atau tidak tersedia.

### MCP Invocation Protocol (WAJIB)

Rule pemisahan interface:

- Identifier seperti `rag_*` dan `skill_*` adalah **nama MCP tool**, bukan executable shell.
- Agent **DILARANG** mengeksekusi nama MCP tool langsung di terminal.
- Terminal hanya boleh menjalankan command berbasis `rag-cli ...` (atau `python -m runtime_stub.rag_cli ...` sebagai fallback path).

Contoh yang **SALAH** (akan gagal di shell):

- `rag_migrate`
- `rag_migration_check`
- `rag_query`
- `skill_validate`

Contoh yang **BENAR** (CLI fallback):

- `rag-cli migrate <project_root>`
- `rag-cli check-updates <project_root>`
- `rag-cli query "<topik>" --top-k 3`

Mapping canonical MCP -> CLI fallback:

| MCP tool | CLI fallback |
|---|---|
| `rag_migration_check` | `rag-cli check-updates <project_root>` |
| `rag_migrate` | `rag-cli migrate <project_root>` |
| `rag_auto_migrate_project` | `rag-cli auto-migrate <project_root>` |
| `rag_status` | `rag-cli status` |
| `rag_query` | `rag-cli query "<topik>" --top-k 3` |

Jika agent perlu tool `rag_*`/`skill_*`, agent harus memilih urutan ini:

1. Coba MCP tool call.
2. Jika MCP unavailable, translate ke command `rag-cli` yang ekuivalen.
3. Jika `rag-cli` tidak ada di PATH, gunakan `cd /home/hawkeye22/_rag_system && python -m runtime_stub.rag_cli <command>`.

### Contract Sources (dari RAG System)

Agent WAJIB validasi:
- `/home/hawkeye22/_rag_system/contracts/contract-lock-v0.1.md` — HARUS ada dan LOCKED.
- `/home/hawkeye22/_rag_system/contracts/agent-governance-context-reuse-v0.1.md` — HARUS ada dan ACTIVE.

### Knowledge & Schema Sources (dari RAG System)

Saat agent membutuhkan referensi canonical:

- Knowledge template: `/home/hawkeye22/_rag_system/templates/knowledge/knowledge-item.template.md`
- Registry schema: `/home/hawkeye22/_rag_system/schemas/agent-context-registry.schema.json`
- Core knowledge layer: `/home/hawkeye22/_rag_system/knowledge/core/`

Agent membaca dari sumber-sumber ini. Agent TIDAK memodifikasi-nya.

### RAG Semantic Query (dari RAG System)

Saat agent membutuhkan referensi domain (arsitektur, governance, testing, security, dll):

**Via MCP (PRIMARY — Gunakan Ini):**
- `rag_query` tool dengan parameter `query`, `top_k`, `filter_key`, `filter_value`
- `rag_list` tool untuk audit coverage
- `rag_status` tool untuk health check
- `rag_bootstrap` tool untuk bootstrap project baru

**Via CLI (HANYA Fallback — Jika MCP Crash):**
```
rag-cli query "<topik>" --top-k 3
```

- **Filter**: `--filter source_file=architecture-principles.md` untuk narrowing.
- **JSON output**: tambahkan `--json` untuk structured parsing.
- **Status check**: `rag-cli status`
- **Fallback** (jika `rag-cli` tidak di PATH): `cd /home/hawkeye22/_rag_system && python -m runtime_stub.rag_cli <command>`

Agent TIDAK boleh mengubah index RAG System. Indexing dikelola oleh RAG System sendiri.

## Prioritas Eksekusi (Wajib)

1. `Continuity Operations`
2. Instruksi user pada sesi aktif
3. Tugas implementasi teknis
4. Optimasi tambahan (opsional)

Jika ada konflik, ikuti urutan prioritas di atas.

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
1. **Resolve Project Root.** Konfirmasi bahwa project root adalah direktori yang mengandung `.github/copilot-instructions.md` ini.

2. **Contract Gate.** Validasi contracts dari RAG System.
3. **Continuity Gate.** Baca `/.ai/` artifacts.
4. **Fingerprint Check.** Jika fingerprint konteks tidak berubah dari sesi sebelumnya, gunakan mode `context_revalidated` tanpa full reload.

5. **MCP Health Check.** `rag_status` → healthy + vector_count > 0.
6. **Migration Enforcement.** Panggil `rag_auto_migrate_project` tool dengan `project_root` project ini:
   - Sistem WAJIB memastikan project sudah pada asset version terbaru sebelum task domain.
   - Jika status `error` → hentikan task domain dan laporkan error eksplisit.
   - `rag_migration_check` tetap boleh dipakai untuk diagnosa detail.
   - **Via CLI (FALLBACK)**: `rag-cli auto-migrate <project_root>`

7. **RAG Knowledge Query.** Jika task menyentuh konsep arsitektur, governance, testing, security, atau domain knowledge lainnya:
   - **Via MCP (PRIMARY)**: gunakan `rag_query` tool.
   - **Via CLI (FALLBACK)**: `rag-cli query "<topik>" --top-k 3`
   Gunakan hasil semantic search sebagai referensi domain sebelum implementasi.
   Jalankan `rag_status` (MCP) atau `rag-cli status` (CLI) untuk memastikan index tersedia.

8. **RAG Trust Signal (WAJIB).** Setelah memanggil `rag_query` atau `rag-cli query`:

   | Kondisi response | Tindakan agent |
   |---|---|
   | Result mengandung `document` text | Gunakan sebagai **sumber kebenaran**. Jawaban dari training data boleh dipakai untuk format/syntax saja. |
   | Result ada tapi **tanpa** `document` text (ada `trust_warning`) | **JANGAN jawab dari asumsi.** Informasikan ke user bahwa knowledge index perlu di-rebuild. Jalankan `rag_index` via MCP, atau `rag-cli index knowledge/core/ contracts/ -r` via CLI. Retry query setelah re-index. |
   | Query tidak menemukan hasil sama sekali | Jawab bahwa topik belum ada di knowledge base. Jangan mengarang jawaban. |

   Agent **tidak boleh** menjawab pertanyaan domain project (arsitektur, API, komponen governance) hanya dari training data tanpa konfirmasi dari RAG result.

9. **Ringkas** konteks kerja aktif.

### Skill Knowledge

Selain knowledge layer standar (core, domain, project), RAG System juga menyediakan **skill knowledge layer** — pengetahuan reusable yang dipublish oleh skill authors.

**Cara mengakses skill knowledge:**

1. **Discover available skills** — gunakan `skill_list` tool untuk melihat skill apa saja yang tersedia.
2. **Query skill knowledge** — gunakan `skill_search` tool dengan topik yang relevan:
   ```
   skill_search(query="form validation pattern", top_k=3)
   ```
   Atau gunakan `rag_query` dengan filter manual:
   ```
   rag_query(query="form validation", filter_key="layer", filter_value="skill")
   ```
3. **Integrasikan ke implementasi** — hasil query skill adalah referensi domain-specific yang bisa langsung diaplikasikan ke kode project ini.

**Kapan menggunakan skill knowledge:**
- Saat implementasi membutuhkan pattern dari library/framework tertentu
- Saat user menyebut fitur yang mungkin sudah ada sebagai skill
- Sebagai referensi best-practice domain-specific sebelum menulis kode baru

> Agent WAJIB query `skill_list` atau `skill_search` saat task menyentuh domain yang mungkin sudah tercakup oleh skill yang dipublish.

### Session End
- Update `/.ai/current-focus.md`, `/.ai/decision-log.md`, `/.ai/handoff.md`, `/.ai/open-loops.md`.

## Penegasan Urutan Eksekusi

- Pengecekan status Git hanya boleh dilakukan setelah semua langkah continuity selesai.
- Jika pengecekan status Git diperlukan, tambahkan sebagai langkah tambahan setelah validasi continuity selesai.

## Guardrails
- Jangan mulai menulis SKILL.md sebelum Step 1 selesai.
- Jangan skip validation/audit sebelum publish.
- Jangan inline detail panjang di SKILL.md — extract ke references/.
- SKILL.md body harus self-contained.

## Multi-Project Awareness

- Default: isolasi konteks ke project aktif (`axen-form`).
- Cross-project context hanya boleh dipakai jika diminta eksplisit oleh user.
- Gunakan `projectId` / `workspaceId` secara konsisten di semua artifact continuity.

## Path Resolution Rules

- Semua path di continuity artifacts dan knowledge items HARUS relatif terhadap Project Root.
- Absolute path TIDAK BOLEH di-embed di frontmatter atau governance artifacts.
- Satu-satunya absolute path yang diizinkan adalah `/home/hawkeye22/_rag_system` sebagai pointer ke otoritas external, yang dideklarasikan di file ini.

## Definisi Artifact `/.ai` (di Project Root)

- `roadmap.md`: milestone dan urutan implementasi bertahap.
- `current-focus.md`: fokus aktif sesi saat ini.
- `open-loops.md`: pekerjaan/keputusan yang belum tuntas.
- `decision-log.md`: jejak keputusan teknis.
- `handoff.md`: ringkasan transisi antar sesi.

## Kriteria Kepatuhan

- Sesi baru harus bisa lanjut kerja tanpa user mengulang konteks.
- Tidak ada task selesai tanpa pembaruan continuity artifact.
- Prioritas dan arah kerja tetap konsisten dengan roadmap aktif.
- Contract gate wajib pass sebelum task substantif apapun dimulai.

---
<!-- RAG System Template Version: 1.4.0 | Do not remove this line -->
