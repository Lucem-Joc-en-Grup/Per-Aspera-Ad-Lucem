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

export default class Nivell2 extends Phaser.Scene {
    constructor() {
        super("Nivell2");
        this.platforms = null;
        this.player = null;
        this.cursors = null;
        this.gears = null;
        this.score = 5;
        this.scoreText;
        this.bombs = null;
        this.gameOver = false;
        this.canvasWidth = null;
        this.canvasHeight = null;
    }
    preload() {
        if(!this.game.textures.get("background1")){
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
    
            // Personatge
            this.load.spritesheet("paloma_idle", '../../resources/paloma_sprites/paloma_idle.png', { frameWidth: 500, frameHeight: 500 });
    
            // Enemics
            this.load.spritesheet("bear_walk", '../../resources/bears_sprites/bears.png', { frameWidth: 240, frameHeight: 144 });
        }
    }

    create() {
        console.log("Nivell 2");
        // Get canvas size
        this.game.config.current = this;
        this.game.config.started = true;
        let { width, height } = this.sys.game.canvas;
        this.canvasWidth = width;
        this.canvasHeight = height;

        let map_width = 4000 * this.canvasHeight/1045;// 2165 + this.canvasWidth;
        let map_height = this.canvasHeight;

        // Scene Backgorund
        let bg = this.add.image(map_width / 2, map_height / 2, "background2");
        bg.setScale(this.canvasWidth / bg.height);
        //bg.setScrollFactor(0);
        // create the Tilemap
        const map = this.make.tilemap({
            key: "TileMap002",
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
            x: 100,
            y: 200,
            texture: "doc_up",
        })
        this.videsStart = this.player.hitPoints;
        this.ratesStart = this.player.rates;

        // Positions of the bears: for every position we create new bear
        var posicions = [
          {x:175,y:335},
          {x:1185,y:644},
          {x:1950,y:240},
          {x:2245,y:865},
          {x:2435,y:275},
          {x:3020,y:405},
          {x:3205,y:35}        
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
        this.cameras.main.startFollow(this.player, true, 0.5, 0.5); // Estableix a Doctor com a l'objecte a seguir amb la càmara

        this.livesStart = this.player.hitPoints;
        this.bearsStart = this.player.rates;
        this.hearts = [];
        for (var i = 0; i < this.player.hitPoints; i++) {
            this.hearts[i] = this.add.sprite(45 + 35 * i, 40, 'heart');
            this.hearts[i].setScale(0.60);
            this.hearts[i].setScrollFactor(0);
        }

        this.gear = this.add.sprite(755, 40, 'gearUI');
        this.gear.setScale(0.75);
        this.gear.setScrollFactor(0);
        this.puntsUI = this.add.text(692, 10, "5", { fontSize: "50px", fontFamily: "MyFont" })
        this.puntsUI.setScrollFactor(0);

        this.bearsUI = this.add.sprite(45, 100, 'bearUI');
        this.bearsUI.setScale(0.65);
        this.bearsUI.setScrollFactor(0);
        this.bearMatades = this.add.text(85, 70, this.game.config.bearMatades, { fontSize: "50px", fontFamily: "MyFont" })
        this.bearMatades.setScrollFactor(0);

        this.map = map;
        this.input.keyboard.on('keydown-ESC', this.pauseJoc, this);
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
            this.map.removeTile(herba);
            this.puntsUI.setText(this.score);
        }
    }
    canviarBearsUI(bears){
      this.bearMatades.setText(bears);
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
      if(this.inputKeys.interact.isDown && this.score==9)
      {
        this.scene.stop();
        this.scene.launch("Nivell3");
        console.log("sortir");
        }
    }
}

