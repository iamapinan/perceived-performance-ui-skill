# Pattern Catalog

Use this reference when selecting or reviewing patterns. Read only the relevant sections for the task.

## Contents

1. Perceived-performance patterns
2. Tactile and feel-good patterns
3. Combination recipes
4. Patterns to avoid

## 1. Perceived-performance patterns

### Skeleton and shimmer

Use when the final layout is predictable and data needs noticeable time to arrive. Shape placeholders like the real avatar, title, text, media, or table regions. Reserve final dimensions.

Use a slow, subtle shimmer only to communicate activity. Disable it in reduced-motion mode. Prefer a stable placeholder over a spinner for page-level content. Do not use a skeleton when the wait is usually imperceptible or the final shape is unknown.

Success signals: lower layout shift, faster perceived start, fewer repeated clicks, and no placeholder-to-content jump.

### Optimistic UI

Use for reversible, high-success actions such as likes, toggles, reordering, lightweight edits, or local creation. Update the client immediately, send the request in the background, and reconcile the server result.

Keep the previous state or an inverse operation for rollback. Prevent double submission or make mutations idempotent. Show contextual failure and offer retry when useful. Do not use for payment, irreversible deletion, authorization, inventory claims, or actions whose success is uncertain.

Success signals: immediate visual response, correct rollback, no duplicate mutations, and eventual client-server consistency.

### Blur-up images

Embed or preload a very small placeholder, reserve the final aspect ratio, and crossfade the decoded full-resolution image. The placeholder should preserve dominant color and broad composition.

Do not blur sensitive imagery that must not be revealed before authorization. Do not let the placeholder become the LCP bottleneck. Remove blur after decode rather than after an arbitrary timeout in production.

Success signals: stable layout, meaningful early pixels, and smooth replacement without a flash.

### Intent prefetching

Start low-priority work on meaningful intent such as pointer hover, keyboard focus, pointer-down, or a route entering a likely navigation path. Cache and deduplicate the result.

Respect `Save-Data`, constrained connections, cache policy, authentication boundaries, and server load. Do not prefetch every link or any action with side effects. A prefetch must never mutate state.

Success signals: higher cache-hit rate on likely navigation and bounded unused bytes.

### Virtual lists

Render visible rows plus a small overscan buffer. Use a spacer or virtualization engine to preserve scroll geometry. Keep item keys stable and restore focus when a focused row leaves and re-enters the rendered window.

Use a maintained library for variable-height rows, grids, reverse lists, sticky groups, or accessibility-heavy tables. Avoid virtualization for small lists because it adds complexity.

Success signals: bounded DOM nodes, stable scrolling, low scripting/layout time, correct keyboard navigation, and no blank gaps during fast scroll.

### Debounced search

Delay server calls until typing pauses, commonly 200-350 ms. Give immediate local feedback while waiting. Abort the previous request or ignore stale responses using a sequence token.

Submit immediately on Enter. Do not debounce local filtering that is already cheap. Consider throttling for continuous telemetry and autocomplete that benefits from periodic updates.

Success signals: fewer requests per query, no stale-result overwrite, and no loss of perceived responsiveness.

### Streaming

Send the shell early, then reveal independently useful regions as data or rendering completes. Give each delayed region a reserved fallback and an error boundary.

Preserve reading and focus order. Avoid streaming tiny fragments that cause visual churn. Prioritize above-the-fold and user-blocking content.

Success signals: earlier first useful content, stable regions, and isolated failure recovery.

## 2. Tactile and feel-good patterns

### Spring physics

Use for direct manipulation, drawers, reordering, selection, and spatial state changes. Choose stiffness, damping, and mass to match the object's implied weight. Stop motion at a clear resting state.

Reduced-motion mode should remove overshoot and shorten the transition. Avoid springs for progress indicators or precise time communication.

### Drag to dismiss

Track pointer position outside framework state when possible. Apply resistance in the invalid direction. Decide dismissal from both distance and release velocity. Snap back with a spring when the threshold is not met.

Constrain gesture direction, avoid stealing page scroll, and provide an explicit close control plus Escape support for dialogs.

### Command palette

Open with Cmd/Ctrl + K, focus the search input, filter commands, support arrow navigation and Enter, and restore focus on close. Include Escape and a visible trigger for discoverability.

Use clear action names. Separate navigation from destructive actions and require confirmation for dangerous commands.

### Layered shadows

Combine a tight contact shadow, a medium ambient shadow, and a softer directional shadow. Tint shadows toward the surrounding surface. Keep shadow strength consistent with elevation.

Do not apply three-layer shadows to every container. Flat grouping is often clearer.

### Noise texture

Apply a faint raster or SVG noise texture to a fixed, non-interactive decorative layer. Keep opacity low enough that text remains clear. Avoid animating the noise.

Test for mobile GPU cost and dark-mode banding. Noise must not conceal compression or contrast problems.

### Toast and inline status

Use toasts for transient confirmation that does not require a decision. Keep messages short and announce them through one polite live region. Remove them after enough reading time or allow dismissal when content matters.

Use inline status for autosave and inline errors for correction. Never put the only explanation of a persistent error in a disappearing toast.

## 3. Combination recipes

- Feed: skeleton, reserved media, optimistic reactions, virtual list for very long history.
- Search: immediate local pending state, debounce, cancellation, streamed or progressively revealed results.
- Article page: server shell, streaming sections, reserved image ratio, blur-up media, intent prefetch for next article.
- Mobile sheet: spring entry, drag-to-dismiss, velocity threshold, explicit close, toast only for completed non-critical actions.
- Keyboard-heavy tool: optimistic reversible commands, command palette, inline autosave status, toast for completed background work.

## 4. Patterns to avoid

- Spinners for large structured content.
- Skeletons whose geometry does not match the final content.
- Shimmer on every loading control.
- Optimistic success that cannot be rolled back.
- Prefetching the entire navigation graph.
- Debounce without stale-response protection.
- Streaming that shifts already-readable content.
- Spring animation on every hover and click.
- Gesture-only dismissal.
- Toasts for validation, authentication, or permanent failure.
- Shadows used as decoration without elevation hierarchy.
- Animated noise or filters on scrolling containers.
