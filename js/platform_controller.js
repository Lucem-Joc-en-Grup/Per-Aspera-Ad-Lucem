import Nivell1 from "https://lucem-joc-en-grup.github.io/Per-Aspera-Ad-Lucem/scenes/platformgame.js";
import Nivell3 from "https://lucem-joc-en-grup.github.io/Per-Aspera-Ad-Lucem/scenes/nivell3.js";
import Nivell2 from "https://lucem-joc-en-grup.github.io/Per-Aspera-Ad-Lucem/scenes/nivell2.js";
import Pause from "https://lucem-joc-en-grup.github.io/Per-Aspera-Ad-Lucem/scenes/pauseScene.js";
import Begin from "https://lucem-joc-en-grup.github.io/Per-Aspera-Ad-Lucem/scenes/begin.js";
import End from "https://lucem-joc-en-grup.github.io/Per-Aspera-Ad-Lucem/scenes/end.js";


var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 1000,
	backgroundColor: '#87ff42',
	type: Phaser.AUTO,
    parent: 'game_area',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 350},
			debug: false
		}
	},
    scene: [ Begin, Nivell1, Nivell2, Nivell3, Pause, End ],
};

var game = new Phaser.Game(config);
game.config.lives = 10;
game.config.bearMatades = 0;
game.config.started = false;
if(localStorage.getItem("carregar")==1){
	console.log("Load game");
	var data = JSON.parse(localStorage.getItem("partida"));
	
		game.config.lives = data.lives;
		game.config.bearMatades = data.bears;
		game.config.escena = data.escena;

}
