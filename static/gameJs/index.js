import mainScene from "./gameScene.js";
import Phaser from "phaser";

var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    scene: gameScene,

    physics: {
        default: 'matter',
        matter: {
            debug: true
        }
    },

};

var game = new Phaser.Game(config);

