class UpgradeButton extends Phaser.GameObjects.Container {
  constructor(x, y, index, type) {
    super(scene, x, y);
    this.index = index
    this.type = type

    const g = scene.add.graphics();

    const w = 100;
    const h = 50;
    const stroke = 1;
    const margin = stroke / 2;

    g.fillStyle(0x323232, 1);
    g.fillRoundedRect(margin, margin, w, h, 10);

    g.lineStyle(stroke, 0x484848, 1);
    g.strokeRoundedRect(margin, margin, w, h, 10);

    // note: width+stroke, height+stroke
    g.generateTexture('roundedRect', w + stroke, h + stroke);
    g.destroy();

    const btn = scene.add.image(0, 0, 'roundedRect').setOrigin(0.5);
    this.add(btn);
    this.setAlpha(0)
    scene.add.existing(this);
  }
}