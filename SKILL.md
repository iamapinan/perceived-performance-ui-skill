---
name: perceived-performance-ui
description: Design, implement, audit, or improve web interfaces so they feel faster and more tactile using skeleton loading, shimmer, optimistic updates, blur-up images, intent prefetching, virtual lists, debounced search, streaming, spring motion, drag-to-dismiss, command palettes, layered shadows, noise, and toast feedback. Use for frontend builds, UX performance reviews, loading-state work, interaction polish, perceived-latency problems, slow-feeling interfaces, or requests to make a website feel responsive, smooth, premium, satisfying, or good to use.
---

# Perceived Performance UI

Make waiting understandable and interaction feedback immediate. Optimize actual performance first when it is poor, then use perception patterns to improve how progress and state changes are communicated.

## Workflow

1. Inspect the existing stack, interaction model, loading paths, error handling, accessibility, and measured performance when available.
2. Separate actual-performance problems from perception problems. Never disguise a severe performance regression with animation.
3. Map each slow or unsatisfying moment to the smallest suitable pattern set.
4. Implement full state cycles: idle, pending, success, empty, error, retry, rollback, and cancellation where applicable.
5. Verify with keyboard, pointer, touch, narrow viewport, slow network, failure simulation, dark mode, and reduced motion.
6. Report what changed, why each pattern was selected, and which metrics or user behaviors should improve.

For a detailed selection guide, read [references/pattern-catalog.md](references/pattern-catalog.md). For implementation and QA requirements, read [references/implementation-guardrails.md](references/implementation-guardrails.md).

## Select Patterns by Moment

Use this routing table. Combine patterns only when their jobs differ.

| User moment | Primary pattern | Purpose |
|---|---|---|
| Waiting for known content structure | Skeleton + restrained shimmer | Reserve layout and communicate progress |
| Performing a reversible, likely-successful action | Optimistic UI | Acknowledge input immediately |
| Waiting for a large image | Blur-up | Show color and composition early |
| Showing intent toward likely navigation | Prefetch on hover, focus, or touch intent | Spend idle time before navigation |
| Scrolling a very large collection | Virtual list | Keep DOM and layout work bounded |
| Typing a server-backed query | Debounce or cancel stale requests | Reduce redundant work and result flicker |
| Rendering independently available regions | Streaming | Reveal useful content in completion order |
| Moving or resizing a tactile object | Spring physics | Communicate weight and continuity |
| Closing a sheet or card with touch | Drag to dismiss | Match direct manipulation expectations |
| Accessing many frequent actions | Command palette | Shorten keyboard workflows |
| Elevating a true surface | Layered shadow | Communicate physical hierarchy |
| Reducing digital flatness in a visual surface | Subtle noise | Add material texture |
| Confirming a non-critical completed action | Toast or inline status | Confirm without blocking work |

## Pattern Budget

- Select patterns from actual user moments, not from a feature checklist.
- Prefer one clear feedback mechanism for each action.
- Keep perpetual animation limited to elements that truly represent activity.
- Use spring motion for state transitions and direct manipulation, not every hover.
- Use shadows only where elevation communicates hierarchy.
- Use noise only on static decorative layers and keep it visually subordinate.
- Prefer inline errors for actionable failures. Reserve toasts for transient, non-blocking feedback.

## Non-negotiable Behavior

- Match every skeleton to the final layout closely enough to avoid content jumps.
- Reserve intrinsic dimensions for images and media.
- Roll back failed optimistic changes and explain the failure near the affected control.
- Deduplicate prefetches, respect data-saving preferences, and avoid prefetching destructive or private actions.
- Preserve focus and screen-reader meaning across loading and state changes.
- Cancel or ignore stale search responses. Debouncing alone does not prevent out-of-order results.
- Keep streamed regions semantically ordered and independently recoverable.
- Use transform and opacity for continuous motion. Avoid layout properties in animation loops.
- Respect `prefers-reduced-motion`; remove overshoot and nonessential perpetual motion.
- Make drag gestures work with pointer and touch input, provide a button/keyboard alternative, and use velocity plus distance thresholds.
- Never use fake progress, fake precision, or optimistic UI for high-risk irreversible operations.

## Existing Projects

Preserve the product's design system, framework conventions, analytics hooks, routes, component APIs, and tested behavior unless the user authorizes broader changes. Audit before editing. Do not replace functioning UI solely to demonstrate a pattern.

For diagnosis-only requests, inspect and explain without implementing. For build or change requests, implement the selected patterns and verify them in proportion to risk.

## New Prototypes

When the user asks for a standalone demonstration or learning playground, copy and adapt `assets/playground/`. It contains working examples of all patterns in this skill. Treat it as a teaching asset, not a production component library.

For production work:

- Follow the existing app architecture.
- Use native platform features before adding dependencies.
- Check `package.json` before importing any library.
- Prefer the project's established motion and component libraries.
- Isolate high-frequency pointer or scroll values from framework render cycles.

## Verification

At minimum, verify:

- The user receives visible feedback within 100 ms of input.
- Layout remains stable when real content replaces placeholders.
- Loading, failure, retry, cancellation, and rollback are observable and usable.
- Keyboard focus is neither lost nor trapped.
- Screen readers receive concise status changes without repeated announcements.
- Touch targets and drag alternatives are usable on narrow screens.
- Reduced-motion mode remains understandable.
- No stale request overwrites newer data.
- Large lists keep rendered node counts bounded.
- Prefetching improves likely navigation without causing waste.

When tooling is available, compare before and after using Core Web Vitals, request counts, DOM node counts, and interaction latency. Label simulated timings and mock data clearly.
