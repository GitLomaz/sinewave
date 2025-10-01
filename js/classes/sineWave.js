class SineWave extends Phaser.GameObjects.Graphics {
  constructor(scene, x, y, config = {}) {
    super(scene, { x, y });

    // Merge defaults with passed config
    this.config = Object.assign(
      {
        amplitude: 50,
        frequency: 0.02,
        speed: .01,
        color: 0x00ffcc,
        lineWidth: 2,
        width: scene.sys.game.config.width - 380,
        height: scene.sys.game.config.height,
      },
      config
    );

    this.offset = 0;

    this.startX = 900;

    // Create timer to move startX from 200 to 100
    scene.tweens.add({
      targets: this,
      startX: 100,
      duration: 2000, // 2 seconds
      ease: 'Linear'
    });


    scene.add.existing(this);
  }

  update(delta) {
    this.offset += this.config.speed * delta;

    this.clear();
    this.lineStyle(this.config.lineWidth, this.config.color, 1);

    this.beginPath();
    const endX = 900;

    for (let x = this.startX; x <= endX; x++) {
      let y =
        this.config.height / 2 +
        this.config.amplitude *
          Math.sin(x * this.config.frequency + this.offset);

      if (x === this.startX) {
        this.moveTo(x, y);
      } else {
        this.lineTo(x, y);
      }
    }

    this.strokePath();
  }
}
