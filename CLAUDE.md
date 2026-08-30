# cnation DOMINION

## Versioning

The title screen shows a version number (`index.html` and `pc/index.html`, in the
`.title-version` span next to the game title, e.g. "Version 1.1.13" / "Version 1.1.13 PC").
(Root `index_pc.html` is now just a redirect stub to `./pc/` — don't bump its version, it has none.)

**Bump the patch (third) digit by 1 in both files whenever you commit a code/content change**,
even a small one. Keep the two files' version numbers in sync (PC just adds " PC" after the same
number). Don't bump for a change that doesn't touch what ships (e.g. scratch/test files, chat-only
answers).

Bump the minor (second) digit and reset the patch digit to 0 only when the user explicitly says
this change counts as a bigger version bump — don't decide that on your own.
