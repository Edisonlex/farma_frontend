export default [
  { ignores: [".next/**", "node_modules/**"] },
  {
    files: ["src/**/*.{ts,tsx}", "**/*.{js,jsx,mjs}", "app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parser: (await import("@typescript-eslint/parser")).default,
    },
    rules: {},
  },
];