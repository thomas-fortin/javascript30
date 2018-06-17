/* Select elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

/* Functions */
/**
 * Toggle play video.
 */
function togglePlay() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

/**
 * Update the play button.
 */
function updateButton() {
  const icon = this.paused ? '►' : '❚❚';
  toggle.textContent = icon;
}

/**
 * Skip the given time in the video.
 */
function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

/**
 * Handle range update of the video.
 */
function handleRangeUpdate() {
  video[this.name] = this.value;
}

/**
 * Handle progress bar of the video.
 */
function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

/**
 * Scrub for the video.
 * @param  {Object} e The event.
 */
function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

/* Event listeners */
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('click', togglePlay);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);

skipButtons.forEach((skipButton) => skipButton.addEventListener('click', skip));

ranges.forEach((range) => range.addEventListener('change', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => {
  mousedown && scrub(e);
});
progress.addEventListener('mousedown', () => (mousedown = true));
progress.addEventListener('mouseup', () => (mousedown = false));
