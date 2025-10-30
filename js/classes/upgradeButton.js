class UpgradeButton extends Phaser.GameObjects.Container {
  constructor(x, y, index) {
    super(scene, x, y);
    this.index = index
    this.waveTemplate = waves[index]
    this.wave = false;
    this.locked = true;

    const g = scene.add.graphics();

    const w = 240;
    const h = 50;
    const stroke = 2;
    const margin = stroke / 2;

    g.fillStyle(0x323232, 2);
    g.fillRoundedRect(margin, margin, w, h, 10);

    g.lineStyle(stroke, waves[index].color, 2);
    g.strokeRoundedRect(margin, margin, w, h, 10);

    g.fillStyle( waves[index].nodeColor, 1);
    g.fillCircle(14, 14, 7);

    g.generateTexture('roundedRect' + index, w + stroke, h + stroke);
    g.destroy();

    this.btn = scene.add.image(0, 0, 'roundedRect' + index).setOrigin(0.5);
    this.lock = scene.add.image(w / 2 - 20, 0, 'lock').setOrigin(0.5);
    this.text = scene.add.text(0, 0, `Cost: ${this.waveTemplate.unlock}`, {
      fontFamily: "font1",
      fontSize: "20px",
    }).setOrigin(0.5);
    this.add(this.btn);
    this.add(this.lock);
    this.add(this.text);

    this.setAlpha(0)
    scene.add.existing(this);
    this.canAfford(stats.score.gte(this.getCost()));
  }

  canAfford(afford) {
    scene.tweens.add({
      targets: this,
      alpha: afford ? 1 : 0.6,
      duration: 400
    });
    if (afford) {
      this.btn.setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.click());
    } else {
      this.btn.disableInteractive();
    }
  }

  getCost() {
    if (this.locked) {
      return new Decimal(this.waveTemplate.unlock);
    }
  }

  click() {
    if (this.locked && stats.score.gte(this.getCost())) {
      console.log("Purchased wave " + this.index);
      this.wave = new SineWave(this.waveTemplate);
    }
  }
}