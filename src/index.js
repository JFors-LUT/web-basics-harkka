let game;


const gameOptions = {
    dudeGravity: 800,
    dudeSpeed: 300
}

window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: "#112211",
        parent: "myGame",
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
        },    audio: {
            disableWebAudio: false
        },
        scene: [GameStart, PlayGame, GameOver, LevelTwo, GameWon]
    }
    

    game = new Phaser.Game(gameConfig)
    window.focus();
}

class GameStart extends Phaser.Scene
{
constructor()
{

super('GameStart')

}

    preload(){

    }

    create()
    {

        this.add.text(game.config.width/2, game.config.height/10, 'Welcome to ', {font: '72px ComicSans'}).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/6, 'Simple Jump Game!', {font: '72px ComicSans'}).setOrigin(0.5)

        this.add.text(game.config.width/2, game.config.height/3, 'Move with arrow keys', {font: '32px ComicSans'}).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2.6, 'Collect spawning orbs', {font: '32px ComicSans'}).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2.3, 'Aim and shoot spawning bombs with mouse', {font: '32px ComicSans'}).setOrigin(0.5)

        this.add.text(game.config.width/2, game.config.height/2, 'Reach 50 score to advance to next level', {font: '32px ComicSans'}).setOrigin(0.5)
        
        this.add.text(game.config.width/2, game.config.height/1.15, '(Press Enter to start the game', {font: '32px ComicSans'}).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/1.1, '(or hit ESC to skip the first level)', {font: '32px ComicSans'}).setOrigin(0.5)

    }
 
    update(){  

        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

            //enter to access level 1 and ESC to access level 2
         if (this.keyEnter.isDown){
            this.scene.start('PlayGame') 

        } else if(this.keyESC.isDown){
            this.scene.start('PlayGame2') 

        }

    
}
}

class GameOver extends Phaser.Scene
{
constructor()
{
super('GameOver')

}

    create(data)
    {
        this.level = data
        this.add.text(game.config.width/2, game.config.height/2, 'Game Over', {fontSize: 72}).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/1.8, '(Press space to continue)', {fontSize: 22}).setOrigin(0.5)
        
    }

    update(){       
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
         //if (game.input.activePointer.isDown){ this.scene.start('PlayGame') }
         if (this.keySpace.isDown){ 
            console.log(this.level == 1)
            
            if(this.level == 1) //relaunch based on the current level value 
            {
            this.scene.start('PlayGame') 
            } else
            {
            this.scene.start('PlayGame2')
            }
        }
    }
}

class GameWon extends Phaser.Scene
{
constructor()
{
super('GameWon')

}

    create(data)
    {
        this.level = data
        console.log(this.level)
        if (this.level == 2){
            this.add.text(game.config.width/2, game.config.height/4, 'Congratulations!', {fontSize: 64}).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/3, 'You completed', {fontSize: 64}).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2.4, 'tutorial level!', {fontSize: 64}).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/1.4, '(Press space to continue)', {fontSize: 22}).setOrigin(0.5)
         } else if(this.level == 3){
            this.add.text(game.config.width/2, game.config.height/4, 'Congratulations!', {fontSize: 64}).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/3, 'You beat the game', {fontSize: 64}).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/1.4, '(Press space to continue)', {fontSize: 22}).setOrigin(0.5)
         }
    }

    update(){       
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
         //if (game.input.activePointer.isDown){ this.scene.start('PlayGame') }
         if (this.keySpace.isDown && this.level == 2){ 
            console.log("entering level: ", this.level)
            this.scene.start('PlayGame2')
        } else if(this.keySpace.isDown && this.level == 3){
            this.scene.start('GameStart')
        }
    }
}



class PlayGame extends Phaser.Scene {

    constructor() {
        super("PlayGame")
        this.score = 0;
        this.highScore = 0;
        this.bulletCount = 0;
        this.level = 1;
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
        //audio and pictures from phaser asset library
        this.load.audio('shoot', 'assets/Soundeffect/pistol.wav'); 
        this.load.audio('jump', 'assets/Soundeffect/steps1.mp3');
        this.load.audio('land', 'assets/Soundeffect/steps2.mp3');
        this.load.audio('explode', 'assets/Soundeffect/explosion.mp3');
        
        this.load.audio('theme', 'assets/Soundeffect/Pixelland.mp3'); //https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1500076&Search=Search
        
    }
    
    create(data) {

        this.music = this.sound.add('theme',{volume: 0.3, loop: true});

        this.shoot = this.sound.add('shoot');
        this.jump = this.sound.add('jump');
        this.land = this.sound.add('land');
        this.explode = this.sound.add('explode');

        this.music.play();

        this.name = data
        this.cursors = this.input.keyboard.createCursorKeys()
        this.bulletCount = 0;

        this.add.image(400, 500, 'sky');


        this.groundGroup = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })

        this.bombBorder = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })

        //spawning initial game screen
        spawnGround(this.groundGroup)
        
        this.groundGroup.create(415, 600,"ground").setScale(0.5);
        this.bombBorder.create(400, 1031,"ground").setScale(2); //layer to destroy bomb objects when the reach bottom of the level
        

        this.dude = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, "dude")
        this.dude.body.gravity.y = gameOptions.dudeGravity
        this.physics.add.collider(this.dude, this.groundGroup)

        this.starsGroup = this.physics.add.group({})
        this.redGroup = this.physics.add.group({})
        this.blueGroup = this.physics.add.group({})
        this.bulletGroup = this.physics.add.group();
        this.bombs = this.physics.add.group();

        
        this.physics.add.collider(this.bulletGroup, this.groundGroup, bulletRemoval, null, this) //bullets destroyed on hitting with ground object
        this.physics.add.collider(this.bombs, this.bulletGroup, bombDestructor, null, this)     //bullet hits bomb and both annihilate

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

        if (this.score > this.highScore){
            this.highScore = this.score
        }
        this.score = 0  
        this.bulletCount = 0
        //this.scene.start("PlayGame");
        this.explode.play()
        this.music.stop()
        this.scene.start("GameOver", this.level);

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
            this.explode.play()
        }

        //spawning intitial arena
        function spawnGround(groundGroup){
            groundGroup.create(415, 600,"ground").setScale(0.5);
            for(let i = 0; i < 12; i++) {
                groundGroup.create(Phaser.Math.Between(45, game.config.width), 80*i+100, "ground").setScale(0.5);
        }}


    
        

    } //end of create


    addGround() {
        console.log("Adding new stuff!")
        this.groundGroup.create(Phaser.Math.Between(35, game.config.width), 0, "ground").setScale(0.5) //modified ground spawn to make smaller blocks
        this.groundGroup.setVelocityY(gameOptions.dudeSpeed / 6)

        if(Phaser.Math.Between(0, 1)) {                                                             
            this.blueGroup.create(Phaser.Math.Between(0, game.config.width), 0, "orb_blue")
            this.blueGroup.setVelocityY(gameOptions.dudeSpeed)

        }else if(Phaser.Math.Between(-1, -0,4)){
            this.redGroup.create(Phaser.Math.Between(0, game.config.width), 0, "orb_red")
            this.redGroup.setVelocityY(gameOptions.dudeSpeed*2)

        } else {
            for(let i = 0; i<Math.floor((this.score/10)); i++){                                          //bombs start spawning after reaching 5 score
                var bomb = this.bombs.create(Phaser.Math.Between(0, game.config.width), 0, 'bomb');
                bomb.setBounce(0.98);
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

        if(this.bulletCount < 1){       //only 1 bullet alive at a time
            this.shoot.play()
            var bullet = this.bulletGroup.create(this.dude.x, this.dude.y, 'bullet'); //bullet spawns at player cordinates
            this.bulletCount += 1;
            bullet.setBounce(1);
            bullet.setCollideWorldBounds(true);
            this.physics.moveTo(bullet,this.game.input.mousePointer.x, 
                this.game.input.mousePointer.y,gameOptions.dudeSpeed*3) //bullet velocity to the direction of the mouse pointer
           
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


        if (!this.dude.body.touching.down){
            this.land.play()
            this.falling = false
        }

        if(this.cursors.up.isDown && this.dude.body.touching.down) {
            this.dude.body.velocity.y = -gameOptions.dudeGravity / 1.6
            this.jump.play()
        }
        //dude wraps around the screen
        if(this.dude.x > game.config.width) {
            this.dude.x = 0
        }
        if(this.dude.x < 0) {
            this.dude.x = game.config.width
        }

        if (this.score > 49){
            this.music.stop()
            this.level += 1
            this.scene.start("GameWon", this.level)
            //this.scene.start("GameOver");
        }

        if(this.dude.y > game.config.height || this.dude.y < 0) {
            this.music.stop()
            this.scene.start("GameOver", this.level);
            //this.scene.start("PlayGame")
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

//second level
class LevelTwo extends Phaser.Scene{
    constructor() {
        super("PlayGame2")
        this.score = 0;
        this.highScore = 0;
        this.bulletCount = 0;
        this.level = 2;
    }


    preload() {
        this.load.image('hell', 'assets/hell.png');
        this.load.image('orb_blue', 'assets/orb-blue.png');
        this.load.image('orb_red', 'assets/orb-red.png');
        this.load.image("ground2", "assets/platform2.png")
        //ice platforms get gradually melted away as score increases
        this.load.image("iceground", "assets/iceform.png")
        this.load.image("star", "assets/star.png")
        this.load.spritesheet("dude", "assets/dude.png", {frameWidth: 32, frameHeight: 48})
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('bullet', 'assets/green_ball.png');
        //audio and pictures from phaser asset library
        this.load.audio('shoot', 'assets/Soundeffect/pistol.wav');
        this.load.audio('jump', 'assets/Soundeffect/steps1.mp3');
        this.load.audio('land', 'assets/Soundeffect/steps2.mp3');
        this.load.audio('explode', 'assets/Soundeffect/explosion.mp3');
        this.load.audio('theme', 'assets/Soundeffect/Enigma-Long-Version-Complete-Version.mp3');  //https://www.chosic.com/download-audio/32067/
        
    }
    
    create() {

        this.keepScore = this.score;

        this.music = this.sound.add('theme',{volume: 0.3, loop: true});

        this.shoot = this.sound.add('shoot');
        this.jump = this.sound.add('jump');
        this.land = this.sound.add('land');
        this.explode = this.sound.add('explode');

        this.music.play();


        this.cursors = this.input.keyboard.createCursorKeys()
        this.bulletCount = 0;

        this.add.image(400, 500, 'hell');
        this.groundGroup = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })

        this.bombBorder = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })

        this.metalGround = this.physics.add.group({
            immovable: true,
            allowGravity: true
        })

        
        spawnGround(this.groundGroup)
        

        this.metalGroup =[this.metalGround.create(100, 800,"iceground").setScale(0.7),
        this.metalGround.create(415, 800,"iceground").setScale(0.7),
        this.metalGround.create(700, 800,"iceground").setScale(0.7)
            ]
       

        this.dude = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, "dude")
        this.dude.body.gravity.y = gameOptions.dudeGravity*6.2
        this.physics.add.collider(this.dude, this.groundGroup)
        this.physics.add.collider(this.dude, this.metalGround)

        this.starsGroup = this.physics.add.group({})
        this.redGroup = this.physics.add.group({})
        this.blueGroup = this.physics.add.group({})
        this.bulletGroup = this.physics.add.group();
        this.bombs = this.physics.add.group();

        
        this.physics.add.collider(this.bulletGroup, this.groundGroup, bulletRemoval, null, this) //bullets destroyed on hitting with ground object
        this.physics.add.collider(this.bombs, this.bulletGroup, bombDestructor, null, this)     //bullet hits bomb and both annihilate

        this.physics.add.collider(this.starsGroup, this.groundGroup)
        this.physics.add.collider(this.redGroup, this.groundGroup)
        this.physics.add.collider(this.blueGroup, this.groundGroup)
        this.physics.add.collider(this.bombs, this.groundGroup);
        

        this.physics.add.collider(this.bombs, this.metalGround);
        this.physics.add.collider(this.bulletGroup, this.metalGround, bulletRemoval, null, this);

        this.physics.add.collider(this.dude, this.bombs, bombing, null, this);  
        this.physics.add.collider(this.bombs, this.bombBorder, bombRemoval, null, this) //object to destroy bombs when they hit bottom of the screen
        
        this.physics.add.overlap(this.dude, this.starsGroup, this.collectStar, null, this)
        this.physics.add.overlap(this.dude, this.redGroup, this.collectRed, null, this)
        this.physics.add.overlap(this.dude, this.blueGroup, this.collectBlue, null, this)

        this.add.image(16, 49, "star")
        this.highScoreText = this.add.text(2, 3, "High score: "+this.highScore, {fontSize: "30px", fill: "#ffffff"})
        this.scoreText = this.add.text(32, 35, "0", {fontSize: "30px", fill: "#ffffff"})
        

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
            delay: 1000,
            loop: true
        })

        function bombing (dude, bombs)
        {

        if (this.score > this.highScore){
            this.highScore = this.score
        }
        this.score = 0  
        this.bulletCount = 0
        //this.scene.start("PlayGame");
        this.explode.play()
        this.music.stop()
        this.scene.start("GameOver", this.level);

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
            this.explode.play()
        }

        function weaken(dude, ground){
            console.log(ground.scale)
            if (ground.scale = 0.5){}
            ground.destroy()
            

            this.metalGround.create(410, 600,"ground2").setScale(ground.scale-0.1);

        }

        function spawnGround(groundGroup){
            groundGroup.create(415, 600,"ground2").setScale(0.5);
            for(let i = 0; i < 7; i++) {
                groundGroup.create(Phaser.Math.Between(45, game.config.width-45), 120*i+200, "ground2").setScale(0.5);
        }}

    } //end of create

    addGround() {
        console.log("Adding new stuff!")
        this.groundGroup.create(Phaser.Math.Between(35, game.config.width), 0, "ground2").setScale(0.5) //modified ground spawn to make smaller blocks
        this.groundGroup.setVelocityY(gameOptions.dudeSpeed / 2)

        if(Phaser.Math.Between(0, 1)) {                                                             
            this.blueGroup.create(Phaser.Math.Between(0, game.config.width), 0, "orb_blue")
            this.blueGroup.setVelocityY(gameOptions.dudeSpeed)

        }else if(Phaser.Math.Between(-1, -0,4)){
            this.redGroup.create(Phaser.Math.Between(0, game.config.width), 0, "orb_red")
            this.redGroup.setVelocityY(gameOptions.dudeSpeed*2)

        } else {
            for(let i = 0; i<Math.floor((this.score/10)); i++){                                          //bombs start spawning after reaching 5 score
                var bomb = this.bombs.create(Phaser.Math.Between(0, game.config.width), 0, 'bomb');
                bomb.setBounce(0.94);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(300, 500));             
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

        if(this.bulletCount < 1){       //only 1 bullet alive at a time
            this.shoot.play()
            var bullet = this.bulletGroup.create(this.dude.x, this.dude.y, 'bullet'); //bullet spawns at player cordinates
            this.bulletCount += 1;
            bullet.setBounce(1);
            bullet.setCollideWorldBounds(true);
            this.physics.moveTo(bullet,this.game.input.mousePointer.x, 
                this.game.input.mousePointer.y,gameOptions.dudeSpeed*3) //bullet velocity to the direction of the mouse pointer
            
    }
}

    shrinkGround(){
        this.lgth = this.metalGroup.length

        while (this.lgth>0){
            //this.metalGroup[this.olio]
            this.metalGroup.pop().destroy()
            console.log(this.metalGroup) 
            this.lgth -=1
        }

        if(this.score>10 && this.score<21){
            this.metalGroup =[this.metalGround.create(100, 800,"iceground").setScale(0.5),
            this.metalGround.create(415, 800,"iceground").setScale(0.5),
            this.metalGround.create(700, 800,"iceground").setScale(0.5)
                ]
        } else if(this.score>20 && this.score<31){
            this.metalGroup =[this.metalGround.create(100, 800,"iceground").setScale(0.3),
            this.metalGround.create(415, 800,"iceground").setScale(0.3),
            this.metalGround.create(700, 800,"iceground").setScale(0.3)
                ]

        } else if(this.score>30 && this.score<41){
            this.metalGroup =[this.metalGround.create(100, 800,"iceground").setScale(0.1),
            this.metalGround.create(415, 800,"iceground").setScale(0.1),
            this.metalGround.create(700, 800,"iceground").setScale(0.1)
                ]

        }

    }



    update() {
        if(this.cursors.left.isDown) {
            
            this.dude.body.velocity.x = -gameOptions.dudeSpeed*1.4
            this.dude.anims.play("left", true)
        }
        else if(this.cursors.right.isDown) {
            this.dude.body.velocity.x = gameOptions.dudeSpeed*1.4
            this.dude.anims.play("right", true)
        }
        else {
            this.dude.body.velocity.x = 0
            this.dude.anims.play("turn", true)
        }
        
        if (this.falling = true && !this.dude.body.touching.down){
            this.land.play()
            this.falling = false
        }

        if(this.cursors.up.isDown && this.dude.body.touching.down) {
            this.dude.body.velocity.y = -gameOptions.dudeGravity / 0.5
            this.falling = true
            this.jump.play()
        }

        if(this.dude.x > game.config.width) {
            this.dude.x = 0
        }
        if(this.dude.x < 0) {
            this.dude.x = game.config.width
        }

        if(this.dude.y > game.config.height || this.dude.y < 0) {
            this.music.stop()
            this.scene.start("GameOver", this.level);            
            if (this.score > this.highScore){
                this.highScore = this.score
            }
            this.score = 0  
            this.bulletCount = 0
        }

        if (game.input.activePointer.isDown){ this.fire() }

        if (this.score > this.keepScore && this.score > 10){
            this.keepScore = this.score
            this.shrinkGround() //melting away ice platforms
        }

        if (this.score > 49){
            this.music.stop()
            this.level += 1
            this.scene.start("GameWon", this.level)
        }

    }


}