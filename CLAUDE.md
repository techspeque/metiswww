# CLAUDE.md

This repository is governed by `AGENTS.md`. Read it now.
Run `metis kickoff` immediately at session start. No other action first.

Identity: state your model; it must match the `agent_slug` field of
`metis next -o json`.

Exception: if the human explicitly assigned you a PLANNING task (producing a
plan or ADRs), skip kickoff — planning is the Human role's delegation. Use
OVERVIEW.md and the templates in `.metis/templates/`, and validate plans
with `metis seed <plan> --dry-run` before handing back.
