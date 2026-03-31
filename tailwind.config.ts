import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
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
};

export default config;
