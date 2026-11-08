# UX Design Brief — Vedic Astrology (Jyotish) App

**Audience:** frontend-engineer (implementation partner).  
**Scope:** `components/charts/SavedChartsList.tsx`, `app/page.tsx` (save-button area), `components/forms/date-picker.tsx`, `components/forms/KundaliForm.tsx` + their shared UI primitives.  
**Do not edit source.** All recommendations below are code-level, implementation-ready, and reference exact files/lines.

---

## Stack & design tokens (derived from the repo, not invented)

- Framework: Next.js 16 (App Router), Tailwind CSS v4 (`@tailwindcss/postcss`), shadcn/ui primitives in `components/ui/`.
- Icons: `@phosphor-icons/react`. Toast: `sonner`.
- Theme tokens live in `app/globals.css:4-89` (CSS custom properties, auto-exposed to Tailwind):
  - Color: `--primary #dc7702` / `--primary-foreground #fffced`; `--destructive #df2225`; `--border #e5e5e5`; `--input #e5e5e5`; `--muted #f5f5f5` / `--muted-foreground #737373`; `--background #ffffff` / `--foreground #0a0a0a`.
  - Radius: `--radius-md 6px`, `--radius-lg 8px`, `--radius-xl 14px`, `--radius-full`.
- Font: `var(--font-noto-sans-devanagari), sans-serif` (`globals.css:109,115`).
- Shared interaction CSS already exists in `globals.css:140-190` (`.ui-control`, `.ui-picker-option`, focus rings at `outline: 2px solid var(--ring)`, 160ms transitions). Reuse these; do not add one-off `shadow-[...]` or arbitrary hex values.
- Button primitive (`components/ui/button.tsx`): default size `h-8` (32px), `sm` `h-7`, `lg` `h-9`, `icon-sm` `size-7` (28px), `icon` `size-8` (32px). All buttons are `rounded-lg`, `focus-visible:ring-ring/50`, `disabled:opacity-50`.

> **Assumption:** The project intentionally uses shadcn/ui, not Astryx (Astryx is not in `package.json`). Recommendations follow the project's actual shadcn/ui + Tailwind v4 conventions.

---

## 1. Summary

The app is functional but has several **accessibility blockers** (non-keyboard list rows, unlabeled picker controls, broken dark-mode popover) and **feedback gaps** (the save button never shows a loading/disabled state during save, so users can double-save and get no inline confirmation). There is also a likely **functional bug**: `KundaliForm` renders `<form action={onSubmit}>` with a client-side function, which will not reliably invoke `handleSubmit` in Next.js. Top 3 priorities: (1) fix form submission wiring, (2) make saved-chart rows keyboard-operable and label the date picker, (3) give the save button a real loading/disabled state plus inline save confirmation.

---

## 2. Findings table

| ID | Priority | Location | Issue | Fix |
|----|----------|----------|-------|-----|
| UX-01 | P0 | `components/forms/KundaliForm.tsx:51` | `<form action={onSubmit}>` passes a **client function** to Next.js `action`; `handleSubmit` is unlikely to fire → "Continue" button appears broken. | Change to `<form onSubmit={...}>`, call `e.preventDefault()`, then `onSubmit(new FormData(e.currentTarget))`. |
| UX-02 | P0 | `components/charts/SavedChartsList.tsx:79-88` | List rows are `<div onClick>` — not focusable, no `role`, Enter/Space do nothing. Keyboard users cannot load a saved chart. | Render each row as a native `<button type="button">` (Enter/Space work natively); keep the trash button inside with `stopPropagation`. |
| UX-03 | P0 | `components/forms/KundaliForm.tsx:62-74` | `Label htmlFor="bsYear"` points at a `type="hidden"` input; the actual date-picker control has no `id`/accessible name. Label is not attached to an operable control. | Add an `id` prop to `NepaliDatePicker`, expose it on the trigger button, and bind `Label htmlFor={pickerId}`. |
| UX-04 | P0 | `components/forms/date-picker.tsx:76` | `PopoverContent` hardcodes `bg-white` and `shadow-[0_4px_10px_rgba(0,0,0,0.14)]` — breaks dark mode (white panel on dark background) and bypasses the theme token system. | Use `bg-popover` + `shadow-md` (or the existing `.ui-control` tokens); remove arbitrary hex/rgba. |
| UX-05 | P1 | `app/page.tsx:154-181` | `handleSaveChart` never sets a saving flag; `disabled={loading}` only covers form submit. Button stays clickable during save → double-save; only a toast confirms, no inline state. | Add local `saving` state; `disabled={loading || saving}`; show "Saving…" while saving; keep toast + add inline "Chart saved" confirmation. |
| UX-06 | P1 | `components/charts/SavedChartsList.tsx:105-114` | Delete button is `size-6` (24 px) touch target, below the 44 px touch target. Destructive action has no confirmation/undo. | Expand hit area to ≥44 px (`min-h-[44px] min-w-[44px]`); add inline confirmation before delete. |
| UX-07 | P1 | `components/forms/KundaliForm.tsx:113-130` | Submit button is `h-8` (32 px) and hardcodes `bg-primary text-primary-foreground` instead of using `variant="default"`; below 44 px touch target. | Use `variant="default"` size `lg` + `min-h-[44px]`; remove duplicate color utilities. |
| UX-08 | P1 | `components/forms/date-picker.tsx:157-169` | Day cells are `size-7` (28 px) — below 44 px touch target on the primary input method. | `min-h-[44px] min-w-[44px]` on day cells (keep visual icon small, expand hit area). |
| UX-09 | P1 | `components/forms/date-picker.tsx:95-130` | Month/year `SelectTrigger`s are `h-7 border-0 bg-transparent shadow-none` — visually inconsistent with the `h-8 rounded-lg border` date trigger. | Style month/year triggers to match the date trigger (same height/radius/border) or place them in a secondary toolbar. |
| UX-10 | P1 | `components/forms/KundaliForm.tsx:100-102` | Time-picker label "Remember the time?" is ambiguous; should be "Time of birth". | Reword label (copywriter) / set to "Time of birth". |
| UX-11 | P1 | `components/forms/KundaliForm.tsx:51-134` | When `Continue` is disabled (missing date/city), no inline message explains why. User is left guessing. | Add inline helper/error text under the relevant field when disabled for validation reasons. |
| UX-12 | P1 | `app/page.tsx:302-306` | Form-submit error renders in `page.tsx`, disconnected from `KundaliForm`. No inline form errors. | Surface submit errors inside/above the form card, field-adjacent where possible. |
| UX-13 | P1 | `components/forms/KundaliForm.tsx:112-131` | Submit footer is a hand-rolled `bg-muted/60` div inside the Card, fighting Card defaults (`rounded-b-xl border-t ...`) and not dark-mode-safe. | Use `Card`/`CardFooter` primitives consistently; avoid arbitrary `bg-muted/60`. |
| UX-14 | P1 | `components/charts/SavedChartsList.tsx:40-54` | Card gets a double border (Card's `border-(--border-width)` + explicit `border border-border`), heading overrides `CardTitle` to `text-sm` while default is `text-2xl`, padding overrides fight `CardHeader` defaults. | Stop overriding Card primitives; use them as designed, adjust only spacing via props. |
| UX-15 | P2 | Multiple | Arbitrary magic values not on the spacing scale: `max-w-96`, `md:max-w-120`, `w-53`, `w-32.75`, `h-21.25`, `h-140.5`, `max-w-318`, `py-12`, `md:pl-16`, `max-w-154.75`. | Replace with token-backed Tailwind classes on the 4 px grid (e.g. `max-w-md`, `p-4`, `gap-4`). |
| UX-16 | P2 | `components/forms/KundaliForm.tsx:42-46` | Default birth date `2059/4/1` (~2002 AD) is arbitrary and unexplained. | Either default to empty/"Select a date" or a clearly documented placeholder. |
| UX-17 | P2 | `app/page.tsx:175-180` | `saveChart` (`lib/chart-storage.ts:45-70`) never throws — localStorage errors are swallowed — so the `catch`/`toast.error("Failed to save chart")` is dead code; quota/private-browser failures are silent. | Remove unreachable catch or surface quota errors inline; do not promise an error path that cannot trigger. |

---

## 3. Detailed recommendations (P0/P1) with before/after

### UX-01 — Fix form submission wiring (`KundaliForm.tsx:51`)

**Why it matters:** The "Continue" button is the primary conversion action. If `action={onSubmit}` doesn't invoke the client handler, users cannot generate a chart at all.

**Before:**
```tsx
<form action={onSubmit} className="flex flex-col pt-8 md:pt-16 gap-6">
```
**After:**
```tsx
<form
  onSubmit={(e) => {
    e.preventDefault()
    onSubmit(new FormData(e.currentTarget as HTMLFormElement))
  }}
  className="flex flex-col pt-8 md:pt-16 gap-6"
>
```
**Notes:** `page.tsx`'s `handleSubmit` already accepts `FormData`. No other changes needed in `page.tsx`. Acceptance: clicking Continue with valid data invokes `handleSubmit` and navigates/shows the chart.

---

### UX-02 — Make saved-chart rows keyboard-operable (`SavedChartsList.tsx:79-88`)

**Why it matters:** WCAG 2.2 AA requires all functionality be keyboard operable. A `<div onClick>` is invisible to keyboard and screen readers.

**Before:**
```tsx
<div
  key={chart.id}
  onClick={() => handleLoad(chart)}
  className={cn(
    "flex w-full items-center justify-between gap-4 px-4 py-3 text-left",
    "border-b border-border last:border-b-0",
    "hover:bg-muted hover:shadow-sm transition-colors duration-150",
    "cursor-pointer rounded-md",
  )}
>
```
**After:**
```tsx
<button
  type="button"
  key={chart.id}
  onClick={() => handleLoad(chart)}
  className={cn(
    "flex w-full items-center justify-between gap-4 px-4 py-3 text-left",
    "border-b border-border last:border-b-0",
    "hover:bg-muted hover:shadow-sm transition-colors duration-150",
    "rounded-md",
  )}
>
```
**Notes:** A native `<button>` gives Enter/Space activation and focus styling for free via the existing globals (`.ui-control:focus-visible`). Keep `stopPropagation` on the trash button. Acceptance: Tab reaches each row; Enter loads the chart.

---

### UX-03 — Associate the date-picker label with an operable control (`KundaliForm.tsx`, `date-picker.tsx`)

**Why it matters:** `Label htmlFor="bsYear"` targets a hidden input that cannot be focused; the visible control has no accessible name.

**Change `NepaliDatePicker`** to accept and forward an `id`:
```tsx
interface NepaliDatePickerProps {
  id?: string
  year: number
  month: number
  day: number
  // …
}

export function NepaliDatePicker({ id, year, month, day, ... }) {
  ...
  <Button
    id={id}
    type="button"
    variant="outline"
    className={cn("ui-picker-trigger h-8 w-full ...", ...)}
  >
```
**Change `KundaliForm`:**
```tsx
<Label htmlFor="bsDate">Date of birth</Label>
<NepaliDatePicker
  id="bsDate"
  {...birthDate}
  maxDay={getMaxBSDay(birthDate.month)}
  onChange={setBirthDate}
/>
```
Acceptance: Screen reader announces "Date of birth" when the picker button is focused.

---

### UX-04 — Fix date-picker dark mode & hardcoded shadow (`date-picker.tsx:76`)

**Why it matters:** `bg-white` on a dark background is a contrast/theme violation; the arbitrary `rgba` shadow bypasses the design system.

**Before:**
```tsx
<PopoverContent
  align="start"
  className="w-53 rounded-lg border border-border bg-white p-2 shadow-[0_4px_10px_rgba(0,0,0,0.14)]"
>
```
**After:**
```tsx
<PopoverContent
  align="start"
  className="w-[212px] rounded-lg border border-border bg-popover p-2 shadow-md"
>
```
Replace `w-53` with `w-[212px]` (same computed value, token-friendly bracket) or a theme width. Acceptance: popover background/inherits `bg-popover` and is legible in both light and dark mode.

---

### UX-05 — Save button loading/disabled state + inline confirmation (`page.tsx:154-181, 251-266`)

**Why it matters:** Today `handleSaveChart` touches no loading state, so the button never disables or shows "Saving…". Users can click repeatedly; the only feedback is a toast.

**Add to `Home` (page.tsx):**
```tsx
const [saving, setSaving] = useState(false)
const [savedOk, setSavedOk] = useState(false)
```
**Rewrite `handleSaveChart`:**
```tsx
async function handleSaveChart() {
  if (!chartData) return
  const bsYear = searchParams.get("bsYear")
  // … (existing param extraction unchanged) …
  if (!bsYear || !bsMonth || !bsDay || !birthTime || !city) return

  const birthDetails = { bsYear: Number(bsYear), bsMonth: Number(bsMonth),
    bsDay: Number(bsDay), birthTime, city, lat: 0, lon: 0 }

  setSaving(true)
  setSavedOk(false)
  try {
    saveChart(chartData, birthDetails)
    setSavedOk(true)
    toast.success("Chart saved!")
  } catch {
    toast.error("Failed to save chart")
  } finally {
    setSaving(false)
  }
}
```
**Update the button (page.tsx:255-265):**
```tsx
<Button
  type="button"
  variant="outline"
  size="sm"
  onClick={handleSaveChart}
  className="text-xs"
  disabled={loading || saving}
>
  <Download size={14} aria-hidden="true" />
  {saving ? "Saving…" : savedOk ? "Saved!" : "Save chart"}
</Button>
```
Plus an inline confirmation line just below the button row:
```tsx
{savedOk && (
  <p className="mx-auto mt-2 flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs text-secondary-foreground">
    <Check size={14} aria-hidden="true" />
    Chart saved to your library.
  </p>
)}
```
Acceptance: Clicking Save disables the button, shows "Saving…", then "Saved!" plus the inline line; a second click during save is ignored.

> Note: `saveChart` never throws (`lib/chart-storage.ts`), so the catch branch is currently unreachable (UX-17). Keep the toast but know the real failure mode is silent localStorage quota/private-mode failure.

---

### UX-06 — Delete button touch target + confirmation (`SavedChartsList.tsx:105-114`)

**Why it matters:** 24 px is below the 44 px touch target; destructive deletion without confirmation risks data loss.

**Before:**
```tsx
<Button
  type="button"
  variant="destructive"
  size="icon-sm"
  onClick={(e) => handleDelete(chart.id, e)}
  className="size-6 shrink-0"
  aria-label={`Delete ${chart.name}`}
>
  <Trash size={14} aria-hidden="true" />
</Button>
```
**After:**
```tsx
<Button
  type="button"
  variant="destructive"
  size="icon-sm"
  onClick={(e) => handleDelete(chart.id, e)}
  className="min-h-[44px] min-w-[44px] shrink-0 p-1.5"
  aria-label={`Delete ${chart.name}`}
>
  <Trash size={14} aria-hidden="true" />
</Button>
```
Add confirmation state in the component:
```tsx
const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
```
and in `handleDelete` require `confirmDeleteId === chart.id` (first click arms, second deletes) or show an inline "Delete?" row with Confirm/Cancel. Acceptance: delete button is ≥44 px touch target; delete requires an explicit confirmation.

---

### UX-07 — Submit button size & redundant colors (`KundaliForm.tsx:113-130`)

**Why it matters:** 32 px primary action is below the 44 px touch target; hardcoding `bg-primary text-primary-foreground` duplicates `variant="default"` and breaks the variant system.

**Before:**
```tsx
<Button
  type="submit"
  disabled={loading || !birthDate.day || !city}
  className="h-8 w-full rounded-lg bg-primary text-xs font-medium text-primary-foreground"
>
```
**After:**
```tsx
<Button
  type="submit"
  variant="default"
  size="lg"
  disabled={loading || !birthDate.day || !city}
  className="w-full min-h-[44px] text-sm font-medium"
>
```
Acceptance: primary action ≥44 px tall; colors come from the `default` variant; no duplicate color utilities.

---

### UX-08 — Date-picker day-cell touch target (`date-picker.tsx:157-169`)

**Before:**
```tsx
className={cn("ui-picker-option mx-auto flex size-7 items-center justify-center rounded-full text-sm")}
```
**After:**
```tsx
className={cn("ui-picker-option mx-auto flex items-center justify-center rounded-full text-sm min-h-[44px] min-w-[44px]")}
```
Acceptance: each day cell is ≥44 px touch target while the drawn circle stays compact.

---

### UX-09 — Select trigger visual consistency (`date-picker.tsx:95-130`)

Month and year triggers should match the date trigger's density (`h-8`, `rounded-lg`, `border`) rather than `h-7 border-0 bg-transparent`. Apply the same `ui-picker-trigger` class and remove `border-0 bg-transparent shadow-none`. Acceptance: month/year and date triggers look like one control.

---

### UX-14 — Stop fighting Card primitives (`SavedChartsList.tsx:40-64`)

**Before (fighting defaults):**
```tsx
<Card className="mx-auto w-full max-w-96 md:max-w-120 border border-border rounded-xl shadow-sm">
  <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
    <CardTitle className="text-sm font-semibold">Saved Birth Charts</CardTitle>
```
**After (use primitives as designed):**
```tsx
<Card className="mx-auto w-full max-w-md">
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle className="text-sm font-semibold">Saved Birth Charts</CardTitle>
```
Remove the duplicate `border`/`rounded-xl` (Card already provides them via tokens) and don't override `CardTitle` to `text-sm` unless you intend a sub-heading style; if so, use a plain `<h3>`/`<p>` instead of `CardTitle`. Acceptance: single border, consistent radius, no fighting defaults.

---

## 4. Flow / screen specs

### Layout & responsive breakpoints (target: 360 / 768 / 1280 px)

| Region | 360 px (mobile) | 768 px (tablet) | 1280 px (desktop) |
|--------|-----------------|-----------------|-------------------|
| Header | `px-6`, logo `w-24`, height `h-21.25` | `px-6` | `px-21` |
| Hero | centered, `max-w-2xl`, `text-5xl` | same | same |
| Form card | `max-w-md` full width, `gap-6` | `max-w-md` | `max-w-md` |
| Submit button | full width, ≥44 px | full width, ≥44 px | full width, ≥44 px |
| SavedChartsList | `max-w-md`, stack | `max-w-md` | `max-w-lg` |
| Save button row | inline above chart | inline above chart | inline above chart |

**Key mobile constraint:** The form card must remain fully reachable with one thumb; keep the submit button full-width and ≥44 px. Avoid `max-w-318`/`max-w-154.75`-style arbitrary widths that break at 360 px — use `max-w-md` / `w-full`.

### States to cover

- **Default:** all fields empty, Continue disabled with inline hint ("Enter your date and birthplace to continue").
- **Loading (form):** spinner + "Creating chart…", button disabled.
- **Error (form):** inline error above/inside the card; do not rely solely on the page-level paragraph.
- **Empty saved state:** existing clock illustration is fine; keep `py-10` but center within card.
- **List item:** default / hover / focus-visible / active (pressed) — native button gives these.
- **Delete:** armed → confirm → deleted (toast "Deleted" + optional undo).
- **Save:** idle → "Saving…" (disabled) → "Saved!" inline + toast.

### Motion

Respect `prefers-reduced-motion` (already done for `.report-enter` in `globals.css:133`). Keep transitions ≤300 ms (buttons already `transition-all`; list rows `duration-150`).

---

## 5. Engineer handoff checklist

### Phase A — P0 (accessibility / functional)
- [ ] `KundaliForm.tsx:51`: replace `action={onSubmit}` with `onSubmit` handler calling `e.preventDefault()` + `onSubmit(new FormData(...))`.
- [ ] `SavedChartsList.tsx:79-88`: convert list `<div onClick>` to `<button type="button">`; keep trash `stopPropagation`.
- [ ] `date-picker.tsx`: add `id` prop, forward to trigger button; `PopoverContent` → `bg-popover shadow-md`, drop `bg-white` and arbitrary `rgba` shadow.
- [ ] `KundaliForm.tsx`: `Label htmlFor="bsDate"` + `<NepaliDatePicker id="bsDate" …>`.
- [ ] Verify: Tab reaches every list row and the date picker; Enter/Space activates rows; screen reader announces the date-picker label.

### Phase B — P1 (feedback / touch / hierarchy)
- [ ] `page.tsx`: add `saving` + `savedOk` state to `handleSaveChart`; button `disabled={loading || saving}`, label "Saving…"/"Saved!"; add inline "Chart saved" line.
- [ ] `SavedChartsList.tsx:105-114`: delete button `min-h-[44px] min-w-[44px]`; add confirmation before delete.
- [ ] `KundaliForm.tsx:113-130`: submit button `variant="default" size="lg" min-h-[44px]`, drop hardcoded colors.
- [ ] `date-picker.tsx:157-169`: day cells `min-h-[44px] min-w-[44px]`.
- [ ] `date-picker.tsx:95-130`: month/year triggers match date trigger density.
- [ ] `KundaliForm.tsx`: add inline hint when Continue is disabled; surface form submit errors inside the card.
- [ ] `SavedChartsList.tsx:40-64`: remove duplicate border/radius and CardTitle overrides.
- [ ] Verify at 360/768/1280 px: no horizontal scroll, primary actions thumb-reachable, dark-mode picker legible.

### Phase C — P2 (polish)
- [ ] Replace arbitrary widths (`w-53`, `w-32.75`, `max-w-96`, `md:max-w-120`, `max-w-318`, `h-21.25`, `h-140.5`, `py-12`, `md:pl-16`) with 4 px grid classes.
- [ ] Revisit default birth date `2059/4/1`.
- [ ] Remove/replace unreachable `toast.error("Failed to save chart")` path (`lib/chart-storage.ts` never throws).

### Acceptance criteria (verifiable by the engineer)
1. Form submits: Continue triggers `handleSubmit` (chart generates / URL updates).
2. Keyboard: Tab order is logical; every list row activates with Enter; focus ring visible (`2px solid var(--ring)`).
3. Touch targets: submit button, delete button, day cells ≥44 px.
4. Dark mode: date-picker popover inherits `bg-popover`, not white.
5. Save feedback: button disables + "Saving…" during save; inline "Saved!" + toast after.
6. Delete: requires confirmation; no accidental deletion.
7. No console errors/warnings; `next build` and `next lint` pass.

---

## 6. Open questions & assumptions

1. **Form `action` intent:** Was `<form action={onSubmit}>` intended to be a Next.js Server Action? If so, `handleSubmit` should be moved to a server action file (`app/actions.ts`) and marked `'use server'`. If it must stay client-side, use the `onSubmit` pattern in UX-01. Confirm which.
2. **Delete confirmation UX:** Confirm whether to use an inline confirm row, a sonner toast with action buttons, or a dialog. I recommend inline confirm for lowest disruption.
3. **Default date `2059/4/1`:** Is this a deliberate placeholder? If not, default to empty with "Select a date" trigger text.
4. **Copy:** "Remember the time?" and toast messages flagged for the copywriter; not blocking implementation.
5. **SavedChartsList name truncation:** the second info line (`Saved {date} at {time}`) is not truncated like the lines above; confirm whether consistent truncation is desired.

--- 

*Prepared by design partner. Save this brief at `docs/design/jyotish-ux-audit.md`; implement against the exact `file:line` references above.*