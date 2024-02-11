class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100

        //Shot counter and score and stats
        this.shotCounter = 0
        this.golfScore = 0
        this.golfStats = 0
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)
        
        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')//Our position we need...
        this.ball.body.setCircle(this.ball.width/2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)
        //this.ball.body.reset(width /2, height - height/10)


        // add walls
        let wallA = this.physics.add.sprite(0, height/4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width/2, width - wallA.width/2))
        wallA.body.setImmovable(true)

        let wallB = this.physics.add.sprite(0, height/2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width/2, width - wallB.width/2))
        wallB.body.setCollideWorldBounds(true) //This setCollideWorldBounds is actually bouncing the obstacle 
        wallB.body.setBounce(1)
        wallB.setVelocityX(200) //How fast the bouncing is 
        wallB.body.setImmovable(true) //makes it stay in-place


        this.walls = this.add.group([wallA, wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(width/2, height/4*3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width/2, width - this.oneWay.width/2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        //Shot,Score,& Stats UI
        let shotCounterConfig = {
            fontFamily: 'Verdana',
            fontSize: '30px',
            backgroundColor: '#F3B141',
            color: '#0023FF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 175
        }
        //For Stat because number is so fat
        let golfStatsConfig ={
            fontFamily: 'Verdana',
            fontSize: '30px',
            backgroundColor: '#F3B141',
            color: '#0023FF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 250
        }
        //The text we gonna see in RN golf game
        this.shotCounterLeft = this.add.text(width / 18, height / 35, 'Shot:' + this.shotCounter, shotCounterConfig)
        this.golfScoreLeft =this.add.text(width / 18, height / 10, 'Score:' + this.golfScore, shotCounterConfig)
        this.golfStatsLeft = this.add.text(width*3/5, height /35, 'Stats:' + this.golfStats + '%', golfStatsConfig)


        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            let shotDirection = pointer.y <= this.ball.y ? 1 : -1
            this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X))
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)

            //Our updates, this for shot & stats
            this.shotCounter += 1
            this.golfStats += 100* Phaser.Math.RoundTo( this.golfScore/this.shotCounter, -2)
            this.shotCounterLeft.text = 'Shots:' + this.shotCounter
            this.golfStatsLeft.text = 'Stats:' + this.golfStats + '%'
        })


        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            //If we hit the ball in cup, it resets the golf ball at its same spot
            ball.setPosition(width / 2, height - height / 10)
            ball.setVelocity(0)

            //Our updates, this for score & stats
            this.golfScore +=1
            this.golfStats += 100* Phaser.Math.RoundTo(this.golfScore/this.shotCounter, -2)
            this.golfScoreLeft.text = 'Score:' + this.golfScore
            this.golfStatsLeft.text = 'Stats:' + this.golfStats + '%'
            
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)
    }

    update() 
    {
    
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[*] Add ball reset logic on successful shot
[ ] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[*] Make one obstacle move left/right and bounce against screen edges
[*] Create and display shot counter, score, and successful shot percentage
*/