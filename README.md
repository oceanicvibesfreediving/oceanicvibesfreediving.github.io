# OceanicVibes

Static GitHub Pages site for OceanicVibes freediving instruction.

## Instructor editing

1. Open `admin.html` on the published site.
2. Enter the password configured at the top of `admin.js` (`oceanic2026` by default).
3. Edit homepage copy and add training sessions for either Playa del Carmen or Bacalar.
4. Select **Save website content**.
5. Use **Download backup** to save the content JSON somewhere safe.

Content is stored in the browser's `localStorage`, so it updates the public page in that same browser/device. A static GitHub Pages site cannot share edits with every visitor or provide real server-side password protection. For shared, cross-device editing, connect the same fields to a hosted database/auth provider such as Supabase or Firebase.
