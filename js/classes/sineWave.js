class SineWave extends Phaser.GameObjects.Graphics {
  constructor(scene, x, y, config = {}) {
    super(scene, { x, y });

    this.config = Object.assign(
      {
        amplitude: 50,
        frequency: 0.02,
        speed: 0.01,
        color: 0x00ffcc,
        lineWidth: 2,
        width: scene.sys.game.config.width - 380,
        height: scene.sys.game.config.height,
      },
      config
    );

    this.offset = 0;
    this.startX = 900;
    this.circleCount = 0;
    this.wavelength = (2 * Math.PI) / this.config.frequency;
    const pixelsToTravel = 900 - 100; // distance startX moves
    const msPerWavelength = 1000;     // one full sine wave every 1s
    const duration = (pixelsToTravel / this.wavelength) * msPerWavelength;

    scene.tweens.add({
      targets: this,
      startX: 100,
      duration: duration,
      ease: "Linear",
    });

    scene.add.existing(this);

  }

  update(delta) {
    this.offset += this.config.speed * delta;

    this.clear();

    // Draw sine wave
    this.lineStyle(this.config.lineWidth, this.config.color, 1);
    this.beginPath();

    const endX = 900;
    const startX = this.startX;
    const peaks = []; // store peak points

    for (let x = startX + 1; x <= endX; x++) {
      const sineY = Math.sin(x * this.config.frequency + this.offset);
      const y = this.config.height / 2 - this.config.amplitude * sineY; // inverted

      if (x === startX + 1) this.moveTo(x, y);
      else this.lineTo(x, y);

      // Detect peaks (max of sine)
      // For max, check if sineY is greater than previous and next (simple discrete check)
      if (x > startX + 1) {
        const prevSineY = Math.sin((x - 1) * this.config.frequency + this.offset);
        const nextSineY = Math.sin((x + 1) * this.config.frequency + this.offset);
        if (sineY > prevSineY && sineY > nextSineY) {
          peaks.push({ x, y });
        }
      }
    }

    this.strokePath();

    if (this.circleCount > peaks.length) { 
      stats.score++; 
      scene.score.setText(stats.score)
      scene.emitDebris(100, GAME_HEIGHT / 2 - this.config.amplitude, {tint: [this.config.nodeColor, this.config.color]}) 
    } 
    this.circleCount = peaks.length

    // Draw circles at peaks
    this.fillStyle(this.config.nodeColor, 1);
    peaks.forEach((p) => {
      this.fillCircle(p.x, p.y, 7);
    });
  }
}
