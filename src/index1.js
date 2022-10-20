let game;

const gameOptions = {
    dudeGravity: 800,
    dudeSpeed: 300
}

window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: "#112211",
        scale: {

            width: 800,
            height: 1000,
        },
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 0
                }
            }
        },
        scene: PlayGame
    }

    game = new Phaser.Game(gameConfig)
    window.focus();
}

class PlayGame extends Phaser.Scene {

    constructor() {
        super("PlayGame")
        this.score = 0;
        this.highScore = 0;
        this.bulletCount = 0;
    }


    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('orb_blue', 'assets/orb-blue.png');
        this.load.image('orb_red', 'assets/orb-red.png');
        this.load.image("ground", "assets/platform.png")
        this.load.image("star", "assets/star.png")
        this.load.spritesheet("dude", "assets/dude.png", {frameWidth: 32, frameHeight: 48})
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('bullet', 'assets/green_ball.png');
    }

    

    create() {

        this.add.image(400, 500, 'sky');
        this.groundGroup = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })

        this.bombBorder = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })

        for(let i = 0; i < 14; i++) {
            this.groundGroup.create(Phaser.Math.Between(45, game.config.width), 71*i, "ground").setScale(0.5);
        }

        this.groundGroup.create(415, 600,"ground").setScale(0.5);
        this.bombBorder.create(400, 1031,"ground").setScale(2);
        



        this.dude = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, "dude")
        this.dude.body.gravity.y = gameOptions.dudeGravity
        this.physics.add.collider(this.dude, this.groundGroup)

        this.starsGroup = this.physics.add.group({})
        this.redGroup = this.physics.add.group({})
        this.blueGroup = this.physics.add.group({})
        this.bulletGroup = this.physics.add.group();
        this.bombs = this.physics.add.group();

        
        this.physics.add.collider(this.bulletGroup, this.groundGroup, bulletRemoval, null, this)

        this.physics.add.collider(this.bombs, this.bulletGroup, bombDestructor, null, this)



        this.physics.add.collider(this.starsGroup, this.groundGroup)
        this.physics.add.collider(this.redGroup, this.groundGroup)
        this.physics.add.collider(this.blueGroup, this.groundGroup)


        
        this.physics.add.collider(this.bombs, this.groundGroup);

        this.physics.add.collider(this.dude, this.bombs, bombing, null, this);  

        this.physics.add.collider(this.bombs, this.bombBorder, bombRemoval, null, this)
        

        this.physics.add.overlap(this.dude, this.starsGroup, this.collectStar, null, this)
        this.physics.add.overlap(this.dude, this.redGroup, this.collectRed, null, this)
        this.physics.add.overlap(this.dude, this.blueGroup, this.collectBlue, null, this)

        this.add.image(16, 49, "star")
        this.highScoreText = this.add.text(2, 3, "High score: "+this.highScore, {fontSize: "30px", fill: "#ffffff"})
        this.scoreText = this.add.text(32, 35, "0", {fontSize: "30px", fill: "#ffffff"})
        


        this.cursors = this.input.keyboard.createCursorKeys()

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: "turn",
            frames: [{key: "dude", frame: 4}],
            frameRate: 10,
        })

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {start: 5, end: 9}),
            frameRate: 10,
            repeat: -1
        })

        this.triggerTimer = this.time.addEvent({
            callback: this.addGround,
            callbackScope: this,
            delay: 1400,
            loop: true
        })

        function bombing (dude, bombs)
        {
    
        this.physics.pause();
    
        this.dude.setTint(0xff0000);
        this.dude.anims.play('turn');

        if (this.score > this.highScore){
            this.highScore = this.score
        }
        this.score = 0  
        this.bulletCount = 0
        this.scene.start("PlayGame");

        }

        function bombRemoval(bombs){
            bombs.destroy()
        }

        function bulletRemoval(bullet){
            bullet.destroy()
            this.bulletCount -= 1
        }

        function bombDestructor(bombs, bullet){
            bombs.destroy()
            bullet.destroy()
            this.bulletCount -= 1
        }




    } //end of create

    addGround() {
        console.log("Adding new stuff!")
        this.groundGroup.create(Phaser.Math.Between(35, game.config.width), 0, "ground").setScale(0.5)
        this.groundGroup.setVelocityY(gameOptions.dudeSpeed / 6)

        if(Phaser.Math.Between(0, 1)) {
            this.blueGroup.create(Phaser.Math.Between(0, game.config.width), 0, "orb_blue")
            this.blueGroup.setVelocityY(gameOptions.dudeSpeed)

        }else if(Phaser.Math.Between(-1, -0,4)){
            this.redGroup.create(Phaser.Math.Between(0, game.config.width), 0, "orb_red")
            this.redGroup.setVelocityY(gameOptions.dudeSpeed*2)

        } else {
            for(let i = 0; i<Math.floor((this.score/5)); i++){
                var bomb = this.bombs.create(Phaser.Math.Between(0, game.config.width), 0, 'bomb');
                bomb.setBounce(1.05);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(150, 300));
            }
        }
    }

    collectStar(dude, star) {
        this.score += 1
        star.disableBody(true, true)
        this.scoreText.setText(this.score)
    }
    collectRed(dude, red) {
        this.score += 3

        red.disableBody(true, true)
        this.scoreText.setText(this.score)
    }
    collectBlue(dude, blue) {
        this.score += 1

        blue.disableBody(true, true)
        this.scoreText.setText(this.score)
    }

        
    fire() {

        if(this.bulletCount < 1){
        
            var bullet = this.bulletGroup.create(this.dude.x, this.dude.y, 'bullet');
            this.bulletCount += 1;
            bullet.setBounce(1);
            bullet.setCollideWorldBounds(true);
            this.physics.moveTo(bullet,this.game.input.mousePointer.x, this.game.input.mousePointer.y,gameOptions.dudeSpeed*3)
            
    }
}

    update() {
        if(this.cursors.left.isDown) {
            this.dude.body.velocity.x = -gameOptions.dudeSpeed
            this.dude.anims.play("left", true)
        }
        else if(this.cursors.right.isDown) {
            this.dude.body.velocity.x = gameOptions.dudeSpeed
            this.dude.anims.play("right", true)
        }
        else {
            this.dude.body.velocity.x = 0
            this.dude.anims.play("turn", true)
        }

        if(this.cursors.up.isDown && this.dude.body.touching.down) {
            this.dude.body.velocity.y = -gameOptions.dudeGravity / 1.6
        }

        if(this.dude.x > game.config.width) {
            this.dude.x = 0
        }
        if(this.dude.x < 0) {
            this.dude.x = game.config.width
        }

        if (this.bulletGroup.y>game.config.height || this.bulletGroup.y < 0 || this.bulletGroup.x>game.config.width || this.bulletGroup.x<0){
            console.log("Here!")
            this.bulletGroup.destroy()
        }


        if(this.dude.y > game.config.height || this.dude.y < 0) {
            this.scene.start("PlayGame")
            console.log(this.highScore, this.score)
            if (this.score > this.highScore){
                this.highScore = this.score
            }
            this.score = 0  
            this.bulletCount = 0

        }

        if (game.input.activePointer.isDown){ this.fire() }

    }


}
