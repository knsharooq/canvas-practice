import platformImgSrc from "../../img/platform.png"
import hillsImgSrc from "../../img/hills.png"
import backgroundImgSrc from "../../img/background.png"
import platformSmallTallImgSrc from "../../img/platformSmallTall.png"

const canvas = document.querySelector('canvas')
canvas.width = 1024
canvas.height = 576

const c = canvas.getContext('2d')

const gravity = 0.5
const jumpHeight = 10

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 30
        this.height = 30
        this.speed = 10
    }
    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
    }
}

class Platform {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = this.image.width
        this.height = this.image.height
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = this.image.width
        this.height = this.image.height
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

function createImage(imageSrc) {
    const image = new Image()
    image.src = imageSrc
    return image
}

const platformImg = createImage(platformImgSrc)
const backgroundImg = createImage(backgroundImgSrc)
const hillsImg = createImage(hillsImgSrc)
const platformSmallTallImg = createImage(platformSmallTallImgSrc)

let player = new Player()
let platforms = []
let genericObjects = []

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scrollOffset = 0

function init() {
    player = new Player()
    platforms = [
        new Platform({ x: platformImg.width * 5 + 400 - 2 - platformSmallTallImg.width, y: 400, image: platformSmallTallImg }),
        new Platform({ x: -1, y: 500, image: platformImg }),
        new Platform({ x: platformImg.width - 3, y: 500, image: platformImg }),
        new Platform({ x: platformImg.width * 2 + 150, y: 500, image: platformImg }),
        new Platform({ x: platformImg.width * 3 + 400, y: 500, image: platformImg }),
        new Platform({ x: platformImg.width * 4 + 400 - 2, y: 500, image: platformImg }),
        new Platform({ x: platformImg.width * 5 + 850 - 2, y: 500, image: platformImg })
    ]
    genericObjects = [
        new GenericObject({ x: -1, y: -1, image: backgroundImg }),
        new GenericObject({ x: 0, y: 0, image: hillsImg }),
    ]
    scrollOffset = 0
}

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    genericObjects.forEach(genericObject => genericObject.draw())
    platforms.forEach(platform => platform.draw())
    player.update()

    if (keys.right.pressed && player.position.x < 450) {
        player.velocity.x = player.speed
    }
    else if ((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)) {
        player.velocity.x = -player.speed
    }
    else {
        player.velocity.x = 0
        if (keys.right.pressed) {
            scrollOffset += player.speed
            platforms.forEach(platform => platform.position.x -= player.speed)
            genericObjects.forEach(genericObject => genericObject.position.x -= player.speed * .66)
        }
        else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed
            platforms.forEach(platform => platform.position.x += player.speed)
            genericObjects.forEach(genericObject => genericObject.position.x += player.speed * .66)
        }
    }
    // platform collision detection
    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width
        ) player.velocity.y = 0;
    })

    // win condition
    if (scrollOffset > platformImg.width * 5 + 450 - 2) {
        console.log("win")
    }

    // lose condition
    if (player.position.y > canvas.height) {
        init()
        console.log("lose")
    }
}

init()

animate()

addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'a':
            keys.left.pressed = true
            break
        case 'd':
            keys.right.pressed = true
            break
        case 'w':
            player.velocity.y = -jumpHeight
            break
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'a':
            keys.left.pressed = false
            break
        case 'd':
            keys.right.pressed = false
            break
    }
})