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

