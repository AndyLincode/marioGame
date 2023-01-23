const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const platformImage = document.querySelector("#platform");
const backgroundImage = document.querySelector("#backgroundImg");
const hillsImage = document.querySelector("#hills");

canvas.width = 1024;
canvas.height = 576;

const gravity = 1.5;

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 30;
    this.height = 30;
  }

  draw() {
    context.fillStyle = "red";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
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

let player = new Player();
let platforms = [
  new Platform({ x: -1, y: 470, image: platformImage }),
  new Platform({ x: platformImage.width - 3, y: 470, image: platformImage }),
  new Platform({
    x: platformImage.width * 2 + 100,
    y: 470,
    image: platformImage,
  }),
];
let genericObjects = [
  new GenericObject({ x: -1, y: -1, image: backgroundImage }),
  new GenericObject({ x: -1, y: -1, image: hillsImage }),
];

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
    new Platform({ x: -1, y: 470, image: platformImage }),
    new Platform({ x: platformImage.width - 3, y: 470, image: platformImage }),
    new Platform({
      x: platformImage.width * 2 + 100,
      y: 470,
      image: platformImage,
    }),
  ];
  genericObjects = [
    new GenericObject({ x: -1, y: -1, image: backgroundImage }),
    new GenericObject({ x: -1, y: -1, image: hillsImage }),
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
  player.update();
  if (keys.right.pressed && player.position.x < 500) {
    player.velocity.x = 3.5;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -3.5;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      scrollOffset += 3.5;
      platforms.forEach((platform) => {
        platform.position.x -= 3.5;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= 1.5;
      });
    } else if (keys.left.pressed) {
      scrollOffset -= 3.5;
      platforms.forEach((platform) => {
        platform.position.x += 3.5;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += 1.5;
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
  // win condition
  if (scrollOffset > 2000) {
    console.log("Win");
  }

  // lose condition
  if (player.position.y > canvas.height) {
    init();
  }
}

animate();

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "ArrowUp":
      player.velocity.y -= 30;
      break;
    case "ArrowDown":
      break;
    case "ArrowLeft":
      keys.left.pressed = true;
      break;
    case "ArrowRight":
      keys.right.pressed = true;
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
