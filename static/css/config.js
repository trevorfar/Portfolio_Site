import { Engine, Render, World, Bodies, Body, Runner } from Matter;

var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: mainScene,

    physics: {
        default: 'matter',
        matter: {
            debug: true
        }
    }
};

var game = new Phaser.Game(config);

