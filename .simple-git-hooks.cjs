module.exports = {
  "pre-commit": "pnpm exec nano-staged",
  "commit-msg": "pnpm exec commitlint --edit ${1}"
};
