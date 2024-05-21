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

loadFont("MyFont", "https://lucem-joc-en-grup.github.io/Per-Aspera-Ad-Lucem/resources/fonts/long_pixel-7.ttf");

export default class End extends Phaser.Scene {
  constructor() {
    super("End");
    this.platforms = null;
    this.player = null;
    this.cursors = null;
    this.gears = null;
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
    //Lucem.preload(this);
    //Backgrounds
    this.load.image(
      "backgroundB",
      "https://lucem-joc-en-grup.github.io/Per-Aspera-Ad-Lucem/resources/backgrounds/bg_b.png"
    );

    // Dialogs
    this.load.image(
      "doctor-dialeg",
      "https://lucem-joc-en-grup.github.io/Per-Aspera-Ad-Lucem/resources/dialog/DRdialog.png"
    );
    this.load.image(
      "team-dialeg",
      "https://lucem-joc-en-grup.github.io/Per-Aspera-Ad-Lucem/resources/dialog/teamdialog.png"
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

    
//
//
//

    this.canSkip = false;
    this.dialegs = [
        ["Good to see you, Doctor Greenaway. Here is your equipment.", "doctor"],
        ["I'm glad you made it safely, Doctor, and thank you, now we can set up camp and start recording our Aurora Borealis observation.", "team"],
        ["Those bears were no match for my dedication to be here tonight. I'mready to hear the song of the skyes.", "doctor"],
        ["Dramatic as always. Let's not waste time then. Through challenges to the light!", "team"]
    ]
    this.dialegActual = 0;
    this.dialegPantalla = new Dialogo(this, this.dialegs[this.dialegActual][0], this.dialegs[this.dialegActual][1]);
    this.dialegPantalla.on("dialogoCompleto", () => {
        console.log("Dialeg complet");
        this.canSkip = true;
    })

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
              setTimeout(() => {loadpage("https://lucem-joc-en-grup.github.io/Per-Aspera-Ad-Lucem/index.html")}, 4000);
            })
            });
        }
    }
  }
}
class Dialogo extends Phaser.GameObjects.Container {
  constructor(scene, dialogText, character = "team") {
    super(scene);

    this.scene = scene;
    this.dialogText = dialogText;
    this.character = character;

    const dialogTextStyle = {
      fontFamily: "MyFont",
      fontSize: "32px",
      color: "#ffed89",
      align: "left",
      wordWrap: { width: 400, useAdvancedWrap: true },
    };

    let dialog;
    if (character === "team") {
      dialog = this.scene.add.image(
        this.scene.centerX,
        this.scene.centerY,
        "team-dialeg"
      );
    } else {
      dialog = this.scene.add.image(
        this.scene.centerX,
        this.scene.centerY,
        "doctor-dialeg"
      );
    }

    let text = this.scene.add.text(
      this.scene.centerX,
      this.scene.centerY + 350,
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
