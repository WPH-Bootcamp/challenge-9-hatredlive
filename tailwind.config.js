module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#05070d',
        surface: '#12151f',
        card: '#181d27',
        slate: {
          950: '#03060f',
        },
        primary: '#ffffff',
        rose: {
          500: '#E41D02',
          600: '#C91808',
        },
        amber: {
          400: '#FBBF24',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 60px rgba(0, 0, 0, 0.35)',
      },
    },
  },
};
