/** @type {import("prettier").Config} */
export default {
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "lf",
  
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "^@/(assets|api|auth|components|constants|content|context|hooks|lib|pages|routes|services|stores|styles|templates|types|validations|ui|utils)/?(.*)$",
    "^@/(.*)$",
    "^[./]",
  ],
  
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
};