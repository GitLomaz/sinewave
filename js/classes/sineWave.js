class SineWave extends Phaser.GameObjects.Graphics {
  constructor(config = {}) {
    super(scene, { x: 0, y: 0 });
    this.upgradeBox = false;
    this.config = Object.assign(
      {
        amplitude: 50,
        frequency: 0.02, // Adjust frequency to speed things up
        speed: 0.01, // Leave speed alone per color for now
        lineWidth: 2,
        width: GAME_WIDTH - 380,
        height: GAME_HEIGHT,
        index: 0,
        phaseShift: Math.PI / 4 // Default to 45 degrees shift
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
    const factor = this.config.speed * this.config.frequency;
    // maybe .03 as a threshold
    
    this.offset += this.config.speed * delta;

    this.clear();

    // Draw sine wave
    this.lineStyle(this.config.lineWidth, this.config.color, 1);
    this.beginPath();

    const endX = 900;
    const startX = this.startX;
    const peaks = []; // store peak points

    // Draw debug waves in different colors
    
    // Draw main wave in red
    this.lineStyle(2, 0xff0000, 0.5);
    this.beginPath();
    for (let x = startX + 1; x <= endX; x++) {
      const wave1 = Math.sin(x * this.config.frequency + this.offset);
      const y = this.config.height / 2 - this.config.amplitude * wave1;
      if (x === startX + 1) this.moveTo(x, y);
      else this.lineTo(x, y);
    }
    this.strokePath();

    // Draw double frequency wave in blue (with double speed offset)
    this.lineStyle(2, 0x0000ff, 0.5);
    this.beginPath();
    for (let x = startX + 1; x <= endX; x++) {
      const wave2 = 0.7 * Math.sin(2 * x * this.config.frequency + this.offset * 2);
      const y = this.config.height / 2 - this.config.amplitude * wave2;
      if (x === startX + 1) this.moveTo(x, y);
      else this.lineTo(x, y);
    }
    this.strokePath();

    // Draw third wave in green (triple frequency)
    this.lineStyle(2, 0x00ff00, 0.5);
    this.beginPath();
    for (let x = startX + 1; x <= endX; x++) {
      const wave3 = 0.6 * Math.sin(3 * x * this.config.frequency + this.offset * 3 + Math.PI/2);
      const y = this.config.height / 2 - this.config.amplitude * wave3;
      if (x === startX + 1) this.moveTo(x, y);
      else this.lineTo(x, y);
    }
    this.strokePath();

    // Draw combined wave in original color
    this.lineStyle(this.config.lineWidth, this.config.color, 1);
    this.beginPath();

    for (let x = startX + 1; x <= endX; x++) {
      // Combine all three waves with stronger secondary waves and phase shifts
      const wave1 = Math.sin(x * this.config.frequency + this.offset);
      const wave2 = 0.8 * Math.sin(2 * x * this.config.frequency + this.offset * 2 + Math.PI/3);
      const wave3 = 0.6 * Math.sin(3 * x * this.config.frequency + this.offset * 3 + Math.PI/2);
      const combinedSineY = wave1 + wave2 + wave3;
      
      const y = this.config.height / 2 - this.config.amplitude * combinedSineY;

      if (x === startX + 1) this.moveTo(x, y);
      else this.lineTo(x, y);

      // Detect peaks (max of sine)
      if (x > startX + 1) {
        const prevSineY = Math.sin((x - 1) * this.config.frequency + this.offset) + 
                         0.8 * Math.sin(2 * (x - 1) * this.config.frequency + this.offset * 2 + Math.PI/3) +
                         0.6 * Math.sin(3 * (x - 1) * this.config.frequency + this.offset * 3 + Math.PI/2);
        const nextSineY = Math.sin((x + 1) * this.config.frequency + this.offset) + 
                         0.8 * Math.sin(2 * (x + 1) * this.config.frequency + this.offset * 2 + Math.PI/3) +
                         0.6 * Math.sin(3 * (x + 1) * this.config.frequency + this.offset * 3 + Math.PI/2);
        if (combinedSineY > prevSineY && combinedSineY > nextSineY) {
          peaks.push({ x, y });
        }
      }
    }

    this.strokePath();

    if (this.circleCount > peaks.length) { 
      this.payout()
    } 
    this.circleCount = peaks.length

    // Draw circles at peaks
    this.fillStyle(this.config.nodeColor, 1);
    peaks.forEach((p) => {
      this.fillCircle(p.x, p.y, 7);
    });
  }

  adjustConfigValue(key, value, transition = 1000) {
    scene.tweens.add({
      targets: this.config,
      [key]: value,
      duration: transition,
      ease: "Quad.easeOut",
    });
  }

  payout() {
    stats.score++; 
    scene.score.setText(stats.score)
    scene.emitDebris(100, GAME_HEIGHT / 2 - this.config.amplitude, {tint: [this.config.nodeColor, this.config.color]}) 
    if (!this.upgradeBox) {
      this.upgradeBox = new UpgradeBox(1100, 100 + this.config.index * 100, this.config.index)
    }
  }
}
