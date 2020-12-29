import Tin from "../lib/index";

const tin = new Tin({
  bounds: [
    [100, 50],
    [150, 150],
    [150, 200],
    [60, 190],
    [50, 100]
  ],
  strictMode: Tin.MODE_STRICT
});
tin.setPoints([
  [
    [80, 90],
    [160, -90]
  ],
  [
    [120, 120],
    [240, -120]
  ],
  [
    [100, 140],
    [200, -140]
  ],
  [
    [130, 180],
    [260, -180]
  ],
  [
    [70, 150],
    [140, -150]
  ]
]);
tin.updateTinAsync().then(() => {
  console.log(tin.transform([140, 150])); // 277.25085848926574, -162.19095375292216
  console.log(tin.transform([277.25085848926574, -162.19095375292216], true)); // 140, 150
});
