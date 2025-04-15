window.onload = function () {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  let lungX = canvas.width / 2 - 40;
  let lungY = canvas.height - 100;
  let speed = 8;
  let health = 100;
  let badBreaths = 0;
  let bonusUsed = 0;
  const objects = [];

  const images = {
  tree: new Image(),
  o2: new Image(),
  cigarette: new Image(),
  bonus: new Image(),
  lungHappy: new Image(),
  lungNeutral: new Image(),
  lungSick: new Image()
};

images.tree.src = "images/tree.png";
images.o2.src = "images/o2.png";
images.cigarette.src = "images/cigarette.png";
images.bonus.src = "images/bonus.png";

images.lungHappy.src = "images/lung_happy.png";
images.lungNeutral.src = "images/lung_neutral.png";
images.lungSick.src = "images/lung_sick.png";


  function startGame() {
    const goodTypes = ["tree", "o2"];
    const badTypes = ["cigarette"];

    function spawnObject() {
      let type = "good";
      let subtype = goodTypes[Math.floor(Math.random() * goodTypes.length)];

      if (bonusUsed < 2 && Math.random() < 0.01) {
        type = "bonus";
        subtype = "bonus";
        bonusUsed++;
      } else if (Math.random() < 0.4) {
        type = "bad";
        subtype = badTypes[Math.floor(Math.random() * badTypes.length)];
      }

      const x = Math.random() * (canvas.width - 40);
      const y = -40;
      const speed = 2 + Math.random() * 2;

      objects.push({ x, y, speed, type, subtype });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") lungX -= speed;
      if (e.key === "ArrowRight") lungX += speed;
    });

    function isColliding(obj) {
      return (
        obj.x < lungX + 80 &&
        obj.x + 40 > lungX &&
        obj.y < lungY + 80 &&
        obj.y + 40 > lungY
      );
    }

    function drawLungs() {
  let lungImage;
  if (health > 70) {
    lungImage = images.lungHappy;
  } else if (health > 30) {
    lungImage = images.lungNeutral;
  } else {
    lungImage = images.lungSick;
  }

  if (lungImage.complete && lungImage.naturalHeight !== 0) {
    ctx.drawImage(lungImage, lungX, lungY, 80, 80);
  }
}

  

    function drawObjects() {
      for (let obj of objects) {
        const img = images[obj.subtype];
        if (img.complete && img.naturalHeight !== 0) {
          ctx.drawImage(img, obj.x, obj.y, 40, 40);
        }
      }
    }

    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawLungs();
      drawObjects();

      for (let i = objects.length - 1; i >= 0; i--) {
        let obj = objects[i];
        obj.y += obj.speed;

        if (isColliding(obj)) {
          if (obj.type === "bad") {
            badBreaths++;
            health -= 5;
          } else if (obj.type === "good") {
            health += 2;
            if (health > 100) health = 100;
          } else if (obj.type === "bonus") {
            health += Math.floor(100 / 3);
            if (health > 100) health = 100;
          }
          objects.splice(i, 1);
        } else if (obj.y > canvas.height) {
          objects.splice(i, 1);
        }
      }

      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      ctx.fillText("Salute: " + health, 10, 30);
      ctx.fillText("Fumo inalato: " + badBreaths + "/20", 10, 60);

      if (badBreaths >= 20) {
        ctx.fillStyle = "red";
        ctx.font = "40px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2 - 120, canvas.height / 2);
        return;
      }

      requestAnimationFrame(gameLoop);
    }

    setInterval(spawnObject, 1200);
    gameLoop();
  }

  const checkImagesLoaded = setInterval(() => {
    if (
      images.tree.complete &&
      images.o2.complete &&
      images.cigarette.complete &&
      images.bonus.complete
    ) {
      clearInterval(checkImagesLoaded);
      startGame();
    }
  }, 100);
};
