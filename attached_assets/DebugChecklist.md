
# 🛠️ ClinicConnect Replit Debug Checklist

✅ **1️⃣ Check Logs**
- Use the "Shell" or "Console" in Replit.
- Run: `npm run dev` (or `npm start` for Express apps).
- Look for errors (e.g., module not found, syntax error, port conflict).

✅ **2️⃣ Check `package.json` Scripts**
- Make sure "start" or "dev" scripts are correct:
  ```json
  "scripts": {
    "dev": "vite",
    "start": "node server.js"
  }
  ```
- If you have separate frontend/backend, consider using "concurrently" to start both.

✅ **3️⃣ Reinstall Dependencies**
```bash
rm -rf node_modules package-lock.json
npm install
```

✅ **4️⃣ Check Environment Variables**
- Go to Replit "Secrets" panel.
- Make sure `DATABASE_URL`, `JWT_SECRET`, and other required env vars are present and correct.
- Restart the app after adding/updating `.env` vars.

✅ **5️⃣ Check Database Connection**
- Make sure your Postgres DB is running and accessible.
- Verify `DATABASE_URL` in the `.env` or Replit secrets.

✅ **6️⃣ Port Conflicts**
- Replit uses port 3000 or 8080 by default.
- In your server file:
  ```ts
  app.listen(process.env.PORT || 3000);
  ```

✅ **7️⃣ Syntax & Module System**
- Errors like `Unexpected token export` → make sure you're using ES modules (`"type": "module"`) or CommonJS (`require`/`module.exports`), not mixed.

✅ **8️⃣ Replit AI Debugging**
- Copy-paste error logs into Replit's AI chat to get targeted fixes!

✅ **9️⃣ Final Steps**
- After fixing, run:
  ```bash
  npm run dev
  ```
- Visit your Replit web preview to verify the app is working.

---

💡 **Pro tip:** Keep this file in your project root as `DebugChecklist.md` for easy reference!
