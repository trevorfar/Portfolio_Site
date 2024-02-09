var player;
// var stars;
// var platforms;
// var keys;
// var bombs;
// var gameOver = false;
// var score = 0;
// var scoreText;






function create() {

    this.add.image(400, 300, 'sky');
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    miscPlats = this.physics.add.staticGroup();
    miscPlats.create(400,568, 'ice');

    player = this.physics.add.sprite(100, 400, 'dude');

    player.doubleJump = false;
    player.canJump = false;

    //player.setBounce(0.1);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, miscPlats);


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
    
    stars = this.physics.add.group({
        key: 'star',
        repeat: 3,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    bombs = this.physics.add.group();

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, miscPlats);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    jumpText = this.add.text(16, 48, 'Has Jump: ', { fontSize: '32px', fill: '#000' })
    onFloor = this.add.text(16, 136, 'On floor: ', { fontSize: '32px', fill: '#000' })

    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb);
    this.physics.add.collider(bombs, bombs);



}

var upKeyJustPressed = false;
var jumpTimer = 0;

function update() {

    if (player.body.onFloor()) {
        player.canJump = true;
        player.doubleJump = false;
        upKeyJustPressed = false;
    }

    jumpIndicator();

    if (gameOver) {
        return;
    }

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

    //On click it sets the upkey to false, then does the jump, in this case its either double jump or single then cursor comes up and the key is rendered false 
    if ((keys.up.isDown && !upKeyJustPressed)) { //
        upKeyJustPressed = true;

        // First Jump   
        if (player.body.onFloor() && player.canJump) {
            player.canJump = false;
            player.setVelocityY(-330);
        }

        // Double Jump
        else if (!player.doubleJump && !player.body.onFloor()) {
            player.canJump = false;
            player.doubleJump = true;
            player.setVelocityY(-300);
            displayScore(50);
        }
    }
    if (keyUp(keys)) { 
        upKeyJustPressed = false;
    }

}