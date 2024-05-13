"use strict";

function loadFont(name, url) {
  var newFont = new FontFace(name, `url(${url})`);
  newFont
    .load()
    .then(function (loaded) {
      document.fonts.add(loaded);
    })
    .catch(function (error) {
      return error;
    });
}

loadFont("gatNums", "../../resources/fonts/nums.ttf");
loadFont("gatText", "../../resources/fonts/Meowcat.ttf");

export default class End extends Phaser.Scene {
  constructor() {
    super("End");
    this.platforms = null;
    this.player = null;
    this.cursors = null;
    this.herb = null;
    this.score = 0;
    this.gameOver = false;
    this.canvasWidth = null;
    this.canvasHeight = null;
    this.pause = false;
    this.centerX = null;
    this.centerY = null;
    this.canSkip = null;
    this.dialegActual = 0;
    this.dialegs = null;
    this.dialegPantalla = null;
  }
  preload() {
    // Carnal.preload(this);
    //Backgrounds
    this.load.image(
      "background1",
      "../../resources/backgrounds/BackgroundB.png"
    );
    this.load.image("carnal-fullArt", "../../resources/carnal_fullArt.png");
    this.load.image("paloma-fullArt", "../../resources/paloma_fullArt.png");
    // Dialegs
    this.load.image(
      "carnal-dialeg",
      "../../resources/Dialeg/carnal_dialeg.png"
    );
    this.load.image(
      "paloma-dialeg",
      "../../resources/Dialeg/paloma_dialeg.png"
    );
  }

  create() {
    
    this.inputKeys = this.input.keyboard.addKeys({
        attack: Phaser.Input.Keyboard.KeyCodes.SPACE
    })
    // Get canvas size
    let { width, height } = this.sys.game.canvas;
    this.canvasWidth = width;
    this.canvasHeight = height;

    let map_width = this.canvasWidth;
    let map_height = this.canvasHeight;

    this.centerX = map_width / 2;
    this.centerY = map_height / 2;

    // Scene Backgorund
    let bg = this.add.image(this.centerX, this.centerY, "background1");
    bg.setScale(this.canvasWidth / bg.height);

    // PJs
    let paloma = this.add.image(
      this.centerX + 250,
      this.centerY + 100,
      "paloma-fullArt"
    );
    paloma.setScale(0.3);
    let carnal = this.add.image(
      this.centerX - 200,
      this.centerY + 100,
      "carnal-fullArt"
    );
    carnal.setScale(0.3);

    
//    |\__/,|   (`\
//  _.|o o  |_   ) )
//-(((---(((--------

    this.canSkip = false;
    this.dialegs = [
        ["Com t'ho havia promés, aquí tens.", "carnal"],
        ["Miiaaau!!! Herba gateraaaa!!!!", "paloma"],
        ["Sí, sí, però abans obrem la porta!", "carnal"],
        ["Que si, aquí teens. Miaaau! La meva herbaa és tota meeva!", "paloma"]
    ]
    this.dialegActual = 0;
    this.dialegPantalla = new Dialogo(this, this.dialegs[this.dialegActual][0], this.dialegs[this.dialegActual][1]);
    this.dialegPantalla.on("dialogoCompleto", () => {
        console.log("Dialeg complet");
        this.canSkip = true;
    })

    // this.time.delayedCall(3000, () => {
    //   console.log("Destroy dialeg!");
    //   d1.destroy();
    // });
  }
  update() {
    if (this.inputKeys.attack.isDown && this.canSkip) {
        this.dialegPantalla.destroy();
        this.dialegActual++;
        this.canSkip = false;
        if (this.dialegActual < this.dialegs.length) {
            this.dialegPantalla = new Dialogo(this, this.dialegs[this.dialegActual][0], this.dialegs[this.dialegActual][1]);
            this.dialegPantalla.on("dialogoCompleto", () => {
                console.log("Dialeg complet");
                this.canSkip = true;
            });
        }
        else {
            this.time.delayedCall(1000, () => {
            console.log("Escena completa!");
            var cam = this.cameras.main;
            cam.shake(500);
            this.time.addEvent({
                delay: 2000,
                callback: () =>{
                    cam.fade(2000);
                },
                loop: false
            });
            console.log (cam)
            cam.on('camerafadeoutcomplete', () => {
              cam.fadeIn(500);
              var rect = this.add.rectangle(this.canvasWidth/2, this.canvasHeight/2, this.canvasWidth, this.canvasHeight, 0x000000);
              this.text = this.add.text(this.canvasWidth/2, this.canvasHeight/2, "VICTORY", { fontSize: "100px", fontFamily: "gatText", fill: "#fff" }).setOrigin(0.5);
              this.text.setScrollFactor(0);
              rect.setScrollFactor(0);
              this.gameOver = true;
              setTimeout(() => {loadpage("../../index.html")}, 4000);
            })
            });
        }
    }
  }
}
class Dialogo extends Phaser.GameObjects.Container {
  constructor(scene, dialogText, character = "paloma") {
    super(scene);

    this.scene = scene;
    this.dialogText = dialogText;
    this.character = character;

    const dialogTextStyle = {
      fontFamily: "gatText",
      fontSize: "32px",
      color: "#ffed89",
      align: "left",
      wordWrap: { width: 400, useAdvancedWrap: true },
    };

    let dialog;
    if (character === "paloma") {
      dialog = this.scene.add.image(
        this.scene.centerX,
        this.scene.centerY - 250,
        "paloma-dialeg"
      );
    } else {
      dialog = this.scene.add.image(
        this.scene.centerX,
        this.scene.centerY - 250,
        "carnal-dialeg"
      );
    }

    let text = this.scene.add.text(
      this.scene.centerX - 135,
      this.scene.centerY - 320,
      "",
      dialogTextStyle
    );

    this.add(dialog);
    this.add(text);

    this.scene.add.existing(this);

    this.typeText();
  }

  typeText() {
    const textObject = this.getAt(1);
    const fullText = this.dialogText;
    let currentCharIndex = 0;
    this.scene.time.addEvent({
      delay: 50,
      callback: () => {
        textObject.text += fullText[currentCharIndex];
        currentCharIndex++;
        if (currentCharIndex === fullText.length) {
          // Se ha mostrado todo el texto
          this.emit("dialogoCompleto");
        }
      },
      repeat: fullText.length - 1,
    });
  }

  destroy() {
    super.destroy();
    this.scene = null;
  }
}
