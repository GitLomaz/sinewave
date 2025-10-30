class UpgradeButton extends Phaser.GameObjects.Container {
  constructor(x, y, index, level = 0) {
    super(scene, x, y);
    this.index = index
    this.waveTemplate = waves[index]
    this.wave = false;
    this.level = level;

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
    this.text = scene.add.text(0, 0, `${this.level === 0 ? 'Unlock' : 'Cost'}: ${this.waveTemplate.unlock}`, {
      fontFamily: "font1",
      fontSize: "20px",
    }).setOrigin(0.5);
    this.levelText = scene.add.text(-110, 3, ``, {
      fontFamily: "font1",
      fontSize: "16px",
    }).setOrigin(0)
    this.add(this.btn);
    this.add(this.lock);
    this.add(this.text);
    this.add(this.levelText);

    this.setAlpha(0)
    scene.add.existing(this);
    scene.upgradeButtons.push(this);
    this.canAfford();
  }

  canAfford() {
    const afford = stats.score.gte(this.getCost());
    scene.tweens.add({
      targets: this,
      alpha: afford ? 1 : 0.6,
      duration: 400
    });
    if (afford) {
      this.btn.removeAllListeners('pointerdown');
      this.btn.setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.click());
    } else {
      this.btn.disableInteractive();
    }
  }
  

  getCost() {
    if (this.level === 0) {
      return new Decimal(this.waveTemplate.unlock);
    } else {
      const baseCost = new Decimal(this.waveTemplate.upgrades.cost);
      const cost = baseCost.times(new Decimal(this.waveTemplate.upgrades.modifier).pow(this.level - 1));
      return cost.ceil();
    }
  }

  click() {
    const afford = stats.score.gte(this.getCost());
    if (!afford) return;
    if (this.level === 0) {
      adjustValue('score', stats.score.minus(this.getCost()));
      this.lock.destroy();
      this.level = 1
      this.wave = new SineWave(this.waveTemplate);
    } else if (this.level > 0) {
      adjustValue('score', stats.score.minus(this.getCost()));
      this.wave.adjustConfigValue('amplitude', this.wave.config.amplitude * this.waveTemplate.upgrades.amplitideModifier);
      this.level += 1;
    }
    this.levelText.setText(this.level);
    this.canAfford();
    this.text.setText(`Cost: ${this.getCost()}`);
  }
}