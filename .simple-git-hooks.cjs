module.exports = {
  "pre-commit": "pnpm dlx nano-staged",
  "commit-msg": "pnpm dlx commitlint --edit ${1}"
};
