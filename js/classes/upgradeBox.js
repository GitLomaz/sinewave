class UpgradeBox extends Phaser.GameObjects.Container {
  constructor(x, y, index) {
    super(scene, x, y);
    this.elements = []
    this.waveLine = new UpgradeWaveLine(0, 0, index)
    this.button1 = new UpgradeButton(-60, 10, index, 0)
    this.button2 = new UpgradeButton(60, 10, index, 0)
    this.add(this.waveLine)
    this.add(this.button1)
    this.add(this.button2)
    this.elements.push(this.waveLine)
    this.elements.push(this.button1)
    this.elements.push(this.button2)
    scene.add.existing(this);

    this.elements.forEach((element, i) => {
      scene.time.delayedCall(i * 500, () => {
        scene.tweens.add({
          targets: element,
          alpha: { from: 0, to: 1 },
          duration: 400
        });
      });
    });
  }
}