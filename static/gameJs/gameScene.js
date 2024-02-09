var player;


function create() {

    
    const map = this.make.tilemap({key:"map", tileWidth: 32, tileHeight: 32})
    
    
    const tileset = map.addTilesetImage("FactoryMap", "FactoryMap");
    const tileset2 = map.addTilesetImage("Background", "Background");

    const backgroundLayer = map.createLayer("Background", tileset2, 0, 0);
    const wallsLayer = map.createLayer("Walls", tileset2, 0, 0);
    const chairsLayer = map.createLayer("Chairs", tileset, 0, 0);
    const tablesLayer = map.createLayer("Tables", tileset, 0, 0);
    const booksLayer = map.createLayer("Books", tileset, 0, 0);


    player = this.physics.add.sprite(100, 400, 'dude');
    player.setCollideWorldBounds(true);

    


    this.anims.create({

        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    keys = this.input.keyboard.createCursorKeys();

    keys = {
        ...keys,
        ...this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.W,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.A,
            'right': Phaser.Input.Keyboard.KeyCodes.D
        })
    };
    
}


function update() {

    if (keys.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }

    else if (keys.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }


}