/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'medical-teal': '#3AAFA9',
                'medical-teal-dark': '#2B7A78',
                'medical-teal-light': '#6FD4D1',
                'medical-cyan': '#17BEBB',
                'medical-bg-start': '#7FE3DF',
                'medical-bg-end': '#2B7A78',
                'medical-dark': '#2B7A78',
                'medical-light': '#DEF2F1',
                'medical-accent': '#FEFFFF',
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'medical-gradient': 'linear-gradient(135deg, #7FE3DF 0%, #3AAFA9 50%, #2B7A78 100%)',
                'medical-card': 'linear-gradient(135deg, #FEFFFF 0%, #DEF2F1 100%)',
            },
        },
    },
    plugins: [],
}
