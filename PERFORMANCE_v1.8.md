# LIFE OS v1.8.0 — Performance & Core Web Vitals Optimization

This update upgrades LIFE OS to v1.8.0 with a focus on critical rendering path optimization, LCP reduction, and bundle size management.

## 🚀 Key Improvements

### 1. Zero Render-Blocking Resources
- **Razorpay SDK**: Removed from `index.html`. Now loads dynamically **only** when a user initiates a payment.
  - *Impact*: Saves ~200KB from initial load.
- **Google Fonts**: Removed external stylesheet. Switched to self-hosted fonts via `@fontsource/inter` and `@fontsource/jetbrains-mono`.
  - *Impact*: Eliminates 2 round-trips for font CSS and WOFF2 files. Fonts load instantly from same-origin cache.
- **Service Worker**: Registration is now deferred until `window.onload`.
  - *Impact*: Main thread is free for initial UI rendering.

### 2. Intelligent Code Splitting
- **Route-Based Splitting**: Each page (Dashboard, Goals, etc.) is now a separate JS chunk loaded on demand.
- **Vendor Splitting**: 
  - `vendor-react`: Core runtime
  - `vendor-firebase-core`: Auth & App
  - `vendor-firebase-firestore`: Database
  - `vendor-ui`: Framer Motion, Lucide, etc.
- **Analytics Deferral**: Firebase Analytics is removed from the main bundle and loads only during idle time or user interaction.

### 3. Caching & Assets
- **Long-Term Caching**: Static assets (JS/CSS/Fonts) now have `Cache-Control: max-age=31536000, immutable`.
- **Hashed Filenames**: All build assets use content hashing for cache busting.
- **Preconnect**: Optimized to only preconnect to Firebase origins (max 2).

### 4. Build Targets
- **Modern Only**: Build target updated to `es2022`, removing legacy polyfills and reducing bundle size.
- **CSS Minification**: Enabled `esbuild` minification for CSS.

## 📊 Expected Results
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FCP (First Contentful Paint)**: < 1.0s
- **Total Blocking Time**: Significantly reduced due to deferred heavy scripts.
- **Lighthouse Score**: Should be ≥ 95.

## 🛠️ Verification
Run `npm run build` locally to verify the optimized production build.
Serve locally with `npm run preview` to test PWA features.
