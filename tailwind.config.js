const colors = require("tailwindcss/colors");

module.exports = {
  content: ["pages/*.js", "components/*.js"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.trueGray,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
