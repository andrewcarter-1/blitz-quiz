# Cooper Quiz – Google Drive helper setup

One-time setup, about 3 minutes, easiest on a laptop. Use the Google account that should own the **Cooper Quiz** folder.

1. Go to **script.google.com** → **New project**. Name it `Cooper Quiz Drive`.
2. Delete everything in the editor and paste in all of [`Code.gs`](Code.gs).
3. On the line `const PASSCODE = 'CHANGE-ME';` replace `CHANGE-ME` with your family passcode (keep the quotes). Press **Ctrl/Cmd + S** to save.
4. In the toolbar's function dropdown pick **setup**, then click **Run**.
   Google asks for permission: **Review permissions** → choose the account → **Advanced** → **Go to Cooper Quiz Drive (unsafe)** → **Allow**.
   (The "unsafe" warning appears for any personal script that hasn't been through Google's review. The script only runs in your account.)
   This creates the **Cooper Quiz** folder in Drive.
5. Click **Deploy** → **New deployment** → gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   Click **Deploy** and copy the **Web app URL** (ends in `/exec`).
6. Send that URL to Claude (it gets added to the site). It is safe to share: nothing works without the passcode.

On each device: open the quiz site → **Create or host a quiz** → **☁ Connect Google Drive** → enter the passcode.

**Changing the passcode later:** edit the line in the script, save, then **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**. Each device will ask for the new passcode.
