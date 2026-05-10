# Baggies App — AI Context

## Project Overview
A private, closed-circuit web app for Mt. Albert Ponsonby Baggies — a social football club in Auckland, NZ. Used by players, coaches, and admin to manage availability, match results, team news, and banter.

## Tech Stack
- [Fill in once decided — e.g. Swift / SwiftUI for iOS, or React + Node for web]

## Core Features
- Availability / RSVP tracker
- Team news & match updates
- Stories feed
- Player profiles & stats
- (Coming soon) Fines system, fantasy league

## File Structure
[Fill in once scaffold is created]

## How to Run
[Fill in once dev environment is set up]

## Conventions
- Branch naming:
    feature/   → new functionality       e.g. feature/player-profiles
    fix/       → bug fixes               e.g. fix/rsvp-not-saving
    chore/     → maintenance & config    e.g. chore/update-dependencies
    docs/      → documentation only      e.g. docs/update-readme
    test/      → test additions only     e.g. test/rsvp-spec-shells
- Commits: descriptive present tense (e.g. "Add RSVP confirmation handler")
- Tests: written in SpecKit using BDD describe/it structure
- Every new feature needs a SpecKit test shell before code is written

## Things to Avoid
- No hardcoded player data
- No public-facing endpoints without auth