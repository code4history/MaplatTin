module.exports = {
  verbose: true,
  preset: 'ts-jest/presets/js-with-babel',
  transform: {
    "^.+\\.ts$": "ts-jest",
    "delaunator": "babel-jest",
    "constrainautor": "babel-jest",
    "robust-predicates": "babel-jest"
  },
  "transformIgnorePatterns": ["/node_modules/(?!(delaunator|@kninnug/constrainautor|robust-predicates)/)"]
};
