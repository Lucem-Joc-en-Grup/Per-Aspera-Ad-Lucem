"use strict";

const states = {
    idle: 0,
    walk: 10,
    jump: 1,
    fall: 2,
    land: 3,
    attack: 4,
    sneak: 5,
    sneakWalk: 6,
    sneakAttack: 7,
    damage: 8,
    death: 9,
};

const SPEED = 250;
const JUMP_SPEED = 200;
const SPRITE_X = 75;
const SPRITE_Y = 90;

export default class Doctor extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, x, y, texture, frame } = data;
        super(scene, x, y, texture, frame);
        // Character variables
        this.hitPoints = this.scene.game.config.vides;
        this.rates=this.scene.game.config.ratesMatades;
        this.actualState = states.idle;
        this.isDead = false;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.setScale(0.25);
        this.moving = false;
        this.canMove = true;
        this.hitbox = {
            sizeX: 75,
            sizeY: 84,
            offsetX: 0,
            offsetY: 6
        }
        this.canTakeDamage = true;
        this.invencible = false;
    }
    create() {
        console.log("Create Doctor");
        this.scene.physics.world.enable(this);
        this.body.setBounce(0.1); // Player's bounce
        if(!this.scene.anims.exists("walk")){
      this.scene.anims.create({
        key: "walk",
        frames: this.scene.anims.generateFrameNumbers("doc_up", {
          start: 6,
          end: 11,
        }),
        frameRate: 6,
        repeat: 0,
      });
      this.scene.anims.create({
        key: "attack",
        frames: this.scene.anims.generateFrameNumbers("doc_up", {
          start: 18,
          end: 22,
        }),
        frameRate: 6,
        repeat: 0,
      });
      this.scene.anims.create({
        key: "sneak",
        frames: this.scene.anims.generateFrameNumbers("doc_down", {
          start: 0,
          end: 0,
        }),
        frameRate: 6,
        repeat: 0,
      });
      this.scene.anims.create({
        key: "sneak_walk",
        frames: this.scene.anims.generateFrameNumbers("doc_down", {
          start: 0,
          end: 4,
        }),
        frameRate: 6,
        repeat: 0,
      });
      this.scene.anims.create({
        key: "sneak_attack",
        frames: this.scene.anims.generateFrameNumbers("doc_down", {
          start: 6,
          end: 9,
        }),
        frameRate: 6,
        repeat: 0,
      });
      this.scene.anims.create({
        key: "jump",
        frames: this.scene.anims.generateFrameNumbers("doc_up", {
          start: 12,
          end: 14,
        }),
        frameRate: 6,
        repeat: 0,
      });
      this.scene.anims.create({
        key: "fall",
        frames: this.scene.anims.generateFrameNumbers("doc_up", {
          start: 14,
          end: 14,
        }),
        frameRate: 6,
      });
      this.scene.anims.create({
        key: "land",
        frames: this.scene.anims.generateFrameNumbers("doc_up", {
          start: 13,
          end: 13,
        }),
        frameRate: 6,
        repeat: 0,
      });
      this.scene.anims.create({
        key: "idle",
        frames: this.scene.anims.generateFrameNumbers("doc_up", {
          start: 0,
          end: 0,
        }),
        frameRate: 0,
      });
      this.scene.anims.create({
        key: "damage",
        frames: this.scene.anims.generateFrameNumbers("doc_up", {
          start: 1,
          end: 1,
        }),
        frameRate: 1,
      });
      this.scene.anims.create({
        key: "death",
        frames: this.scene.anims.generateFrameNumbers("doc_down", {
          start: 11,
          end: 11,
        }),
        frameRate: 0,
      });
    }
    this.on("animationstart", () => {
      if (this.actualState == states.attack || this.actualState == states.sneakAttack) this.atacar();
    });
  }
  update() {
    //
    // MOVE _____________________________________________________________________________
    if (this.scene.inputKeys.left.isDown && this.canMove) {
      this.setFlipX(true);
      this.body.setVelocityX(-SPEED);
      this.moving = true;
    } else if (this.scene.inputKeys.right.isDown && this.canMove) {
      this.setFlipX(false);
      this.body.setVelocityX(SPEED);
      this.moving = true;
    } else {
      this.body.setVelocityX(0);
      this.moving = false;
    }
    if (this.scene.inputKeys.posicio_doc.isDown) console.log("x: ",this.body.x,", y: ",this.body.y);
    // STATE MACHINE ____________________________________________________________________
    switch (this.actualState) {
      case states.idle: // ----------------------------------- IDLE
        if (this.scene.inputKeys.jump.isDown) {
          this.setState(states.jump);
          break;
        }
        if (this.scene.inputKeys.attack.isDown) {
          this.setState(states.attack);
          break;
        }
        if (this.scene.inputKeys.sneak.isDown) {
          this.setState(states.sneak);
          break;
        }
        if (this.moving) {
          this.setState(states.walk);
          break;
        }
        if (!this.body.onFloor()) {
          this.setState(states.fall);
          break;
        }
        this.anims.play("idle", true);
        break;
      case states.walk: // ----------------------------------- WALK
        if (this.scene.inputKeys.jump.isDown) {
          this.setState(states.jump);
          break;
        }
        if (this.scene.inputKeys.attack.isDown) {
          this.setState(states.attack);
          break;
        }
        if (this.scene.inputKeys.sneak.isDown) {
          this.setState(states.sneak);
          break;
        }
        if (!this.moving) {
          this.setState(states.idle);
          break;
        }
        this.anims.play("walk", true);
        break;
      case states.attack: // --------------------------------- ATTACK
        this.on("animationcomplete", () => {
            this.setState();
        });
        
        this.anims.play("attack", true);
        break;
      case states.sneak: // ---------------------------------- SNEAK
        if (!this.scene.inputKeys.sneak.isDown && this.canGetUp()) {
          this.setState();
          break;
        }
        if (this.scene.inputKeys.attack.isDown) {
          this.setState(states.sneakAttack);
          break;
        }
        if (this.moving) {
          this.setState(states.sneakWalk);
          break;
        }
        this.anims.play("sneak", true);
        break;
      case states.sneakWalk: // ------------------------------ SNEAK WALK
        if (!this.scene.inputKeys.sneak.isDown && this.canGetUp()) {
          this.setState();
          break;
        }
        if (this.scene.inputKeys.attack.isDown) {
          this.setState(states.sneakAttack);
          break;
        }
        if (!this.moving) {
          this.setState(states.sneak);
          break;
        }
        this.anims.play("sneak_walk", true);
        break;
      case states.sneakAttack: // ---------------------------- SNEAK ATTACK
        this.on("animationcomplete", () => {
          this.setState(states.sneak);
        });
        this.anims.play("sneak_attack", true);
        break;
      case states.jump: // ----------------------------------- JUMP
        this.on("animationcomplete", () => {
          this.setState(states.fall);
        });
        this.anims.play("jump", true);
        this.body.setVelocityY(-JUMP_SPEED);
        break;
      case states.fall: // ----------------------------------- FALL
        if (this.body.onFloor()) {
          this.setState(states.land);
          break;
        }
        this.anims.play("fall", true);
        break;
      case states.land: // ----------------------------------- LAND
        this.anims.play("land", true);
        this.on("animationcomplete", () => {
          this.setState(states.idle);
        });
        break;
      case states.damage: // --------------------------------- DAMAGE
      if(this.isDead) break;
        this.anims.play("damage", true);
        if(this.invencible) break;
        this.invencible = true;
        var timeout = setTimeout(() => {this.invencible=false},2500);
        var cam = this.scene.cameras.main;
        if (!this.canTakeDamage) break;
        this.canTakeDamage = false;
        this.scene.time.addEvent({
          delay: 500,
          callback: () =>{
              this.hitPoints--;
              this.scene.game.config.vides--;
              console.log("Doctor Bjornson damaged. " + this.hitPoints + " hit points left");
              this.scene.canviarVidesUI(this.hitPoints);

              if (this.hitPoints <= 0) {
                this.setState(states.death);
              }
              else if (this.scene.inputKeys.sneak.isDown || !this.canGetUp()) {
                this.canTakeDamage = true;
                this.setState();
              } else {
                this.canTakeDamage = true;
                this.setState();
              }
          },
          loop: false
        });
        break;
      case states.death: // ---------------------------------- DEATH
        this.anims.play("death", true);
        if(this.isDead) break;
        this.isDead = true;
        var cam = this.scene.cameras.main;
        cam.shake(500);
        this.scene.time.addEvent({
            delay: 2000,
            callback: () =>{
                cam.fade(2000);
            },
            loop: false
        });
        cam.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
          cam.fadeIn(500);
          var rect = this.scene.add.rectangle(this.scene.canvasWidth/2, this.scene.canvasHeight/2, this.scene.canvasWidth, this.scene.canvasHeight, 0x000000);
          var text = this.scene.add.text(this.scene.canvasWidth/2-180, this.scene.canvasHeight/2-75, "GAME OVER", { fontSize: "100px", fontFamily: "MyFont" })
          text.setScrollFactor(0);
          rect.setScrollFactor(0);
          this.scene.gameOver = true;
          setTimeout(() => {loadpage("https://lucem-joc-en-grup.github.io/Per-Aspera-Ad-Lucem/index.html")}, 4000);
        })
        break;
    }
  }
  changeHitbox() {
    if (this.actualState == states.sneak || this.actualState == states.sneakAttack || this.actualState == states.sneakWalk || this.actualState == states.death) {
      this.hitbox.sizeX = 75;
      this.hitbox.sizeY = 63;
    } else {
      this.hitbox.sizeX = 75;
      this.hitbox.sizeY = 84;
    }
    
    this.hitbox.offsetX = (SPRITE_X - this.hitbox.sizeX) - 10;
    this.hitbox.offsetY = (SPRITE_Y - this.hitbox.sizeY ) - 10;
    
    this.body.setSize(this.hitbox.sizeX, this.hitbox.sizeY);
    this.body.setOffset(this.hitbox.offsetX, this.hitbox.offsetY);
  }
  setState(newState = states.idle) {
    this.actualState = newState;
    if (this.actualState != states.fall) this.changeHitbox();
    if (this.actualState == states.attack 
      || this.actualState == states.sneakAttack 
      || this.actualState == states.damage 
      || this.actualState == states.death) this.canMove = false;
    else this.canMove = true;
  }
  canGetUp() {
    // TODO: canGetUp
    return true;
  }
  atacar() {
      var x = 70;
      if (this.flipX) x = -60;
      var atac = new Phaser.Geom.Rectangle(this.x + x, this.y + 15, 80, 70);
      if(this.scene.physics.config.debug) this.scene.add.rectangle(this.x + x, this.y + 15, 80, 70, 0xff0000);
      var isAnyEnemyInRange = false;
      for (var i = 0; i < this.scene.rates.length; i++) {
        var enemy = this.scene.rates[i];
        if (Phaser.Geom.Intersects.RectangleToRectangle(atac, enemy.getBounds())) {
          isAnyEnemyInRange = true;
          break;
        }
      }
      if(isAnyEnemyInRange && this.scene.rates[i].active){
        this.rates++;
        this.scene.game.config.ratesMatades++;
        this.scene.rates[i].setActive(false).setVisible(false);
        this.scene.canviarRatesUI(this.rates);
      }
  }
  rebreMal(){
    if(!this.invencible)this.setState(states.damage);
    
  }
  die() {

  }
}
