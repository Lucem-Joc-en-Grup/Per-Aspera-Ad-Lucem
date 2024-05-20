export default class Pause extends Phaser.Scene {
    constructor() {
        super("Pause");
    }
    preload(){

    }
    create(){
        let { width, height } = this.sys.game.canvas;
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.add.rectangle(this.canvasWidth/2, this.canvasHeight/2, this.canvasWidth, this.canvasHeight, 0x41494F);
        this.add.text(this.canvasWidth/2 - 130, 50, "Pause", { fontSize: "130px", fontFamily: "MyFont" })
        const botoContinuar = this.add.text(this.canvasWidth/2 - 170, 200, "Resume", { fontSize: "100px", fontFamily: "MyFont", fill: '#000', backgroundColor: '#5B666F', textPadding: {x: 0, y:0}, fixedWidth: 300, fixedHeight: 100, align: 'center' });
        botoContinuar.setInteractive();
        botoContinuar.on('pointerdown', () => {this.game.scene.resume(this.game.config.current);
        this.scene.stop(); console.log("continuar")});
        
        const botoGuardar = this.add.text(this.canvasWidth/2 - 170, 325, "Save", { fontSize: "100px", fontFamily: "MyFont", fill: '#000', backgroundColor: '#5B666F', textPadding: {x: 0, y:0}, fixedWidth: 300, fixedHeight: 100, align: 'center' });
        botoGuardar.setInteractive();
        botoGuardar.on('pointerdown', () => {
            console.log(this.game.config.current);
            console.log(JSON.stringify({"lives":this.game.config.current.videsStart,"bears":this.game.config.current.ratesStart,"escena":this.game.config.current.scene.key}));
            localStorage.setItem("partida",JSON.stringify({"lives":this.game.config.current.videsStart,"bears":this.game.config.current.ratesStart,"escena":this.game.config.current.scene.key}))
            this.add.text(this.canvasWidth/2 - 210, 600, "Game saved!", { fontSize: "75px", fontFamily: "MyFont", align: 'center' });
        });
        const botoSortir = this.add.text(this.canvasWidth/2 - 170, 450, "Leave", { fontSize: "100px", fontFamily: "MyFont", fill: '#000', backgroundColor: '#5B666F', textPadding: {x: 0, y:0}, fixedWidth: 300, fixedHeight: 100, align: 'center' });
        botoSortir.setInteractive();
        botoSortir.on('pointerdown', () => {
            loadpage("../../index.html");
        });
        this.input.keyboard.on('keydown-ESC', () => {
            this.game.scene.resume(this.game.config.current);
            this.scene.stop();
        }, this);

    }
    update(){
        
    }
}