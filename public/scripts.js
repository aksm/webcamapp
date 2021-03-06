const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const filter = document.querySelector('#filter');
const rgb = document.getElementById('rgb');

function hideElement(element) {
  element.classList.remove('show');
  element.classList.add('hide');
}
function showElement(element) {
  element.classList.remove('hide');
  element.classList.add('show');
}

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false}).
  then(localMediaStream => {
    video.src = window.URL.createObjectURL(localMediaStream);
    video.play();
  })
  .catch(err => {
    console.error(`Please enable your webcam.`, err);
  });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height);
    switch(filter.options[filter.selectedIndex].value) {
      case 'red':
        hideElement(rgb);
        pixels = redEffect(pixels);
      break;
      case 'green':
        showElement(rgb);
        pixels = greenScreen(pixels);
      break;
      case 'rgb':
        hideElement(rgb);
        pixels = rgbSplit(pixels);
      break;
      default:
        hideElement(rgb);

    }
    // ctx.globalAlpha - 0.1;
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="Handsome User" />`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i +=4) {
    pixels.data[i + 0] += 100;
    pixels.data[i + 1] -= 50;
    pixels.data[i + 2] *= 0.5;
  }
  return pixels;
}

function rgbSplit(pixels) {
  for(i = 0; i < pixels.data.length; i +=4) {
    pixels.data[i - 150] = pixels.data[i + 0];
    pixels.data[i + 100] = pixels.data[i + 1];
    pixels.data[i - 150] = pixels.data[i + 2];
  }
  return pixels;

}

function greenScreen(pixels) {
  const levels = {};
  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for(i = 0; i < pixels.data.length; i += 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if(red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);