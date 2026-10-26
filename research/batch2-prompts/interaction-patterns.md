---
id: interaction-patterns
title: Interaction patterns reference
version: 1
---
Build an interaction reference page for Tern Notes, a fictional note-taking app. The product team uses the page to check how each interface component behaves when someone uses it. Each component below has its own labeled section with the content given, and each one must work as described.

## Sections and content

1. **Header.** Wordmark "Tern Notes". Page title "Interaction patterns". Links to each section below: Buttons, Tooltips, Menu, Tabs, Accordion, Dialog, Side panel, Toast, Switch and segmented control, Task list. On small screens the links must still be reachable.

2. **Buttons.** Four buttons: "New note" (primary), "Share" (secondary), "Archive" (secondary), "Delete note" (destructive). Each can be pressed with a mouse, a finger or the keyboard.

3. **Tooltips.** A toolbar of five icon buttons: Bold, Italic, Link, Checklist, Attach file. Each button shows its name in a tooltip when it is hovered or focused.

4. **Menu.** A "More actions" button that opens a menu with the items Duplicate, Move to notebook, Export as PDF, Pin to top. Choosing an item closes the menu. Clicking elsewhere closes it. Pressing Esc closes it and returns focus to the button.

5. **Tabs.** Three tabs: Notes, Shared with me, Archive. Selecting a tab shows its panel. Each panel lists three sample notes (title, date, one-line preview) that you write.

6. **Accordion.** Four items with these headings: "How is my data backed up?", "Can I work offline?", "How do I share a notebook?", "What happens when I delete a note?". Each answer is one or two sentences that you write. Several items can be open at the same time.

7. **Dialog.** A "Delete note" button opens a dialog titled "Delete this note?" with the text "The note will be removed from all your devices." and the buttons "Cancel" and "Delete". Cancel, Delete, Esc and a click outside the dialog all close it. Focus moves into the dialog when it opens and back to the button when it closes.

8. **Side panel.** A "Note details" button opens a panel from the right edge of the page with these rows: Created "12 Oct 2026", Last edited "17 Oct 2026", Words "842", Notebook "Field research". The panel has a close button.

9. **Toast.** A "Save changes" button shows the message "Changes saved" in a toast. The toast disappears by itself after a few seconds and can also be dismissed.

10. **Switch and segmented control.** A switch labelled "Sync over mobile data" and a segmented control labelled "Sort by" with the options Date, Title, Size. Changing either one updates the text beside it: "Sync over mobile data: on" or "off", and "Sorted by Date", "Title" or "Size".

11. **Task list.** Four tasks: "Draft meeting notes", "Review shared notebook", "Archive old drafts", "Export Q3 research". Each has a checkbox and a remove button. An input labelled "Add a task" with an "Add" button puts a new task at the end of the list. Checking a task marks it as done. Removing a task deletes it.

12. **Footer.** Copyright line "© 2026 Tern Notes".

## Output requirements

- Write exactly one file named `index.html` in the current working directory. Put all HTML, CSS and JavaScript in that file.
- Do not reference remote images. Any images, icons or illustrations must be inline SVG or CSS.
- You may load fonts from Google Fonts and JavaScript or CSS libraries from well-known public CDNs (for example cdnjs, jsDelivr or unpkg).
- The page must work when `index.html` is opened directly from disk, and it must be usable at both desktop (1440px wide) and mobile (390px wide) viewport widths.
- All visible text is in English. Use the names, numbers and copy given above; write any additional copy a section needs.
- Do the whole task in one pass. Do not ask questions; make your own decisions and finish with the file written.
