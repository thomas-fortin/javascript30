const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

/**
 * Get and use the webcan.
 */
function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch((err) => {
      console.error(`ERROR WITH THE WEBCAM !`, err);
    });
}

/**
 * Paint video to canvas.
 */
function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height);
    // Red effect
    //pixels = redEffect(pixels);

    // RGB Split
    //pixels = rgbSplit(pixels);
    //ctx.globalAlpha = 0.8;

    // Green screen
    pixels = greenScreen(pixels);

    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

/**
 * Taking photo function.
 */
function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  // take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="Handsome guy!" />`;
  strip.insertBefore(link, strip.firstChild);
}

/**
 * Red effect on the canvas video.
 */
function redEffect(pixels) {
  // 0 to 4 because pixels is an array of every pixels
  // with in it the amount of RGBA (Red, Green Blue, Aplha)
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i] + 200; // Red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // Green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }

  return pixels;
}

/**
 * RGB split effect on the canvas video.
 */
function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // Red
    pixels.data[i + 500] = pixels.data[i + 1]; // Green
    pixels.data[i + 550] = pixels.data[i + 2]; // Blue
  }

  return pixels;
}

/**
 * Green screen effect on canvas video.
 * @param  {Array} pixels The pixels of the video.
 */
function greenScreen(pixels) {
  const levels = {};

  [...document.querySelectorAll('.rgb input')].forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmin &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // Take it out, it's alpha
      // So if it's in our range, it becomes transparent
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
