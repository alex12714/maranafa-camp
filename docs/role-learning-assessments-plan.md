# Role Learning & Certification

**Status:** Proposed product and data design

**Scope:** Role-specific learning paths in the authenticated portal, backed by `maranafa-api` PostgreSQL.

## Outcome

Every operational camp role has a role-specific learning path. A person can take
one path for each role assigned to them, learn from a short remediation item when
an answer is wrong, and earn a verifiable certificate after mastering the whole
path.

This is app-owned content and progress. It must not be stored in, or synchronised
back to, AirTable: content authors need drafts and versions, while answer history
and certificates must remain intact even when training is revised for a future
camp.

## Existing-system decisions

- The learner UI belongs in this repository, under the existing authenticated
  `/portal` experience. The data, scoring, authoring API, and PDF certificate
  rendering belong in the sibling `maranafa-api` FastAPI/PostgreSQL service.
- A person can hold roles from both `people_roles` and `people_roles2`. Before
  this feature is built, the API must introduce one `effective_roles(person)`
  helper which returns the de-duplicated union. The learning feature and
  `GET /me/profile` must use that helper; a test must not disappear merely
  because its role came from the other AirTable field.
- A learner selects a role when they have more than one. Each role has its own
  independent progress, attempt history, and certificate.
- A *published* learning-path version is immutable. An editor clones it into a
  new draft to change a question or material. This is what makes a historical
  result and certificate explainable later.
- Sound is a presentation capability, not a fifth answer model. A prompt or an
  answer option may have audio, and correct/incorrect feedback may play a
  sound. This allows audio to accompany every interaction type without creating
  parallel data structures.

## Learner mechanics

```
My assigned roles
  -> choose a role
  -> start or resume its current published assessment version
  -> answer the current item
       -> correct: mark the item mastered and continue
       -> incorrect: show linked training material(s)
                     -> learner opens and acknowledges them
                     -> retry the same item
  -> every required item mastered
  -> final result, congratulations, and certificate
```

### Attempt rules

1. Starting a role creates one in-progress attempt for the currently published
   version, or resumes the existing one. The initial release uses every required
   question in a fixed author-defined order; future random question banks can
   still be added without changing the core tables.
2. The progress bar is **mastered required questions / total required
   questions**. A wrong response does not increase it; reading remediation and
   then answering correctly does. The screen also states, for example,
   `Question 4 of 12`, so the colour alone is never the only signal.
3. A wrong answer is saved, then the current item changes to
   `awaiting_remediation`. The learner is shown a short, role-relevant article,
   image, video, or sound clip and explicitly acknowledges it before retrying.
   Do not add a fake timer to prove that someone read it.
4. The retry is for the same question. The UI says “Not quite — review this and
   try again”; it does not reveal the correct option. A correct response can
   show an author-written explanation.
5. There is no timer and no arbitrary pass percentage in the first release:
   certification requires every required item to be mastered. The results page
   still reports useful facts such as total responses, first-pass score, and
   remediation topics completed.
6. Learners may leave and resume. A passed path may be restarted as practice,
   creating a new attempt but not a duplicate certificate for the same person
   and version.
7. At submission and certification time, the API confirms that the person still
   holds the role. If an administrator removes the role mid-attempt, the attempt
   stays as history but cannot yield a new certificate.

### Supported interactions

| Renderer | Authoring rule | Stored answer |
| --- | --- | --- |
| `single_choice` | Exactly four options; exactly one correct option. | One option id. |
| `yes_no` | Two labelled options, `yes` and `no`; exactly one correct. | One option id. |
| `multi_select` | Two or more options; one or more correct. A response is correct only when its selected set exactly matches the correct set. | Set of option ids. |
| `swipe_binary` | Two options mapped to the semantic directions `left` and `right`; exactly one correct. Buttons provide the same choice for keyboard and assistive-technology users. | The option id selected by the direction, never a raw screen coordinate. |
| audio enhancement | Optional audio on a prompt or option, plus optional feedback sounds. A visible Play/Pause control and captions/transcript are required. | No additional answer shape. |

The front-end will have one `AssessmentRunner` with four small renderers, rather
than four independent quiz implementations. A swipe gesture is only a convenient
input method; users can always tap the visible left/right controls.

### Completion and certificate

When the final item becomes mastered, the API performs one transaction that:

1. marks the attempt `passed` and records its completion time;
2. creates one certificate if one does not already exist for the person and
   learning-path version; and
3. returns the result payload for the congratulations screen.

The certificate displays the recipient name, role name, learning-path title and
version, issue date, serial number, and a QR/verification URL. The PDF can be
rendered on demand from that immutable certificate record; storing a PDF is an
optional later optimisation, not a prerequisite for issuing it.

## Content authoring lifecycle

1. A director/training administrator creates a role learning program, then a
   **draft** version.
2. They add ordered modules, short training materials, questions, translated
   prompts/options, and the material(s) linked to each question for remediation.
3. Server-side publishing validation checks all required translations and each
   renderer’s option rules. It rejects a path with an unlinked remediation
   question, missing audio transcript, or no required questions.
4. Publishing changes the version to `published`; it can no longer be edited or
   deleted. The previously current version becomes `retired` when appropriate;
   people who started it may still finish it during the configured grace period.
5. Changes for next camp or next season are made by cloning to a new draft and
   publishing that new version. Retired data is never repurposed in place.

The first administrator UI should be deliberately simple: role selector,
version list, module outline, material editor, question editor, preview, and
publish checklist. Aggregate results and authoring remain director-only; a
learner can access only their own attempt and certificate.

## Database design

Use UUID primary keys, `timestamptz` audit columns, and the existing SQLModel /
Alembic migration style. Question and workflow statuses should be validated by
Pydantic and service transition rules, stored as strings rather than PostgreSQL
enums, so a new renderer or lifecycle state does not require an enum migration.

### Content tables

| Table | Important columns and constraints | Purpose |
| --- | --- | --- |
| `role_learning_programs` | `id`, `role_id FK roles`, `code UNIQUE`, `active` | The permanent learning program for one camp role. One active program per role. |
| `role_learning_versions` | `id`, `program_id FK`, `version_number`, `status`, `title`, `description`, `published_at`, `retired_at`; `UNIQUE(program_id, version_number)` | An immutable, publishable snapshot of a program’s content. |
| `learning_modules` | `id`, `version_id FK`, `code`, `sort`, `required`; `UNIQUE(version_id, code)` | Ordered subject areas, such as kitchen hygiene or emergency response. |
| `learning_assets` | `id`, `storage_key UNIQUE`, `mime_type`, `byte_size`, `sha256`, `duration_ms`, `transcript`, `created_by_person_id` | Metadata for audio/video/image assets stored through the existing upload service. Store keys, not unstable public URLs. |
| `learning_materials` | `id`, `module_id FK`, `kind` (`article`, `video`, `audio`, `document`), `sort`, `asset_id nullable FK`, `required` | The concise training material learners see up front or after an incorrect answer. |
| `learning_material_translations` | `material_id FK`, `language`, `title`, `body_markdown`; `UNIQUE(material_id, language)` | Localised material text. Audio/video assets must provide transcript/captions in this row or in the asset. |
| `learning_questions` | `id`, `module_id FK`, `code`, `question_type`, `sort`, `required`; `UNIQUE(module_id, code)` | A scored prompt. `question_type` is one of the four renderer values above. |
| `learning_question_translations` | `question_id FK`, `language`, `prompt_markdown`, `correct_explanation_markdown`, `audio_asset_id nullable FK`, `interaction_config JSONB`; `UNIQUE(question_id, language)` | Localised prompt and optional audio. `interaction_config` holds display-only data such as the two swipe directions. |
| `learning_question_options` | `id`, `question_id FK`, `code`, `sort`, `is_correct`; `UNIQUE(question_id, code)` | Answer definitions. Correctness is server-only. |
| `learning_question_option_translations` | `option_id FK`, `language`, `label`, `audio_asset_id nullable FK`; `UNIQUE(option_id, language)` | Localised option labels and optional answer audio. |
| `learning_question_materials` | `question_id FK`, `material_id FK`, `sort`, `required`; composite primary key `(question_id, material_id)` | The remediation route shown after a wrong answer. A material may support several questions. |

Content tables can cascade on deletion only while a version is a draft. Publishing
must use service-level transition guards and block hard deletion; a retired
version is hidden from new attempts, not removed.

### Learner history and results

| Table | Important columns and constraints | Purpose |
| --- | --- | --- |
| `learning_attempts` | `id`, `person_id FK people`, `version_id FK`, `status`, `started_at`, `completed_at`, `last_activity_at`, `role_assignment_confirmed_at` | One run through one immutable version. A partial unique index permits only one `in_progress` or `awaiting_remediation` attempt per `(person_id, version_id)`. |
| `learning_attempt_items` | `id`, `attempt_id FK`, `question_id FK`, `sort`, `status`, `first_answered_at`, `mastered_at`, `remediation_count`; `UNIQUE(attempt_id, question_id)` | Pins the question order for the attempt and tracks the current state of each required item. |
| `learning_responses` | `id`, `attempt_item_id FK`, `idempotency_key UNIQUE`, `is_correct`, `submitted_at`, `elapsed_ms nullable`, `raw_answer JSONB` | Immutable event log of every answer and retry. `is_correct` is calculated by the server. |
| `learning_response_selections` | `response_id FK`, `option_id FK`; composite primary key `(response_id, option_id)` | Normalised selected options for reports and audit, including multi-select responses. Service validation ensures the options belong to the item’s question. |
| `learning_material_progress` | `attempt_item_id FK`, `material_id FK`, `opened_at`, `acknowledged_at`; `UNIQUE(attempt_item_id, material_id)` | Proves the remediation material route was opened and acknowledged before the retry is accepted. |
| `learning_certificates` | `id`, `certificate_number UNIQUE`, `verification_token UNIQUE`, `person_id FK`, `version_id FK`, `attempt_id FK`, `recipient_name_snapshot`, `role_name_snapshot`, `program_title_snapshot`, `issued_at`, `revoked_at`; `UNIQUE(person_id, version_id)` | The durable certificate record and all data needed to render or verify it later. |

There is no separate writable `results` table. Attempt items, response events,
and certificates are the source of truth. The admin results endpoint can expose
a query/view grouped by person, role/program, version, first-pass score,
response count, remediation count, status, and certificate.

### Required indexes and foreign-key behaviour

- Index program lookup by `role_id`, and version lookup by
  `(program_id, status, published_at DESC)`.
- Index module/question/material ordering by their parent id and `sort`.
- Index learner dashboard reads by `(person_id, status, last_activity_at DESC)`
  on `learning_attempts`.
- Index answer history by `(attempt_item_id, submitted_at)` and remediation
  progress by `attempt_item_id`.
- Use `ON DELETE CASCADE` for a deleted draft’s content children and attempt
  children. Published content is never hard-deleted. Hard deletion of a person
  must delete or irrevocably anonymise learner history; the existing account
  deletion process must also revoke/scrub certificate name snapshots.

## API contract

All learner routes require a person-backed JWT and verify current role membership
on the server. They must never accept a person id from the browser.

| Route | Responsibility |
| --- | --- |
| `GET /me/learning/roles` | Return the person’s effective roles that have a published path, current status, progress, and certificate summary. A role with no published path is labelled “training not available”, not silently omitted from administration reports. |
| `POST /me/learning/roles/{role_id}/attempts` | Start or idempotently resume the current version after checking role membership. |
| `GET /me/learning/attempts/{attempt_id}` | Return the attempt status, progress, and only the current item or its required remediation. Correct-option flags never leave the server. |
| `POST /me/learning/attempts/{attempt_id}/items/{item_id}/responses` | Validate an answer, persist it, transition the item, and return correct/incorrect feedback and the next state. Requires an idempotency key. |
| `POST /me/learning/attempts/{attempt_id}/items/{item_id}/materials/{material_id}/open` | Record that the assigned remediation material was opened before it can be acknowledged. |
| `POST /me/learning/attempts/{attempt_id}/items/{item_id}/materials/{material_id}/acknowledge` | Record the learner’s remediation acknowledgement only when the material is assigned to that item. |
| `GET /me/learning/certificates/{certificate_id}` | Return the certificate metadata and an authenticated PDF render/download. |
| `GET /public/certificates/{verification_token}` | Return only the minimal verification details for a QR scan; never expose answer history or contact data. |

Director/training-admin routes provide program/version/module/material/question
CRUD, draft cloning, preview, publishing, revocation, and aggregate reports.
Their permissions should be an explicit capability guard; `require_director` is
a safe first release gate, rather than allowing every person whose broad auth role
is `staff` to edit training.

## Reliability, concurrency, and security rules

The answer submission path has two asynchronous hazards: a user can double-tap
or submit from two browser tabs, and the final correct answer can race a second
request that also tries to create a certificate. The server must:

1. lock the current `learning_attempt_item` row in the response transaction;
2. enforce one response per idempotency key and return its original result on
   replay;
3. refuse a response when the item is not the attempt’s current eligible item
   or its required remediation has not been opened and acknowledged;
4. insert the response, update item/attempt state, and issue the certificate in
   one transaction; and
5. rely on the certificate’s unique `(person_id, version_id)` constraint as the
   final race-proof guard.

The browser disables the controls while a response is pending and ignores stale
responses after navigation, but client behaviour is only convenience—the API is
authoritative. Results, option correctness, certificate eligibility, and role
membership are never computed from browser state.

Audio must obey the user’s sound preference and browser autoplay rules. Each
audio prompt has a labelled play control, transcript/captions, and non-audio
equivalent content. Swipe interactions must offer focusable buttons and must
not use direction alone to convey meaning.

## Delivery plan

1. **Foundation in `maranafa-api`** — add models, migration, effective-role
   helper, learner read/start routes, draft/publish validation, and backend
   tests. Seed one role with a small private test path.
2. **Learner portal** — add `/portal/learning` and a role card from the profile;
   implement progress/resume state and the single-choice renderer first.
3. **All interaction modes** — add binary, multi-select, and accessible swipe
   renderer; attach audio controls and feedback preference.
4. **Remediation and certification** — add material gates, results screen,
   certificate issuance, PDF rendering, and verification endpoint.
5. **Authoring and operations** — build the director editor/preview/publish
   checklist, aggregate reporting, certificate revocation, and retention hooks.

## Test plan and release criteria

Backend tests (the existing `pytest` suite) must cover role-union eligibility,
every renderer’s scoring rules, translation/publish validation, remediation
gates, resume behaviour, unauthorised access, version immutability, certificate
uniqueness, and concurrent duplicate response submissions.

Frontend tests should cover the one-question runner state machine, the progress
bar/visible count, correct and wrong feedback, route recovery after refresh,
keyboard-only use, screen-reader labels, reduced-motion/sound-off behaviour,
and touch swipe threshold/cancel behaviour. A browser-level test should complete
a role path, deliberately fail and remediate an item, then confirm the final
certificate.

The feature is ready for real role content only when an administrator can publish
a path for a role; an assigned person can resume it on another device; a wrong
answer cannot be retried before its linked material is acknowledged; all four
answer forms work without a mouse; and repeated final submissions never issue
more than one certificate.
