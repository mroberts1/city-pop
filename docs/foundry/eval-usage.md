Type: #type/meta
Area: #area/generative-art
Date created: [[2026-05-07]]

---

# What the eval questions are for

Short version: the questions in `eval.md` are a measuring stick, not a to-do list. You don't answer them manually. Claude answers them, on demand, and rates its own answers. The ratings tell you whether the vault is getting better.

## The loop, concretely

1. **Ingest stuff into the vault** — drop papers, articles, transcripts into `inbox/`. Claude processes them into `sources/` and `wiki/`.

2. **Every few months, or whenever you're curious, run `/foundry-eval`.** Claude:
   - Takes each of the 10 questions in `eval.md`
   - Tries to answer each one using only wiki pages (not raw sources directly)
   - Rates its own answer: `strong` / `thin` / `missing`
   - Writes the answers and ratings into the "Latest run" section of `eval.md`
   - Feeds the `thin` and `missing` findings into `index.md` as Open Questions and Candidates

3. **Read the answers.** Two things happen:
   - **Trend tells you if the wiki is improving.** If Q1 was `missing` six months ago and `thin` now and `strong` next quarter, the vault is maturing. If everything stays `missing` for a year, ingest has drifted away from the domain.
   - **Thin/missing findings tell you what to ingest next.** If Q4 (first-gen computer art) is still `missing` after a year, that's a clear signal: go find a Nake/Nees/Molnar source and put it in the inbox.

That's it. It's a feedback loop for you, not homework.

## Why it's structured this way

Without an eval, wikis rot in a predictable way: you ingest whatever crosses your desk, the vault gets bigger but not more useful, and you can't tell. The lint stats (page count, orphans, keyword drift) are quantitative and don't catch *quality* drift. Eval questions are the qualitative counterweight.

The expected-rating line on each question ("Expected early rating: missing") is there so the *first* run has a baseline. If the first eval comes back better than expected, great. If it comes back worse, something's wrong with how the MANIFEST is being applied.

## A concrete example

Say in three months you've ingested 15 more sources. You run `/foundry-eval`. It comes back:

- Q1 (definition): `strong` — 3 sources now, Galanter + Boden + McCormack
- Q4 (first-gen computer art): `thin` — have Nake and Molnar, missing the US side
- Q7 (algorithmic families): `missing` — still nobody's written about L-systems vs CA vs flow fields
- Q10 (AI controversy): `thin` — have one essay each from two sides, no proper Contested concept yet

That output *is* your research agenda for the next quarter. Go find a US computer-art source for Q4. Commission a concept page on algorithmic families for Q7. Dig up a second essay on each side of Q10 and mark the concept `Contested: true`.

## When to actually run it

**Not yet.** With only a handful of sources, running eval would produce mostly "missing" ratings you already expect. First useful run is after maybe 10-15 sources, probably 2-3 months in.

## How to add or change questions

- **Don't reorder or renumber existing questions** — that breaks comparability across runs.
- **Add new questions at the bottom** with a new number.
- **Retiring a question**: strike it through but leave it in place, so old-run comparisons still make sense.
- **Expected early ratings**: only set these when you first add a question, as a baseline. Don't update them to match reality — the whole point is to measure drift against the original expectation.
