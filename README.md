# Perceived Performance UI

A Codex skill for designing, implementing, and auditing web interfaces that feel fast, responsive, and tactile.

It helps Codex select the smallest suitable set of perceived-performance and interaction patterns for a real user moment, implement complete state cycles, and verify accessibility and failure behavior.

## Included patterns

### Perceived performance

- Skeleton screens with restrained shimmer
- Optimistic UI with rollback
- Blur-up image loading
- Intent-based prefetching
- Virtualized long lists
- Debounced search with stale-response protection
- Streaming and progressive rendering

### Tactile interaction

- Spring physics
- Drag to dismiss with distance and velocity thresholds
- Command palettes
- Layered shadows
- Subtle noise texture
- Toast and inline save feedback

## Install

Copy the skill directory into the Codex skills folder:

```bash
mkdir -p ~/.codex/skills
cp -R perceived-performance-ui ~/.codex/skills/
```

Open a new Codex task after installation so the skill list refreshes.

## Use

Invoke the skill explicitly:

```text
$perceived-performance-ui Improve the loading and interaction feedback in this React application.
```

Additional examples:

```text
$perceived-performance-ui Audit this feed and explain why it feels slow.

$perceived-performance-ui Add optimistic reactions with rollback and accessible status feedback.

$perceived-performance-ui Build an interactive learning page that demonstrates every included pattern.
```

The skill can also be selected automatically for requests involving slow-feeling interfaces, loading states, perceived latency, responsive feedback, or tactile web interactions.

## Interactive demo

The English playground contains 13 working demonstrations. Open [`assets/playground/index.html`](assets/playground/index.html) directly or serve it locally from the skill directory:

```bash
python3 -m http.server 4173 --directory assets/playground
```

Then open `http://127.0.0.1:4173`.

The playground supports narrow screens, dark mode, keyboard navigation, touch input, failure simulation, and reduced-motion preferences.

## Structure

```text
perceived-performance-ui/
├── SKILL.md
├── README.md
├── agents/
│   └── openai.yaml
├── assets/
│   └── playground/
│       ├── index.html
│       ├── script.js
│       └── styles.css
└── references/
    ├── implementation-guardrails.md
    └── pattern-catalog.md
```

- `SKILL.md` contains the core workflow, routing table, and required behavior.
- `references/pattern-catalog.md` explains when to use or avoid each pattern.
- `references/implementation-guardrails.md` defines state, accessibility, performance, and testing requirements.
- `assets/playground/` is a teaching prototype, not a production component library.

## Design principles

- Fix actual performance problems before masking them with animation.
- Select patterns from user needs, not from a feature checklist.
- Implement idle, pending, success, empty, error, retry, rollback, and cancellation states when applicable.
- Preserve keyboard focus and screen-reader meaning across state changes.
- Respect reduced motion and data-saving preferences.
- Never use fake progress or optimistic success for high-risk irreversible operations.

## Validate

Run the Codex skill validator:

```bash
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py .
```

The skill repository is initialized with Git. Create the first commit when you are ready to establish a baseline.
