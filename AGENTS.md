# REMAGO Frontend — Codex Instructions

## Goal
Build and refine the REMAGO website as a production-quality frontend.
Pixel accuracy and fidelity to the provided Figma design are the highest priority.

## Stack
- React
- TypeScript
- Vite
- CSS
- No backend unless explicitly requested
- Do not introduce new frameworks unless necessary

## Working style
- Act as a senior frontend engineer.
- Inspect existing code before changing anything.
- Prefer editing existing components over rewriting the whole project.
- Do not change unrelated parts of the site.
- Do not remove working functionality unless explicitly requested.
- Reuse existing assets whenever possible.
- Keep components readable and maintainable.
- Avoid unnecessary abstractions and overengineering.

## Figma fidelity
When implementing a Figma reference:
- Match layout, spacing, typography, sizing, borders, shadows and positioning as closely as possible.
- Do not invent new visual elements.
- Do not simplify the design for convenience.
- Preserve image aspect ratios.
- Check desktop and mobile behavior.
- If something is genuinely ambiguous, ask one concise question instead of guessing.

## RTV
RTV cards must support:
- desktop: flip on hover
- mobile/touch: flip on tap
- backside prepared for video playback
- do NOT add real video sources until explicitly requested

## Efficiency
- Do not repeatedly scan the entire repository.
- First inspect only files relevant to the task.
- Use targeted searches.
- Avoid dumping large files into the conversation unless needed.
- Avoid long explanations.
- Make changes directly.
- Group related edits into one pass.
- Do not narrate every trivial action.

## Verification
After changes:
1. run the relevant build/typecheck
2. fix errors caused by your changes
3. check imports and asset paths
4. verify responsive behavior where relevant

For frontend-wide changes run:
npm run build

## Response style
After finishing, report only:
- what changed
- files changed
- verification result
- any unresolved issue

Do not provide a long tutorial unless asked.