// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      primary: '#1890ff',
      disabled: 'rgba(0, 0, 0, 0.25)',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
