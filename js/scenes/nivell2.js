"use strict";
import Carnal from "../classes/carnal.js";
import Rata from "../classes/rata.js";

function loadFont(name, url) {
  var newFont = new FontFace(name, `url(${url})`);
  newFont.load().then(function(loaded) {
      document.fonts.add(loaded);
  }).catch(function(error) {
      return error;
  });
}

loadFont("gatNums","../../resources/fonts/nums.ttf");
loadFont("gatText","../../resources/fonts/Meowcat.ttf");

export default class Nivell2 extends Phaser.Scene {
    constructor() {
        super("Nivell2");
        this.platforms = null;
        this.player = null;
        this.cursors = null;
        this.herb = null;
        this.score = 5;
        this.scoreText;
        this.bombs = null;
        this.gameOver = false;
        this.canvasWidth = null;
        this.canvasHeight = null;
    }
    preload() {
        if(!this.game.textures.get("background1")){
            // Carnal.preload(this);
            //Backgrounds
            this.load.image("background1", "../../resources/backgrounds/background_passadisPorta.jpg");
            this.load.image("background2", "../../resources/backgrounds/background_passadis.jpg");
            this.load.image("background3", "../../resources/backgrounds/background_ventilacio.jpg");
            this.load.image("background4", "../../resources/backgrounds/background_pati.jpg");
    
            // Props
            this.load.image("entrada_ventilacio", "../../resources/props/entrada_tileset.png");
            this.load.image("tuberia_tileset", "../../resources/props/tuberia_tileset.png");
            this.load.image("herba", "../../resources/props/herba_tileset.png");
            this.load.image("caixa", "../../resources/props/box_tileset.png");
    
            // Icones
            this.load.image("cor", "../resources/icones/cor.png");
            this.load.image("rata", "../resources/icones/rata.png");
            this.load.image("herbaUI", "../resources/icones/herba.png");
    
    
            this.load.image("Collision", "../../resources/assets/Collision.png");
            this.load.tilemapTiledJSON("TileMap001", "../../tiled/TileMap001.json");
            this.load.tilemapTiledJSON("TileMap002", "../../tiled/TileMap002.json");
            this.load.tilemapTiledJSON("TileMap003", "../../tiled/TileMap003.json");
    
            // Player
            this.load.spritesheet("carnal_walk", "../../resources/carnal_sprites/carnal_walk.png", { frameWidth: 500, frameHeight: 500 });
            this.load.spritesheet("carnal_attack", '../../resources/carnal_sprites/carnal_attack.png', { frameWidth: 500, frameHeight: 500 });
            this.load.spritesheet("carnal_sneak", '../../resources/carnal_sprites/carnal_sneak.png', { frameWidth: 500, frameHeight: 500 });
            this.load.spritesheet("carnal_sneak_attack", '../../resources/carnal_sprites/carnal_sneak_attack.png', { frameWidth: 500, frameHeight: 500 });
            this.load.spritesheet("carnal_jump", '../../resources/carnal_sprites/carnal_jump.png', { frameWidth: 500, frameHeight: 500 });
            this.load.spritesheet("carnal_idle", '../../resources/carnal_sprites/carnal_wait.png', { frameWidth: 500, frameHeight: 500 });
            this.load.spritesheet("carnal_damage", '../../resources/carnal_sprites/carnal_damage.png', { frameWidth: 500, frameHeight: 500 });
            this.load.spritesheet("carnal_death", '../../resources/carnal_sprites/carnal_death.png', { frameWidth: 500, frameHeight: 500 });
            this.load.image("carnal-texture", "../../resources/prueba.png");
    
            // Personatge
            this.load.spritesheet("paloma_idle", '../../resources/paloma_sprites/paloma_idle.png', { frameWidth: 500, frameHeight: 500 });
    
            // Enemics
            this.load.spritesheet("rat_walk", '../../resources/rats_sprites/rat_walk.png', { frameWidth: 343, frameHeight: 142 });
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
        let bg = this.add.image(map_width / 2, map_height / 2, "background3");
        bg.setScale(this.canvasWidth / bg.height);
        //bg.setScrollFactor(0);
        // create the Tilemap
        const map = this.make.tilemap({
            key: "TileMap002",
        });

        const tilesetTuberies = map.addTilesetImage("tuberia_tileset");
        const tilesetHerba = map.addTilesetImage("herba");
        const tilesetVentilacio = map.addTilesetImage("entrada_ventilacio");
        const tilesetCollision = map.addTilesetImage("Collision");
        const tilesetBox = map.addTilesetImage("caixa")

        const layerTiles = map.createLayer("Tiles", [tilesetTuberies, tilesetBox]);
        const layerHerba = map.createLayer("Tiles_herba", [tilesetHerba]);
        const layerNext = map.createLayer("Next", [tilesetVentilacio]);
        const layerCollision = map.createLayer("Collisions", []);
        const layerCollisionRata = map.createLayer("Collisions_rata", []);


        // He copiat es setScale(0.2) per a tots però no se si ha de ser així

        layerTiles.setScale(0.2);
        layerHerba.setScale(0.2);
        layerCollision.setScale(0.2);
        layerCollisionRata.setScale(0.2);
        layerNext.setScale(0.2);

        //En Facu havia llevat aquest tros i no es veia es moix per això, no se perquè ha ha llevat però així funciona
        this.player = new Carnal({
            scene: this, // Passa l'objecte a l'escena actual
            x: 100,
            y: 200,
            texture: "carnal_idle",
        })
        this.videsStart = this.player.hitPoints;
        this.ratesStart = this.player.rates;

        // Posicions de les rates: per cada posició es crea una rata nova
        var posicions = [
          {x:523,y:380},
          {x:1079,y:380},
          {x:1383,y:380},
          {x:1829,y:380},
          {x:2100,y:380}          
        ];

        this.rates=[];
        for(var i=0;i<posicions.length;i++){
          var rata = new Rata({ scene: this, x: posicions[i].x, y: posicions[i].y, texture: "rat_walk", frame: 0 });
          this.rates.push(rata);
        }

        this.inputKeys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            attack: Phaser.Input.Keyboard.KeyCodes.E,
            interact: Phaser.Input.Keyboard.KeyCodes.Q,
            jump: Phaser.Input.Keyboard.KeyCodes.W,
            sneak: Phaser.Input.Keyboard.KeyCodes.S,
            posicio_carnal: Phaser.Input.Keyboard.KeyCodes.Z,
            pause: Phaser.Input.Keyboard.KeyCodes.ESC
        });

        this.player.create();

        // Suposo que una cosa com s'herba no hauria de tenir colisions, sinó que en tocar-la o en entrar dins sa seva àrea l'hauria d'adquirir. De moment té colisions perquè uwu

        // Colisions
        this.player.changeHitbox();
        this.physics.add.collider(this.player, layerTiles);
        this.physics.add.collider(this.player, layerCollision);
        for(var i=0;i<this.rates.length;i++){
          this.rates[i].create();
          this.physics.add.collider(this.rates[i], layerTiles);
          this.physics.add.collider(this.rates[i], layerCollision);
          this.physics.add.overlap(this.rates[i], layerCollisionRata, (a, b) => { if (b.index > -1) a.flip(); });
          this.physics.add.overlap(this.rates[i], this.player, (a,b) => {if(a.active) b.rebreMal();});
        }
        this.physics.add.overlap(this.player, layerHerba, (a, b) => this.collectHerba(a, b));
        this.physics.add.overlap(this.player, layerNext, (a,b) => {if(b.index > -1) this.canviarNivell()});

        layerTiles.setCollisionBetween(5, 23);
        layerCollision.setCollisionBetween(11, 11);
        layerCollisionRata.setCollisionBetween(11, 11);

        this.cameras.main.setBounds(0, 0, map_width, map_height); // Ajusta els límits de la càmera segons el tamany de l'escena
        this.cameras.main.startFollow(this.player, true, 0.5, 0.5); // Estableix a Carnal com a l'objecte a seguir amb la càmara

        this.videsStart = this.player.hitPoints;
        this.ratesStart = this.player.rates;
        this.cors = [];
        for (var i = 0; i < this.player.hitPoints; i++) {
            this.cors[i] = this.add.sprite(45 + 35 * i, 40, 'cor');
            this.cors[i].setScale(0.60);
            this.cors[i].setScrollFactor(0);
        }

        this.herba = this.add.sprite(755, 40, 'herbaUI');
        this.herba.setScale(0.75);
        this.herba.setScrollFactor(0);
        this.puntsUI = this.add.text(692, 10, "5", { fontSize: "50px", fontFamily: "gatNums" })
        this.puntsUI.setScrollFactor(0);

        this.ratesUI = this.add.sprite(45, 100, 'rata');
        this.ratesUI.setScale(0.65);
        this.ratesUI.setScrollFactor(0);
        this.ratesMatades = this.add.text(85, 70, this.game.config.ratesMatades, { fontSize: "50px", fontFamily: "gatNums" })
        this.ratesMatades.setScrollFactor(0);

        this.map = map;
        this.input.keyboard.on('keydown-ESC', this.pauseJoc, this);
    }
    update() {
        if (this.gameOver || this.pause) return;
        this.pause = false;
        this.player.update();
        for(var i=0;i<this.rates.length;i++){this.rates[i].update();}
    }
    collectHerba(player, herba) {
        if (herba.index > -1) { // Si és un tile correcte
            this.score++;
            this.map.removeTile(herba);
            this.puntsUI.setText(this.score);
        }
    }
    canviarRatesUI(rates){
      this.ratesMatades.setText(rates);
    }
    canviarVidesUI(vides){
      this.cors[vides].setActive(false).setVisible(false);
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

