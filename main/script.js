const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const matrixOutput = document.getElementById('matrixOutput');
const triangleOutput = document.getElementById('triangleOutput');

let triangle = [
  [100, 100, 1],
  [200, 100, 1],
  [150, 200, 1]
];

let currentTransform = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];

function drawTriangle(tri) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(tri[0][0], tri[0][1]);
  ctx.lineTo(tri[1][0], tri[1][1]);
  ctx.lineTo(tri[2][0], tri[2][1]);
  ctx.closePath();
  ctx.stroke();
  updateDisplay(currentTransform, triangle);
}

function multiplyMatrix(mat, point) {
  const result = [];
  for (let i = 0; i < mat.length; i++) {
    let sum = 0;
    for (let j = 0; j < point.length; j++) {
      sum += mat[i][j] * point[j];
    }
    result.push(sum);
  }
  return result;
}

function rotateThenTranslate(angle, tx, ty) {
  const rotation = [
    [Math.cos(angle), -Math.sin(angle), 0],
    [Math.sin(angle),  Math.cos(angle), 0],
    [0, 0, 1]
  ];

  const translation = [
    [1, 0, tx],
    [0, 1, ty],
    [0, 0, 1]
  ];

  // Multiply: T * R
  const combined = multiplyMatrices(translation, rotation);

  // Apply the composite transformation
  applyTransformation(combined);
}

function applyTransformation(matrix) {
  triangle = triangle.map(pt => multiplyMatrix(matrix, pt));
  currentTransform = multiplyMatrices(matrix, currentTransform);
  drawTriangle(triangle);
}

function multiplyMatrices(a, b) {
  const result = Array(3).fill(null).map(() => Array(3).fill(0));
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
}

function updateDisplay(matrix, triangle) {
  matrixOutput.textContent = matrix.map(row => row.map(n => n.toFixed(2)).join('\t')).join('\n');
  triangleOutput.textContent = triangle.map(pt => `(${pt[0].toFixed(1)}, ${pt[1].toFixed(1)})`).join('\n');
}

// Animations
function animateTransform(matrix, steps = 30) {
  let step = 0;
  const original = triangle.map(pt => [...pt]);
  const transformed = triangle.map(pt => multiplyMatrix(matrix, pt));

  const interval = setInterval(() => {
    step++;
    const interpolated = triangle.map((_, i) => [
      original[i][0] + (transformed[i][0] - original[i][0]) * step / steps,
      original[i][1] + (transformed[i][1] - original[i][1]) * step / steps,
      1
    ]);
    drawTriangle(interpolated);
    if (step >= steps) {
      clearInterval(interval);
      triangle = transformed;
      currentTransform = multiplyMatrices(matrix, currentTransform);
      drawTriangle(triangle);
    }
  }, 16); // ~60 FPS
}

function animateTranslate(tx, ty) {
  const matrix = [
    [1, 0, tx],
    [0, 1, ty],
    [0, 0, 1]
  ];
  animateTransform(matrix);
}

function animateRotate(angle) {
  const matrix = [
    [Math.cos(angle), -Math.sin(angle), 0],
    [Math.sin(angle),  Math.cos(angle), 0],
    [0, 0, 1]
  ];
  animateTransform(matrix);
}

function animateScale(sx, sy) {
  const matrix = [
    [sx, 0, 0],
    [0, sy, 0],
    [0, 0, 1]
  ];
  animateTransform(matrix);
}

function reset() {
  triangle = [
    [100, 100, 1],
    [200, 100, 1],
    [150, 200, 1]
  ];
  currentTransform = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ];
  drawTriangle(triangle);
}

reset();
