function loadStats() {
  const savedStats = JSON.parse(localStorage.getItem('stats'));
  if (savedStats) {
    // Convert score back to Decimal when loading
    if (savedStats.score !== undefined) {
      savedStats.score = new Decimal(savedStats.score);
    }
    stats = { ...stats, ...savedStats };
  }
  scene.score.setText(stats.score.toString())
}

function saveGame() {
  console.log('Game saved');
  // Convert score to string for storage
  const statsToSave = {
    ...stats,
    score: stats.score.toString()
  };
  localStorage.setItem('stats', JSON.stringify(statsToSave));
}

function generateButton(index) {
  new UpgradeButton(1100, 100 + index * 100, index)
}