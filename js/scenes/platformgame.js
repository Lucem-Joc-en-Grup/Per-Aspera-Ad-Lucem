"use strict";
import Doctor from "../classes/doctor.js";
import Bear from "../classes/bear.js";

function loadFont(name, url) {
  var newFont = new FontFace(name, `url(${url})`);
  newFont.load().then(function(loaded) {
      document.fonts.add(loaded);
  }).catch(function(error) {
      return error;
  });
}

loadFont("MyFont", "../../resources/fonts/long_pixel-7.ttf");

export default class Nivell1 extends Phaser.Scene {
    constructor() {
        super("Nivell1");
        this.platforms = null;
        this.player = null;
        this.cursors = null;
        this.gears = null;
        this.score = 0;
        this.gameOver = false;
        this.canvasWidth = null;
        this.canvasHeight = null;
        this.pause = false;
    }
    preload() {
        // Lucem.preload(this);
        //Backgrounds
        this.load.image("background1", "../../resources/backgrounds/bg_b.png");
        this.load.image("background2", "../../resources/backgrounds/all_bgs.jpg");

        // Props
        this.load.image("firepit", "../../resources/props/firepit.png");
        this.load.image("obstacles", "../../resources/props/obstacles.png");
        this.load.image("gear", "../../resources/props/gear_tile.png");
        this.load.image("collision", "../../resources/props/Collision.png");

        // Icons
        this.load.image("heart", "../resources/icons/heart.png");
        this.load.image("bear", "../resources/icons/bear.png");
        this.load.image("gearUI", "../resources/icons/gear.png");


        this.load.tilemapTiledJSON("TileMap001", "../../tiled/TileMap001.json");
        this.load.tilemapTiledJSON("TileMap002", "../../tiled/TileMap002.json");
        this.load.tilemapTiledJSON("TileMap003", "../../tiled/TileMap003.json");

        // Player
        this.load.spritesheet("doc_up", "../../resources/doc_sprites/doc_up.png", { frameWidth: 75, frameHeight: 90 });
        this.load.spritesheet("doc_down", '../../resources/doc_sprites/doc_down.png', { frameWidth: 75, frameHeight: 90 });

        // Enemies
        this.load.spritesheet("bear_walk", '../../resources/bears_sprites/bears.png', { frameWidth: 240, frameHeight: 144 });

    }

    create() {
        // Get canvas size
        this.game.config.current = this;
        this.game.config.started = true;
        let { width, height } = this.sys.game.canvas;
        this.canvasWidth = width;
        this.canvasHeight = height;

        let map_width = 1894 + this.canvasWidth;
        let map_height = this.canvasHeight;

        // Scene Backgorund
        let bg = this.add.image(map_width / 2, map_height / 2, "background1");
        bg.setScale(this.canvasWidth / bg.height);
        //bg.setScrollFactor(0);
        // create the Tilemap
        const map = this.make.tilemap({
            key: "TileMap001",
        });

        const tilesetObstacles = map.addTilesetImage("obstacles");
        const tilesetGear = map.addTilesetImage("gear");
        const tilesetFirepit = map.addTilesetImage("firepit");
        const tilesetCollisions = map.addTilesetImage("collision");

        const layerTiles = map.createLayer("Tiles", [tilesetObstacles]);
        const layerTiles_gear = map.createLayer("Tiles_gear", [tilesetGear]);
        const layerNext = map.createLayer("Next", [tilesetFirepit]);
        const layerCollisions = map.createLayer("Collisions", []);
        const layerCollisions_bear = map.createLayer("Collisions_rata", []);


        layerTiles.setScale(0.2);
        layerTiles_gear.setScale(0.2);
        layerCollisions.setScale(0.2);
        layerCollisions_bear.setScale(0.2);
        layerNext.setScale(0.2);

        this.player = new Doctor ({
            scene: this, // Passa l'objecte a l'escena actual
            x: 160,
            y: 610,
            texture: "doc_up",
        })

        // Positions of the bears: for every position we create new bear
        var posicions = [
          {x:1000,y:912},
          {x:600,y:262},
          {x:1656,y:260},
          {x:2009,y:898},
          {x:2310,y:187},
          {x:2310,y:535},
          {x:3120,y:415}
        ];

        this.bears=[];
        for(var i=0;i<posicions.length;i++){
          var bear = new Bear({ scene: this, x: posicions[i].x, y: posicions[i].y, texture: "bear_walk", frame: 0 });
          this.bears.push(bear);
        }

        this.inputKeys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            attack: Phaser.Input.Keyboard.KeyCodes.E,
            interact: Phaser.Input.Keyboard.KeyCodes.Q,
            jump: Phaser.Input.Keyboard.KeyCodes.W,
            sneak: Phaser.Input.Keyboard.KeyCodes.S,
            posicio_doc: Phaser.Input.Keyboard.KeyCodes.Z,
            ferir_doc: Phaser.Input.Keyboard.KeyCodes.F,
            pause: Phaser.Input.Keyboard.KeyCodes.ESC
        });

        this.player.create();


        // Colisions
        this.player.changeHitbox();
        this.physics.add.collider(this.player, layerTiles);
        this.physics.add.collider(this.player, layerCollisions);
        for(var i=0;i<this.bears.length;i++){
          this.bears[i].create();
          this.physics.add.collider(this.bears[i], layerTiles);
          this.physics.add.collider(this.bears[i], layerCollisions);
          this.physics.add.overlap(this.bears[i], layerCollisions_bear, (a, b) => { if (b.index > -1) a.flip(); });
          this.physics.add.overlap(this.bears[i], this.player, (a,b) => {if(a.active) b.rebreMal();});
        }
        this.physics.add.overlap(this.player, layerTiles_gear, (a, b) => this.collectGear(a, b));
        this.physics.add.overlap(this.player, layerNext, (a,b) => {if(b.index > -1) this.canviarNivell()});

        layerTiles.setCollisionBetween(5, 23);
        layerCollisions.setCollisionBetween(11, 11);
        layerCollisions_bear.setCollisionBetween(11, 11);

        this.cameras.main.setBounds(0, 0, map_width, map_height); // Ajusta els límits de la càmera segons el tamany de l'escena
        this.cameras.main.startFollow(this.player, true, 0.5, 0.5); // Estableix a Carnal com a l'objecte a seguir amb la càmara

        this.livesStart = this.player.hitPoints;
        this.bearsStart = this.player.bears;
        this.hearts = [];
        for (var i = 0; i < this.player.hitPoints; i++) {
            this.hearts[i] = this.add.sprite(45 + 35 * i, 40, 'heart');
            this.hearts[i].setScale(0.60);
            this.hearts[i].setScrollFactor(0);
        }

        this.gear = this.add.sprite(755, 40, 'gearUI');
        this.gear.setScale(0.75);
        this.gear.setScrollFactor(0);
        this.puntsUI = this.add.text(692, 10, "0", { fontSize: "50px", fontFamily: "MyFont" })
        this.puntsUI.setScrollFactor(0);

        this.bearsUI = this.add.sprite(45, 100, 'rata');
        this.bearsUI.setScale(0.65);
        this.bearsUI.setScrollFactor(0);
        this.bearMatades = this.add.text(85, 70, "0", { fontSize: "50px", fontFamily: "MyFont" })
        this.bearMatades.setScrollFactor(0);

        this.map = map;
        this.input.keyboard.on('keydown-ESC', this.pauseJoc, this);
        if(localStorage.getItem("carregar")==1){
          this.scene.stop();
          this.scene.launch(this.game.config.escena);

        }

    }
    update() {
        if (this.gameOver || this.pause) return;
        this.pause = false;
        this.player.update();
        for(var i=0;i<this.bears.length;i++){this.bears[i].update();}
    }
    collectGear(player, gear) {
        if (gear.index > -1) { // Si és un tile correcte
            this.score++;
            this.map.removeTile(gear);
            this.puntsUI.setText(this.score);
        }
    }
    canviarBearsUI(bears){
      this.bearMatadesMatades.setText(this.bears);
    }
    canviarLivesUI(lives){
      this.hearts[lives].setActive(false).setVisible(false);
    }
    pauseJoc(){
      this.pause = false;
      this.scene.launch("Pause");
      this.scene.pause();
    }
    canviarNivell(){
      if(this.inputKeys.interact.isDown && this.score==5)
      {
        this.scene.stop();
        this.scene.launch("Nivell2");
        console.log("sortir");
      }
    }
} 

