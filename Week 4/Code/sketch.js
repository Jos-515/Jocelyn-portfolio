/* DN3008 Generative Art, Ashley Hi 2026
 * Week 4 - Waves & Distribiution
 * Assignment - Jocelyn Eddy
 * 
 * For this sketch, I modified the Wave Compostion B sketch. I decided to emphasise the cyclical nature of the moving circle pattern. 
 * Therefore I created a radial gradient background effect, appearing like a vignette on a an old photograph.
 * Additionally, I softened the contrast between the background and the circles by increasing the transparency of the white stroke. 
 * 
 */

var bg;
var magnify = 300;
var rotation = 0;
var radius = 0;
var elements = 500;
// Establishes global variables that determine the oscillating wave frequency and the angular step density (this determines how many vertex points and thereform how many loop like petals appear). 

function setup() {
  createCanvas(800, 800);
  bg = createRadialGradient(800, 800, color(255), color(0));
  //Sets the canvas to a square and ensures that it is a evenly distributed gradient across the square. Starting at white in the centre and moving to black.
}

function draw() {
  image(bg, 0, 0);
  translate(width * 0.5, height * 0.5);
  // This sets the origin point as the centre of the canvas

  radius = (cos(frameCount * 0.0013) + 2) * 10;
  rotation = (sin(frameCount * 0.0011) + 1) * 10;
  // Cosine and sine waves are used to shift the radius and rotation
  var spacing = TWO_PI / elements;
  //TWO_PI divides the circle by the elements variable. This way the circle is split into 500 equal pieces.

  noFill();
  stroke(255, 255, 255, 100);
  // This sets the stroke colour to white with a transparency of 100, so it doesn't starkly contrast the background.
  beginShape();
  for (var j = 0; j < 256; j++) {
    var p = createVector(0, 0);
    p.add(sin(spacing * j * radius) * magnify, 0);
    p.rotate(spacing * j * rotation);
    vertex(p.x, p.y);
  }
  endShape();
  // The loop is run 256 times, creatingt 256 vertices. This creates the geometric animation as it rotates around the centre, offset each time by the sine wave.
}

function createRadialGradient(w, h, innerColor, outerColor) {
  var gfx = createGraphics(w, h);
  gfx.pixelDensity(1); 
  gfx.loadPixels();
  var cx = w / 2;
  var cy = h / 2;
  // This finds the centre of the canvas.
  var maxDist = dist(0, 0, cx, cy);
  // This finds the maximum distance from the centre to one of the corners of the canvas. 

  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var d = dist(x, y, cx, cy);
      // Determines the position of a pixel in relation to the centre of the canvas.
      var amt = constrain(d / maxDist, 0, 1);
      var c = lerpColor(innerColor, outerColor, amt);
      // This makes the gradient between black and white smooth and well blended. 
      var idx = (x + y * w) * 4;
      // The positions of thr pixels are converted into a index. So that the RGB values can also be accuratly stored. 
      gfx.pixels[idx] = red(c);
      gfx.pixels[idx + 1] = green(c);
      gfx.pixels[idx + 2] = blue(c);
      gfx.pixels[idx + 3] = 255;
      // Assigns the RGB values to each pixel. 
    }
  }
  gfx.updatePixels();
  return gfx;
  //This returns the gradient background so that it can be displayed like an image. 
}
