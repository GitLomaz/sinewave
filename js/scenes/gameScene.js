let gameScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function gameScene() {
    Phaser.Scene.call(this, {
      key: "gameScene",
    });
  },

  preload: function () {
  },

  create: function () {
    scene = this

    const debrisGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    debrisGraphics.fillStyle(0xffffff, 1);
    debrisGraphics.fillRect(0, 0, 4, 4);
    debrisGraphics.generateTexture('squareParticle', 4, 4);
    debrisGraphics.destroy();
    this.debrisParticles = this.add.particles('squareParticle');

    const g = this.add.graphics();
    scene.waves = [];
    g.lineStyle(4, 0x414141, 1);

    // draw a line from (100,100) to (700,500)
    const line = new Phaser.Geom.Line(900,  GAME_HEIGHT / 2,900,  GAME_HEIGHT / 2);
    this.tweens.add({
      targets: line,
      x1: 100,
      duration: 2000, 
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        g.clear();
        g.lineStyle(4, 0x414141, 1);
        g.strokeLineShape(line);
      },
      onComplete: () => {
        const line2 = new Phaser.Geom.Line(100,  GAME_HEIGHT / 2, 100,  GAME_HEIGHT / 2);
        scene.tweens.add({
          targets: line2,
          y1: GAME_HEIGHT - 100,
          y2: 100,
          duration: 2000, 
          ease: 'Sine.easeInOut',
          onUpdate: () => {
            g.clear();
            g.lineStyle(4, 0x414141, 1);
            g.strokeLineShape(line);
            g.strokeLineShape(line2);
          },
          onComplete: () => { 
            scene.waves.push(new SineWave(waves[0]));
            scene.waves.push(new SineWave(waves[1]));
          }
        });
      }
    });

    this.score = this.add.text(15, 15, "0")

  },

  update(time, delta) {
    this.waves.forEach((wave) => {
      wave.update(delta)
    })
  },

  emitDebris(x, y, options = {}) {
    const defaults = {
      velocity: null,
      speed: {min: 8, max: 13},
      angleBias: 90,
      lifespan: { min: 600, max: 900 },
      quantity: 12,
      tint: [0xffffff, 0xdddddd, 0x888888],
      scale: { start: 1.6, end: 0 },
      alpha: { start: 1, end: 0 },
      blendMode: 'ADD'
    };

    options = { ...defaults, ...options };
  
    let angleDeg = 0;
    let speedBias = Phaser.Math.Between(5, 15);

    const emitter = this.debrisParticles.createEmitter({
      x, y,
      speed: {
        min: speedBias * options.speed.min,
        max: speedBias * options.speed.max
      },
      angle: {
        min: angleDeg - options.angleBias,
        max: angleDeg + options.angleBias
      },
      lifespan: options.lifespan,
      quantity: options.quantity,
      scale: options.scale,
      alpha: options.alpha,
      blendMode: options.blendMode,
      tint: options.tint
    });

    emitter.explode(options.quantity, x, y);
  },
});
