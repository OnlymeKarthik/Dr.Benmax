/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'medical-teal': '#2A9D8F',
                'medical-teal-dark': '#21867a',
                'medical-teal-light': '#4DB6AC',
                'medical-bg-start': '#4FD1C5',
                'medical-bg-end': '#2C7A7B',
                'medical-dark': '#264653',
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
