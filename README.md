# OceanicVibes

Static GitHub Pages site for OceanicVibes freediving instruction.

## Instructor editing

1. Open `admin.html` locally or on the published site.
2. Enter the password configured at the top of `admin.js` (`oceanic2026` by default).
3. Edit homepage copy and add training sessions for either Playa del Carmen or Bacalar.
4. Download the content JSON backup.
5. Replace `content.json` in this repository with the downloaded file and commit it to GitHub.

The public site reads `content.json` from GitHub Pages. Git history provides backups and versioning, so no database or hosted data service is required. The admin password is only a convenience gate; static GitHub Pages cannot provide server-side authentication.
