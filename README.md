# My Project — Thrift Store

A small static demo thrift-store website.

## How to use (local)
1. Open this folder in VS Code.
2. Create the files as provided (index.html, css/styles.css, js/script.js).
3. Put some images into the `images/` folder (names used in demo: denim.jpg, bag.jpg, watch.jpg, shirt.jpg) or update `js/script.js` data.
4. Option A — use Live Server extension in VS Code (recommended):
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

5. Option B — use npm dev server:
   - If you created `package.json`, run:
     npm install
     npm run start
   - The site will open on a local URL.

## Pushing to GitHub
- Use the GitHub CLI (`gh`) or the `create_and_push.sh` script I provided earlier.
- I will not ask for your token in chat — run push commands in your terminal locally.
- After pushing, remove tokens from env and revoke PAT if you used it.

## Notes
- This is a simple demo template; edit product list in `js/script.js` and styles in `css/styles.css`.
- If you want a backend, tell me and I’ll give a Node/Express template instead.