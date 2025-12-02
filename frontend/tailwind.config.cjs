/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#F6B800',
                'primary-dark': '#D49B00',
                secondary: '#30348C',
                'secondary-dark': '#24276C',
            }
        },
    },
    plugins: [],
}
