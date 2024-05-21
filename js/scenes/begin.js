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

export default class Begin extends Phaser.Scene {
  constructor() {
    super("Begin");
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
    let bg = this.add.image(this.centerX, this.centerY, "backgroundB");
    bg.setScale(this.canvasWidth / bg.height);

//
//
//

    this.canSkip = false;
    this.dialegs = [
        ["Doctor Greenaway? This is Doctor Bjornson form Rangá Observatory. Do you copy? Over.", "doctor"],
        ["Affirmative. Although the signal is bad out here. Are you ready to join my team for the expedition? Over.", "team"],
        ["Affirmative. Do you need any additional equipment from the Observatory? Over.", "doctor"],
        ["Negative, Doctor. We had all the supplies we needed but on our way to the observation point our team had to flee local bears. A few of the assistants dropped their bags with gear, equipment and food.", "team"],
        ["I remember that you are experienced in bear encounters so we hope that you could collect our lost gear on your way to us. Or the expedition will have to be cut short. Over.", "team"],
        ["Copy that. I am too excited to hear the Aurora song so I will help you. How did your team move through the forest and what is your 20, Doctor Greenaway? Over.", "doctor"],
        ["We are camping near the Vatnajökull Glacier. You will be able to follow our path by our campfires <b>[Q]</b>. We had to run all around, left <b>[A]</b> and right <b>[D]</b>, jump on the bushes <b>[W]</b> and sneak under the rocks <b>[S]</b>.", "team"],
        ["Our physicist had to protect us from the bears with his pickaxe <b>[E]</b> but we were able to take a pause and rest time from time <b>[ESC]</b>. I hope you find us soon, Doctor, wouldn't want to miss this show. Out.", "team"]
    ];
    this.dialegActual = 0;
    this.dialegPantalla = new Dialogo(this, this.dialegs[this.dialegActual][0], this.dialegs[this.dialegActual][1]);
    this.dialegPantalla.on("dialogoCompleto", () => {
        console.log("Dialeg complet");
        this.canSkip = true;
    })

    if(localStorage.getItem("carregar")==1){
      if(this.game.config.escena=="Nivell1") localStorage.setItem("carregar",0);
      this.scene.stop();
      this.scene.launch("Nivell1");
    }

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
                this.scene.stop();
                this.scene.launch("Nivell1");
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
      fontSize: "28px",
      color: "#FFFFFF",
      align: "left",
      wordWrap: { width: 800, useAdvancedWrap: true },
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
