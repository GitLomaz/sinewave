class UpgradeWaveLine extends Phaser.GameObjects.Container {
  constructor(x, y, index) {
    super(scene, x, y);

    const g = scene.add.graphics();
    g.lineStyle(2, waves[index].color, 1);
    g.beginPath();
    g.moveTo(0, 10);
    g.lineTo(240, 10);
    g.strokePath();
    g.fillStyle( waves[index].nodeColor, 1);
    g.fillCircle(120, 10, 7);
    g.generateTexture('line' + index, 240, 100);
    g.destroy();

    // add as an image (centered in the container)
    const lineImg = scene.add.image(0, 0, 'line' + index);
    lineImg.setOrigin(0.5);
    this.add(lineImg);
    this.setAlpha(0)
    scene.add.existing(this);
  }
}