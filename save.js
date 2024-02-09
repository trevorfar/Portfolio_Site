var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 450 },
            debug: false
        }
    },

    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

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





function keyUp(x) {
    if (x.up.isUp) {
        return true;
    }
}
function displayScore(x) {
    score += x;
    scoreText.setText('Score: ' + score);

}
function jumpIndicator() {
    jumpText.setText('Double jump: ' + player.doubleJump + ' ' + 'Can Jump: ' + player.canJump);
    onFloor.setText('On floor: ' + player.body.onFloor())
}

function collectStar(player, star) {
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 2, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }
}

function hitBomb(player, bomb) {
    // this.physics.pause();

    player.setTint(0xff0000);

    // player.anims.play('turn');

    // gameOver = true;
}
