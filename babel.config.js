module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: 3,
        targets: {
          browsers: ["defaults", "ie 11"]
        }
      }
    ],
    "@babel/preset-typescript"
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties"
  ],
  env: {
    test: {
      presets: [
        ["@babel/preset-env", {
          targets: {
            node: "current"
          }
        }]
      ]
    }
  }
}
