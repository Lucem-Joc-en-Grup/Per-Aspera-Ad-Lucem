"use strict";

const states = {
    idle: 0,
    jump: 1,
    fall: 2,
    land: 3,
    attack: 4,
    sneak: 5,
    sneakAttack: 6,
    damage: 7,
    death: 8,
};

const SPEED = 225;

export default class Rata extends Phaser.GameObjects.Sprite {
    constructor(data, hp = 1) {
        let { scene, x, y, texture, frame } = data;
        super(scene, x, y, texture, frame);
        // Variables del personatge
        this.hitPoints = hp;
        // this.actualState = states.idle;
        this.isDead = false;
        this.speed = SPEED;
        this.dreta = true;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.setScale(0.25);
    }
    create() {
        this.scene.physics.world.enable(this);
        this.body.setBounce(0.1); // Configurar el rebot del jugador
        this.setFlipX(true);
        if(!this.scene.anims.exists("walk_rata")){
            this.scene.anims.create({
                key: "walk_rata",
                frames: this.scene.anims.generateFrameNumbers("rat_walk", {
                    start: 0,
                    end: 1,
                }),
                frameRate: 5,
            });

        }
    }
    update() {
        if(this.scene.pause) return;
        this.body.setVelocityX(this.speed);
        this.anims.play("walk_rata", true);

    }
    flip(){
        this.speed*=-1;
        this.setFlipX(this.speed > 0);

    }
}