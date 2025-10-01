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
    const g = this.add.graphics();
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
            scene.wave = new SineWave(this, 0, 0, {
              amplitude: 60,
              frequency: 0.025,
              speed: 0.002,
              color: 0xff66cc
            });
          }
        });
      }
    });

    this.score = this.add.text(15, 15, "0")

  },

  update(time, delta) {
    if (this.wave)
      this.wave.update(delta);
  }
});
