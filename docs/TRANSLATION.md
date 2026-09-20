# Punjabi edition

Punjabi is the **second most common mother tongue in Brampton at 21.7%** and the
most common language spoken at home (2021 Census). This is a primary edition, not
a bolt-on.

## How it is built
- **Build-time, not a widget.** Strings live in `web/src/i18n/{en,pa}.json` and are
  compiled into a separate static site at `/pa/`. No on-the-fly machine translation:
  it is slow, unindexable, and legally risky for quotes.
- **Type.** Newsreader has zero Gurmukhi coverage. The `pa` locale switches to
  Noto Serif / Noto Sans Gurmukhi with taller line-height, driven by `html[lang="pa"]`
  in `globals.css`.
- **Key parity is enforced** — see the parity check in the build notes. `pa.json`
  must have exactly the same keys as `en.json`.
- **Status is visible.** Until a Punjabi-speaking editor signs off, `REVIEWED.pa`
  stays `false` and every page shows the amber translation-status banner.

## The hard part is the glossary, not the plumbing
*Ward, levy, regional councillor, trustee, advance poll* have no settled Punjabi
form. Machine translation invents a different word each time and confuses readers.
`web/src/i18n/glossary.json` records the decision per term: translated,
transliterated, or shown bilingually.

**Budget for a one-time ~250-term terminology pass** by a Punjabi-speaking Brampton
resident or a Punjabi Post / Parvasi journalist. It becomes a permanent asset and is
worth publishing on its own — nobody has one.

## Resolved
- **Masthead.** Was **ਨੋ ਬਰੈਂਪਟਨ**, a phonetic transliteration of "Know" that carried
  none of its meaning. Now **ਜਾਣੋ ਬਰੈਂਪਟਨ** — *jaano*, the imperative "know". The
  Punjabi name now says the same thing as the English one instead of just sounding
  like it. This is exactly the class of error machine translation makes and a
  speaker catches.

## Known issues for the review pass
- All body copy is machine-drafted and unreviewed.
- Numerals render as Western Arabic (1, 2, 3) rather than Gurmukhi digits, which
  matches how Punjabi Canadian media writes them. Confirm with the reviewer.

## Script
Gurmukhi is correct for Brampton (25.1% of residents are Sikh). Shahmukhi
(Arabic-script Punjabi) exists among Pakistani Punjabi speakers — noted, not built.
