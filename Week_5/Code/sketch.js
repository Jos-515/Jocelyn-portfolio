/* DM3008 Generative Art, Template by Ashley Hi 2026
* Week 5 - Randomness & Noise
* Assignment - Jocelyn Eddy

* For this task, I combined two effects, the perlin noise flowfield and the biased noise shapes.
* My main inspiration for this piece was medieval blackwork embroidery, particularly the trellis pattern designs. 
* I wanted to create a contemporary version of this traditional style. Therefore I opted for vivid colours; choosing the complimentary shades yellow and blue so it felt unified as the colours balenced each other out.
* Therefore I chose the flowfield to be a pale shade of grey so it didn't contrast the shapes or draw the viewers attention away from them. 
* For the teardrop shape, the biased noise was directed towards the top and the bottom centre, this way the teardrops mimicked nature and created the effect of gravity. As it pulled the viewers eye down each of the shapes, moving from top to bottom.
* Wheras for the circles, the bias was directed towardxs the centre, so that the edges were less concentrated. Creating more visual interest. 
* 
* 
* Blackwork inspiration: https://theinevitablescadian.home.blog/2021/02/15/february-blackwork/
*/

let noiseScale = 0.005;
let particles = [];
let numParticles = 400;
let trailLength = 50;

const drops = [
  [250, 50],
  [150, 150],
  [350, 150],
  [50, 250],
  [250, 250],
  [450, 250],
  [150, 350],
  [350, 350],
  [250, 450]
  // This determines where the tear drops are positioned in the canvas. So that the flowfield knows which x and y coordinates to move between.
];

const connections = [
  [0, 1], [0, 2],
  [1, 3], [1, 4],
  [2, 4], [2, 5],
  [3, 6],
  [4, 6], [4, 7],
  [5, 7],
  [6, 8], [7, 8]
  // This determines where the flowfield travels. In this case, it only moves between the teardrops. Effectively ceating a trellis pattern. 
];

function setup() {
  createCanvas(512, 512);
  // Sets the background to a square.
  frameRate(20);
  // Sets the frame rate to 20 frames per second, this ensues the perlin noise moves at a slow pace and its movements are visible smoothly.
  noFill();

  for (let i = 0; i < numParticles; i++) {
    particles.push(createCorridorParticle());
  }
  // 
}

function draw() {
  background(245, 245, 245);
  // The background is a very pale shade of grey so that it doesn't distract from any of the elements on the canvas. 

  stroke(200, 150);
  // The colour is a deeper shade of grey but still not too dark. This way it enables the user to focus on the movement of the flowfeield rather than a jarring contrast. 
  strokeWeight(1.2);
  // The flowfield lines are set to a thin shape, so that teh connections between the shapes feel delicate and aren't overpowering. 

  for (let p of particles) {
    let targetVec = createVector(p.target.x, p.target.y);
    let dir = p5.Vector.sub(targetVec, p.pos);
    let distToTarget = dir.mag();
    dir.normalize();

    let noiseAngle = noise(p.pos.x * noiseScale, p.pos.y * noiseScale, millis() * 0.0001) * TWO_PI;
    let noiseVec = p5.Vector.fromAngle(noiseAngle).mult(0.8);
    
    let vel = dir.add(noiseVec).normalize().mult(p.speed);
    p.pos.add(vel);

    // This configures how the forcefield particles move. It calculates which direction the particle should move in, generates organic noise to accompany it and then updates the particles postion.

    if (distToTarget < 5 || p.pos.x < 0 || p.pos.x > width || p.pos.y < 0 || p.pos.y > height || isInsideShapes(p.pos.x, p.pos.y)) {
      let fresh = createCorridorParticle();
      p.pos = fresh.pos;
      p.target = fresh.target;
      p.speed = fresh.speed;
      p.history = [p.pos.copy()];
    } else {
      p.history.push(p.pos.copy());
      if (p.history.length > trailLength) {
        p.history.shift();
      }
      // This respawns the particles and its value and it creates a living history for the flowfield particles, so that they leave a trail that fades behind them. 
    }
    drawSmoothTrail(p.history);
  }

  drawRaindrop(350, 350, 25, 45);
  drawRaindrop(350, 150, 25, 45);
  drawRaindrop(450, 250, 25, 45);
  drawRaindrop(250, 250, 25, 45);
  drawRaindrop(250, 50, 25, 45);
  drawRaindrop(250, 450, 25, 45);
  drawRaindrop(50, 250, 25, 45);
  drawRaindrop(150, 350, 25, 45);
  drawRaindrop(150, 150, 25, 45);

  drawCircle(350, 250, 18);
  drawCircle(150, 250, 18);
  drawCircle(250, 150, 18);
  drawCircle(250, 350, 18);
  // This determines what positions the teardrops and circles are drawn and their size. 
}

function createCorridorParticle() {
  let conn = random(connections);
  let startDrop = drops[conn[0]];
  let endDrop = drops[conn[1]];
  
  let startVec = createVector(startDrop[0], startDrop[1]);
  let endVec = createVector(endDrop[0], endDrop[1]);
  
  let t = random(0.05, 0.3);
  let pos = p5.Vector.lerp(startVec, endVec, t);
  
  return {
    pos: pos,
    target: endVec,
    speed: random(1.5, 2.5),
    history: [pos.copy()]
  };
  // This function randomly selects a connection between two teardrops that was defined in the connections array.
  // A random position is then generated on the connection line, a random speed is also assigned and a history is establishd to ensure that the fading trail is visible.
}


function drawSmoothTrail(history) {
  if (history.length < 2) return;
  // This prevents errors from occuring if the history is too short to draw a trail. 

  let subPath = [];
  for (let pt of history) {
    if (isInsideShapes(pt.x, pt.y)) {
      if (subPath.length > 1) {
        renderSegment(subPath);
      }
      subPath = [];
    } else {
      subPath.push(pt);
    }
  }
  if (subPath.length > 1) {
    renderSegment(subPath);
  }
  // This function ensures the flowfield isn't drawn ontop of the teardrop shapes. It checks if the position of the flowfield is inside the shapes and if it is, it doesn't draw the trail.
}

function renderSegment(pts) {
  beginShape();
  for (let pt of pts) {
    vertex(pt.x, pt.y);
  }
  endShape();
  // This visualises the flowfield trail, it renders the history of the particles as a line.
}

function isInsideShapes(px, py) {
  const dropsData = [
    [350, 350, 25, 45], [350, 150, 25, 45], [450, 250, 25, 45],
    [250, 250, 25, 45], [250, 50, 25, 45], [250, 450, 25, 45],
    [50, 250, 25, 45], [150, 350, 25, 45], [150, 150, 25, 45]
  ];
  // This defines the coordinates of the teardrops, so that the flowfield can check whether its position overlaps with them. 
  
  for (let d of dropsData) {
    let x = d[0], y = d[1], w = d[2], h = d[3];
    const r = w / 2;
    const top = y - h / 2;      
    const cy = y + h / 4;       
    const bottom = cy + r;      

    if (py >= top && py <= bottom) {
      let halfW;
      if (py < cy) {
        halfW = r * (py - top) / (cy - top);   
      } else {
        let diff = py - cy;
        halfW = sqrt(max(0, r * r - diff * diff));    
      }
      if (px >= x - halfW && px <= x + halfW) return true;
    }
  }
  // This ensures that none of the flowfield particles collide with any part of the teardrop shapes. It compares the positions and returns true if there is any overlap.

  const circlesData = [
    [350, 250, 18], [150, 250, 18], [250, 150, 18], [250, 350, 18]
  ];

  for (let c of circlesData) {
    if (dist(px, py, c[0], c[1]) <= c[2]) return true;
  }

  return false;

  // Ensures that none of the flowfield particles collide with the circles.
}

function drawRaindrop(x, y, w, h) {
  push();
  stroke(99, 150, 255);
  strokeWeight(1.5);
  for (let i = 0; i < 800; i++) {
    const p = randomInTear(x, y, w, h, 2.5);
    point(p.x, p.y);
  }
  pop();
  // Draws the teardrop shapes and ensures each blue particle is randomly distributed within the shape.  
}

function randomInTear(x, y, w, h, bias = 2) {
  const r = w / 2;
  const top = y - h / 2;      
  const cy = y + h / 4;       
  const bottom = cy + r;      

  const t = 1 - pow(random(), bias);
  const py = lerp(top, bottom, t);

  let halfW;
  if (py < cy) {
    halfW = r * (py - top) / (cy - top);   
  } else {
    halfW = sqrt(r * r - sq(py - cy));    
  }

  return createVector(x + random(-halfW, halfW), py);
  // This distrubutes more particles towards the top and bottom of the teardrop shape, creating a gravity effect.
}

function drawCircle(x, y, r) {
  push();
  stroke(242, 202, 80);
  strokeWeight(1.5);
  for (let i = 0; i < 800; i++) {
    const p = randomInCircle(x, y, r, 2.5);
    point(p.x, p.y);
  }
  pop();
  // This draws yellow circles and randomly distrubutes the particles. 
}

function randomInCircle(x, y, r, bias = 2) {
  const t = pow(random(), bias);
  const angle = random(TWO_PI);
  const radius = sqrt(t) * r;
  return createVector(x + radius * cos(angle), y + radius * sin(angle));
  // This distrubutes more particles in the centre of the circle. 
}