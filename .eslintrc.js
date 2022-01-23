module.exports = {
  env: {
    es6: true,
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  rules: {
    "default-case": "off",
    "global-require": "off",
    "prefer-destructuring": "off",
    "prettier/prettier": "error",
    "import/no-dynamic-require": "off",
    "import/no-unresolved": "off"
  }
};
