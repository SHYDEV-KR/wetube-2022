const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const speedRange = document.getElementById("speed");
const currentSpeed = document.getElementById("currentSpeed");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;
let watchRecords = new Set();

const handlePlayClick = (e) => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMuteClick = (e) => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted ? "fas fa-volume-mute": "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
    const {
        target: { value },
    } = event;
    if (video.muted) {
        video.muted = false;
        muteBtnIcon.classList = "fas fa-volume-up";
    }

    if (value === "0") {
        video.muted = true;
        muteBtnIcon.classList = "fas fa-volume-mute";
    }

    volumeValue = value;
    video.volume = value;
    
};

const formatTime = (seconds) => {
    if (seconds >= 3600) {
        return new Date(seconds * 1000).toISOString().substr(11, 8);
    } else {
        return new Date(seconds * 1000).toISOString().substr(14, 5);
    }
    
}

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
    watchRecords.add(Math.floor(video.currentTime));
};

const handleEnded = () => {
    const { id } = videoContainer.dataset;
    if (watchRecords.size / video.duration >= 0.7) {
        fetch(`/api/videos/${id}/view`, {
            method: "POST",
        });
    }
}

const handleTimelineChange = (event) => {
    const {
        target: { value },
    } = event;
    video.currentTime = value;
};

const handleSpeedChange = (event) => {
    const {
        target: { value },
    } = event;
    currentSpeed.innerText = `${parseFloat(value).toFixed(2)}x`;
    video.playbackRate = value;
}

const handleFullscreenBtnClick = () => {
    const fullscreen = document.fullscreenElement;
    if (fullscreen) {
        document.exitFullscreen();
        fullScreenIcon.classList = "fas fa-expand";
    } else {
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
    }
};

const handleFullscreenChange = () => {
    fullScreenIcon.classList = document.fullscreenElement ? "fas fa-compress" : "fas fa-expand";
}

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }

    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }

    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000);
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handleTimelineChange);
speedRange.addEventListener("change", handleSpeedChange);
fullScreenBtn.addEventListener("click", handleFullscreenBtnClick);
document.addEventListener('fullscreenchange', handleFullscreenChange);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
document.addEventListener('keyup', event => {
    if (event.code === 'Space') {
        handlePlayClick();
    }
});
video.addEventListener("click", handlePlayClick);