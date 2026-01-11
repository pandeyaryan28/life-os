# Deployment Guide: Hosting Life OS on Vercel

To host your app for free and bypass `npm run dev`, follow these steps:

## Prerequisites
1.  **GitHub Account**: You need a GitHub account to store your code.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com) using your GitHub account.

## Step 1: Push to GitHub
1.  Create a new private repository on GitHub named `life-os`.
2.  In your terminal (inside the `Gamification` folder), run:
    ```bash
    git init
    git add .
    git commit -m "Initialize Life OS with PWA"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/life-os.git
    git push -u origin main
    ```
    *(Replace `YOUR_USERNAME` with your actual GitHub username)*

## Step 2: Connect to Vercel
1.  Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New"** > **"Project"**.
3.  Import the `life-os` repository you just created.
4.  Vercel will automatically detect that it's a Vite project.
5.  Click **"Deploy"**.

## Step 3: Use the App
1.  Once deployed, Vercel will give you a URL (e.g., `life-os-abc.vercel.app`).
2.  Open this URL in your browser.
3.  **To Install**: Look for the "Install" or "Add to Home Screen" icon in the address bar.
4.  Once installed, you can open "Life OS" directly from your desktop or phone without ever touching the terminal again!

> [!TIP]
> **Automatic Updates**: Every time you push new code to your GitHub repository, Vercel will automatically rebuild and update your hosted app.
