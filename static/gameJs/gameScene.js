var player;


function create() {
 
    this.input.keyboard.on('keydown_F', function () {
        if (this.scale.isFullscreen) {
            this.scale.stopFullscreen();
        } else {
            this.scale.startFullscreen();
        }
    }, this);

    const map = this.make.tilemap({key:"map"})
    
    const tileset = map.addTilesetImage("FactoryMap", "FactoryMap");
    const tileset2 = map.addTilesetImage("Background", "Background");
    
    const backgroundLayer = map.createLayer("Background", tileset2, 0, 0);
    const wallsLayer  = map.createLayer("Walls", tileset2, 0, 0);
    const tablesLayer = map.createLayer("Tables", tileset, 0, 0);
    
    player = this.physics.add.sprite(100, 400, 'dude'); 

    console.log(tablesLayer.properties);

    tablesLayer.setCollisionByProperty({collides: true});
    this.physics.add.collider(player, tablesLayer);

    const debugGraphics = this.add.graphics().setAlpha(0.7);
    
    wallsLayer.renderDebug(debugGraphics,
        {tilecolor: null,
        collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255), 
        faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        });
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

    if (keys.up.isDown) {
        player.setVelocityY(-160);
    }
    else if (keys.down.isDown) {
        player.setVelocityY(160);
    }
    else {
        player.setVelocityY(0); 
    }
    

}