function preload() {
    this.load.tilemapTiledJSON('map', '/static/assets/FirstMap.json');
    // this.load.image('sky', '/static/assets/sky.png');
    // this.load.image('ground', 'static/assets/platform.png');
    // this.load.image('ice', 'static/assets/ice.png');
    // this.load.image('star', 'static/assets/star.png');
    // this.load.image('star', 'static/assets/star.png');
    // this.load.image('star', 'static/assets/star.png');
    // this.load.image('bomb', 'static/assets/bomb.png');
    this.load.spritesheet('dude', 'static/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}