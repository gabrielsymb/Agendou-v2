module.exports = {
  plugins: [
    // usa o plugin PostCSS separado do Tailwind
    require("@tailwindcss/postcss"),
    require("autoprefixer"),
  ],
};
