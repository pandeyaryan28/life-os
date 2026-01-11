/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                system: {
                    blue: '#00aaff',
                    dark: '#0a0a0a',
                    panel: '#111111',
                    border: '#333333',
                    text: '#e0e0e0',
                    gold: '#ffd700',
                    danger: '#ff4444',
                }
            },
            fontFamily: {
                mono: ['"JetBrains Mono"', 'monospace'],
                sans: ['"Inter"', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
