const LightConfig = {
  ambientLight: {
    color: 0xffffff,
    intensity: 1.5,
  },
  directionalLight: {
    color: 0xffffff,
    intensity: 1.7,
    shadows: {
      enabled: true,
      helper: false,
      mapSize: {
        width: 2048,
        height: 2048,
      },
      camera: {
        near: 1,
        bias: -0.001,
        sizeCoefficient: 1.6,
      },
    },
  }
}

export { LightConfig };
