class SineWave extends Phaser.GameObjects.Graphics {
  constructor(config = {}, peaks = 1, level = 1) {
    super(scene, { x: 0, y: 0 });
    this.upgradeButton = false;
    this.config = Object.assign(
      {
        amplitude: 50,
        frequency: 0.02, // Adjust frequency to speed things up
        speed: 0.01, // Leave speed alone per color for now
        lineWidth: 2,
        width: GAME_WIDTH - 380,
        height: GAME_HEIGHT,
        index: 0,
        phaseShift: Math.PI / 4, // Default to 45 degrees shift
        peakCount: 1,
        debug: false,
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
    scene.waves.push(this);
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

    if (this.config.debug) {
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
    }

    // Draw combined wave in original color
    this.lineStyle(this.config.lineWidth, this.config.color, 1);
    this.beginPath();

    for (let x = startX + 1; x <= endX; x++) {
      // Initialize with the main wave
      let combinedSineY = Math.sin(x * this.config.frequency + this.offset);
      
      // Add additional waves based on peakCount
      if (this.config.peakCount >= 2) {
        combinedSineY += 0.8 * Math.sin(2 * x * this.config.frequency + this.offset * 2 + Math.PI/3);
      }
      if (this.config.peakCount >= 3) {
        combinedSineY += 0.6 * Math.sin(3 * x * this.config.frequency + this.offset * 3 + Math.PI/2);
      }
      if (this.config.peakCount >= 4) {
        combinedSineY += 0.4 * Math.sin(4 * x * this.config.frequency + this.offset * 4 + Math.PI/4);
      }
      
      const y = this.config.height / 2 - this.config.amplitude * combinedSineY;

      if (x === startX + 1) this.moveTo(x, y);
      else this.lineTo(x, y);

      // Detect peaks (max of sine)
      if (x > startX + 1) {
        let prevSineY = Math.sin((x - 1) * this.config.frequency + this.offset);
        if (this.config.peakCount >= 2) {
          prevSineY += 0.8 * Math.sin(2 * (x - 1) * this.config.frequency + this.offset * 2 + Math.PI/3);
        }
        if (this.config.peakCount >= 3) {
          prevSineY += 0.6 * Math.sin(3 * (x - 1) * this.config.frequency + this.offset * 3 + Math.PI/2);
        }
        if (this.config.peakCount >= 4) {
          prevSineY += 0.4 * Math.sin(4 * (x - 1) * this.config.frequency + this.offset * 4 + Math.PI/4);
        }
        let nextSineY = Math.sin((x + 1) * this.config.frequency + this.offset);
        if (this.config.peakCount >= 2) {
          nextSineY += 0.8 * Math.sin(2 * (x + 1) * this.config.frequency + this.offset * 2 + Math.PI/3);
        }
        if (this.config.peakCount >= 3) {
          nextSineY += 0.6 * Math.sin(3 * (x + 1) * this.config.frequency + this.offset * 3 + Math.PI/2);
        }
        if (this.config.peakCount >= 4) {
          nextSineY += 0.4 * Math.sin(4 * (x + 1) * this.config.frequency + this.offset * 4 + Math.PI/4);
        }
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
    const payout = new Decimal(this.config.amplitude / 5).ceil();
    adjustValue('score', stats.score.plus(payout));

    const lastX = 100;
    let lastY = Math.sin(lastX * this.config.frequency + this.offset);
    if (this.config.peakCount >= 2) {
      lastY += 0.8 * Math.sin(2 * lastX * this.config.frequency + this.offset * 2 + Math.PI/3);
    }
    if (this.config.peakCount >= 3) {
      lastY += 0.6 * Math.sin(3 * lastX * this.config.frequency + this.offset * 3 + Math.PI/2);
    }
    if (this.config.peakCount >= 4) {
      lastY += 0.4 * Math.sin(4 * lastX * this.config.frequency + this.offset * 4 + Math.PI/4);
    }
    const emitY = this.config.height / 2 - this.config.amplitude * lastY;
    
    scene.emitDebris(100, emitY, {tint: [this.config.nodeColor, this.config.color]}) 
    // if (!this.upgradeButton) {
    //   this.upgradeButton = new UpgradeButton(1100, 100 + this.config.index * 100, this.config.index)
    // }
  }
}
