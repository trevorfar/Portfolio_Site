function preload() {
    this.load.spritesheet('dude', 'static/assets/dude.png', { frameWidth: 32, frameHeight: 48 });

    this.load.image('FactoryMap', 'static/assets/Interiors_free_32x32.png');
    this.load.image('Background', 'static/assets/Room_Builder_free_32x32.png');
 
    this.load.tilemapTiledJSON('map', 'static/assets/FactoryFile.json');
   
    
}