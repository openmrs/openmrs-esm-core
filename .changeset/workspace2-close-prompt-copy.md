---
"@openmrs/esm-styleguide": patch
"@openmrs/esm-translations": patch
---

Improve the Workspace2 unsaved-changes confirmation modal. The title is now "Discard unsaved changes?", the body states that closing will discard the changes and distinguishes the single-workspace case (bolded workspace title inline) from the multiple-workspace case (count plus a bolded list), and the secondary action is "Keep editing" instead of "Cancel". The modal now uses the small Carbon size. The `closeWorkspaces2PromptTitle` and `closeWorkspaces2PromptBody` core translation keys are replaced by `discardUnsavedChangesPromptTitle`, `discardUnsavedChangesPromptBodySingle`, `discardUnsavedChangesPromptBodyMultiple`, and `keepEditing`.
