const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const platformImage = document.querySelector("#platform");
const backgroundImage = document.querySelector("#backgroundImg");
const hillsImage = document.querySelector("#hills");
const platformSmallTall = document.querySelector("#platformSmallTall");
const e_commerce = document.querySelector("#e_commerce");
const petBan = document.querySelector("#petBan");
const calculator = document.querySelector("#calculator");
const todo1 = document.querySelector("#todo1");
const todo2 = document.querySelector("#todo2");

const spriteRunLeft = document.querySelector("#spriteRunLeft");
const spriteRunRight = document.querySelector("#spriteRunRight");
const spriteStandLeft = document.querySelector("#spriteStandLeft");
const spriteStandRight = document.querySelector("#spriteStandRight");

canvas.width = 1024;
canvas.height = 576;

const gravity = 1.5;

class Player {
  constructor() {
    this.speed = 9;
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 66;
    this.height = 150;

    this.image = spriteStandRight;
    this.frames = 0;
    this.sprites = {
      stand: {
        right: spriteStandRight,
        left: spriteStandLeft,
        cropWidth: 177,
        width: 66,
      },
      run: {
        right: spriteRunRight,
        left: spriteRunLeft,
        cropWidth: 341,
        width: 127.875,
      },
    };

    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 177;
  }

  draw() {
    context.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.frames++;

    if (
      this.frames > 59 &&
      (this.currentSprite === this.sprites.stand.right ||
        this.currentSprite === this.sprites.stand.left)
    )
      this.frames = 0;
    else if (
      this.frames > 29 &&
      (this.currentSprite === this.sprites.run.right ||
        this.currentSprite === this.sprites.run.left)
    )
      this.frames = 0;

    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };

    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    context.drawImage(this.image, this.position.x, this.position.y);
  }
}

class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };

    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    context.drawImage(this.image, this.position.x, this.position.y);
  }
}
class ECommerce {
  constructor({
    x,
    y,
    image,
    title,
    width,
    height,
    titleX,
    titleY,
    frontColor,
    backColor,
  }) {
    this.position = {
      x,
      y,
    };

    this.image = image;
    this.title = title;
    this.titlePosition = {
      titleX,
      titleY,
    };
    this.textColor = {
      frontColor,
      backColor,
    };
    this.width = width;
    this.height = height;
  }

  draw() {
    context.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    context.font = "30px Arial";
    context.fillStyle = this.textColor.backColor;
    context.fillText(
      this.title,
      this.position.x - this.titlePosition.titleX,
      this.position.y - this.titlePosition.titleY
    );
    context.fillStyle = this.textColor.frontColor;
    context.fillText(
      this.title,
      this.position.x - (this.titlePosition.titleX - 2),
      this.position.y - (this.titlePosition.titleY - 2)
    );
  }
}

let player;
let platforms = [];
let genericObjects = [];
let lastKey;
let eCommerce;

let keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

let scrollOffset = 0;

function init() {
  player = new Player();
  platforms = [
    new Platform({
      x:
        platformImage.width * 4 +
        400 -
        2 +
        platformImage.width -
        platformSmallTall.width,
      y: 270,
      image: platformSmallTall,
    }),
    new Platform({ x: -1, y: 470, image: platformImage }),
    new Platform({ x: platformImage.width - 3, y: 470, image: platformImage }),
    new Platform({
      x: platformImage.width * 2 + 250,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 3 + 400,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 4 + 400 - 2,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 5 + 850 - 2,
      y: 470,
      image: platformImage,
    }),
  ];
  genericObjects = [
    new GenericObject({ x: -1, y: -1, image: backgroundImage }),
    new GenericObject({ x: -1, y: -1, image: hillsImage }),
  ];
  eCommerce = [
    new ECommerce({
      x: platformImage.width + 150,
      y: 100,
      image: petBan,
      title: "PetBan(React+Node.js)",
      width: 300,
      height: 240,
      titleX: 5,
      titleY: 35,
      frontColor: "#FF8C04",
      backColor: "#FFEACF",
    }),
    new ECommerce({
      x: platformImage.width * 2 + 300,
      y: 100,
      image: e_commerce,
      title: "React E-Commerce (Mobile)",
      width: 142,
      height: 240,
      titleX: 100,
      titleY: 35,
      frontColor: "#00A6D9",
      backColor: "#D7F3FF",
    }),
    new ECommerce({
      x: platformImage.width * 2.8 + 350,
      y: 100,
      image: calculator,
      title: "Vue Calculator",
      width: 142,
      height: 240,
      titleX: 30,
      titleY: 35,
      frontColor: "#00A6D9",
      backColor: "#D7F3FF",
    }),
    new ECommerce({
      x: platformImage.width * 3.2 + 350,
      y: 100,
      image: todo1,
      title: "Vue Todo List",
      width: 142,
      height: 240,
      titleX: 30,
      titleY: 35,
      frontColor: "#00A6D9",
      backColor: "#D7F3FF",
    }),
    new ECommerce({
      x: platformImage.width * 3.5 + 420,
      y: 100,
      image: todo2,
      title: "Vue Todo List2 (with RWD)",
      width: 142,
      height: 240,
      titleX: 50,
      titleY: 35,
      frontColor: "#00A6D9",
      backColor: "#D7F3FF",
    }),
  ];
  keys = {
    right: {
      pressed: false,
    },
    left: {
      pressed: false,
    },
  };

  scrollOffset = 0;
}

function animate() {
  requestAnimationFrame(animate);
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });
  eCommerce.forEach((eCommerce) => {
    eCommerce.draw();
  });
  player.update();
  if (keys.right.pressed && player.position.x < 300) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 300) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    if (
      keys.right.pressed &&
      scrollOffset < platformImage.width * 5 + 780 - 2
    ) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });
      eCommerce.forEach((eCommerce) => {
        eCommerce.position.x -= player.speed * 0.86;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66;
      });
      eCommerce.forEach((eCommerce) => {
        eCommerce.position.x += player.speed * 0.86;
      });
    }
  }

  // platform collision detection
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  // sprite switching
  if (
    keys.right.pressed &&
    lastKey === "ArrowRight" &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    keys.left.pressed &&
    lastKey === "ArrowLeft" &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    !keys.left.pressed &&
    lastKey === "ArrowLeft" &&
    player.currentSprite !== player.sprites.stand.left
  ) {
    player.currentSprite = player.sprites.stand.left;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  } else if (
    !keys.right.pressed &&
    lastKey === "ArrowRight" &&
    player.currentSprite !== player.sprites.stand.right
  ) {
    player.currentSprite = player.sprites.stand.right;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  }

  // win condition
  if (scrollOffset > platformImage.width * 5 + 750 - 2) {
    context.font = "40px Arial";
    context.fillStyle = "black";
    context.fillText("END", canvas.width / 2, canvas.height / 2);
    context.fillStyle = "white";
    context.fillText("END", canvas.width / 2 + 2, canvas.height / 2 + 2);
  }

  // lose condition
  if (player.position.y > canvas.height) {
    init();
  }
}

init();
animate();

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "ArrowUp":
      player.velocity.y -= 25;
      break;
    case "ArrowDown":
      break;
    case "ArrowLeft":
      keys.left.pressed = true;
      lastKey = "ArrowLeft";
      break;
    case "ArrowRight":
      keys.right.pressed = true;
      lastKey = "ArrowRight";
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "ArrowUp":
      break;
    case "ArrowDown":
      break;
    case "ArrowLeft":
      keys.left.pressed = false;
      break;
    case "ArrowRight":
      keys.right.pressed = false;
      break;
  }
});
