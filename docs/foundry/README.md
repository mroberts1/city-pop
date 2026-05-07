# Foundry v2 — reference docs

`/root/city-pop` is a SvelteKit web app, not a wiki. These files are reference for if/when a companion City Pop **Foundry vault** gets scaffolded (separate from this repo).

## Contents

- `MANIFEST.v2-reference.md` — the Foundry v2 MANIFEST from the generative-art vault. Defines a full agent-run Obsidian-compatible wiki structure: `inbox/` → `sources/` → `wiki/`, with source tiering, conflict handling, freshness/re-ingest, pruning, voice anchor, query→concept promotion, sibling-vault linking, and an eval loop.
- `eval.md` — domain-tailored evaluation questions for a City Pop wiki (13 questions covering definition, lineage, adjacent aesthetics like Wamono and jazz kissa, craft, contested territory, and cross-vault linking to interasia-pop).
- `eval-usage.md` — explains what the eval questions are for and how the `/foundry-eval` loop works.

## Scaffolding a City Pop vault (when you're ready)

The short version:

```
mkdir -p ~/city-pop-wiki/{inbox,sources,wiki/_meta}
cp ~/city-pop/docs/foundry/MANIFEST.v2-reference.md ~/city-pop-wiki/MANIFEST.md
cp ~/city-pop/docs/foundry/eval.md ~/city-pop-wiki/wiki/_meta/eval.md
cp ~/city-pop/docs/foundry/eval-usage.md ~/city-pop-wiki/wiki/_meta/eval-usage.md
cd ~/city-pop-wiki
# create empty wiki/_meta/index.md and wiki/_meta/log.md
# then init git and push
```

See `MANIFEST.v2-reference.md` "Directory structure" section for the full layout.

## Relationship to this web app

A future City Pop Foundry vault would be the **source of authority** for factual content — artist bios, genre boundaries, historical claims. The SvelteKit app in this repo would then consume from the wiki (copy-paste, scripted export, or eventual direct JSON ingest). That's the intended division of labor: wiki = research & curation, app = presentation.
