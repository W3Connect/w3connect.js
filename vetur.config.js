/** @type {import('vls').VeturConfig} */
module.exports = {
  settings: {
    "vetur.useWorkspaceDependencies": true,
    "vetur.experimental.templateInterpolationService": true,
  },
  projects: [
    {
      root: "./packages/ui",
      tsconfig: "./tsconfig.json",
    },
  ],
};
