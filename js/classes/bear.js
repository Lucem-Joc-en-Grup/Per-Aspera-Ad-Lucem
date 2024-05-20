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

const SPEED = 200;

export default class Bear extends Phaser.GameObjects.Sprite {
    constructor(data, hp = 1) {
        let { scene, x, y, texture, frame } = data;
        super(scene, x, y, texture, frame);
        // Character variables
        this.hitPoints = hp;
        // this.actualState = states.idle;
        this.isDead = false;
        this.speed = SPEED;
        this.dreta = true;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.setScale(0.5);
    }
    create() {
        this.scene.physics.world.enable(this);
        this.body.setBounce(0.1); // Player's bounce
        this.setFlipX(true);
        if(!this.scene.anims.exists("walk_bear")){
            this.scene.anims.create({
                key: "walk_bear",
                frames: this.scene.anims.generateFrameNumbers("bear_walk", {
                    start: 0,
                    end: 3,
                }),
                frameRate: 5,
            });

        }
    }
    update() {
        if(this.scene.pause) return;
        this.body.setVelocityX(this.speed);
        this.anims.play("walk_bear", true);

    }
    flip(){
        this.speed*=-1;
        this.setFlipX(this.speed > 0);

    }
}