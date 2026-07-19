# Implementation Guardrails

Use this reference while implementing or validating code.

## Contents

1. State model
2. Timing and feedback
3. Accessibility
4. Performance
5. Testing matrix
6. Reporting

## 1. State model

Model asynchronous UI explicitly. Avoid a single `loading` boolean when the workflow can fail, retry, cancel, or roll back.

Recommended conceptual states:

```text
idle -> pending -> success
            |-> error -> retry -> pending
            |-> cancelled
optimistic -> confirmed
           |-> rollback -> error
```

Keep request identity so an older response cannot overwrite a newer result. Keep mutation identity when offline retry or duplicate prevention matters.

## 2. Timing and feedback

- Acknowledge direct input within 100 ms.
- Avoid showing a loading placeholder for extremely short operations if it would flash.
- If a skeleton appears, keep its replacement visually stable.
- Debounce server-backed typing around 200-350 ms, then tune from observed typing and server latency.
- Base drag dismissal on velocity and distance. Tune thresholds with touch hardware.
- Derive production completion from real request, decode, or stream events. Do not use arbitrary timers except in explicitly labeled demos.

## 3. Accessibility

- Keep labels available during loading.
- Use `aria-busy` for updating regions when useful.
- Announce concise status changes through a polite live region.
- Avoid announcing every skeleton element or streamed fragment.
- Preserve focus across optimistic changes and streamed replacements.
- Provide keyboard equivalents for gestures.
- Support Escape for dismissible modal surfaces.
- Ensure command palettes use dialog semantics, named inputs, visible focus, arrow navigation, Enter, and focus restoration.
- Respect reduced motion by removing overshoot, parallax, shimmer, and unnecessary crossfades.

## 4. Performance

- Animate transform and opacity. Avoid continuous layout-property animation.
- Reserve media width, height, or aspect ratio.
- Avoid framework state for every pointer or scroll frame.
- Clean up timers, observers, event listeners, pending requests, and animation handles.
- Use passive listeners where appropriate, but not when a gesture must prevent scrolling.
- Keep overscan small and adaptive in virtual lists.
- Lazy-load non-critical interaction libraries.
- Measure actual request, render, layout, and interaction cost before and after.

## 5. Testing matrix

Test every relevant cell:

| Dimension | Cases |
|---|---|
| Network | fast, slow, offline, timeout, server error |
| Input | mouse, touch, keyboard, rapid repeat |
| Motion | normal, reduced motion |
| Viewport | narrow mobile, tablet, desktop |
| Theme | light, dark, high contrast when supported |
| Data | empty, one item, typical, huge, malformed |
| Requests | success, failure, cancellation, out-of-order |
| Navigation | cached, uncached, prefetched, back/forward |

For optimistic UI, force failure and confirm rollback. For search, delay an older request so it completes after the newer request. For virtualization, jump to distant indices and inspect rendered node count. For drag dismissal, test slow distance, fast flick, wrong direction, and explicit close.

## 6. Reporting

State:

1. The user moment that felt slow or unsatisfying.
2. The selected pattern and why it matches.
3. Failure, rollback, cancellation, and accessibility behavior.
4. Verification performed.
5. Measured change when metrics are available.

Do not claim that perceived-performance work reduced actual load time unless measurement proves it.
