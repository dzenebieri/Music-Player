const PlaylistBN = document.querySelector(".PlaylistBNCS");
const PlaylistULDoc = document.querySelector(".PlaylistULCS");
const imgMus = document.querySelector('.imgDivCS');
const titleMusDoc = document.querySelector('.titleDivCS');
const volumeBN = document.querySelector('.volTimeDivCS button');
const volumeSpan = document.querySelector('.volTimeDivCS span');
const volumeIN = document.querySelector('.volumeINCS');
const timeCurrMus = document.querySelector('.timeCurrMusCS');
const timeIN = document.querySelector('.timeINCS');
const timeMus = document.querySelector('.timeMusCS');
const waveDoc = document.querySelector('.waveDivCS');
const musAudioEl = document.createElement('audio');
const shuffleBN = document.getElementById('shuffleBNID');
let PplayBN = document.getElementById('PplayBNID');
let PlaylistBNS = document.querySelector(".PlaylistBNCS span");
let musIND = 0;
let isShuffle = false;
let isPlaying = false;
let currLiPlaying = null;
let msecondsInterval;

const Playlist = [
    {
        mus: 'music/Road.mp3',
        img: 'images/Road.png',
        title: "Ofshane - Road Tripzzz"
    },
    {
        mus: 'music/Natural.mp3',
        img: 'images/Natural.png',
        title: 'Jackie Mendoza - Natural'
    },
    {
        mus: 'music/Story.mp3',
        img: 'images/Story.png',
        title: 'DaviD Kelix - True Story'
    },
    {
        mus: 'music/End.mp3',
        img: 'images/End.png',
        title: 'Linkin Park - In The End'
    }
];

function bgCoFun() {
    let hexChar = '0123456789abcdef';
    let randomHexChar = () => hexChar[Math.floor(Math.random() * hexChar.length)];
    let bgCoTo = 'to right';
    let bgCoOne = `#${Array.from({ length: 6 }, randomHexChar).join('')}`;
    let bgCoTwo = `#${Array.from({ length: 6 }, randomHexChar).join('')}`;
    let bgCo = `linear-gradient(${bgCoTo}, ${bgCoOne}, ${bgCoTwo})`;
    document.body.style.background = bgCo;
}

function loadMus(musIND) {
    clearInterval(msecondsInterval);
    musNull();
    musAudioEl.src = Playlist[musIND].mus;
    musAudioEl.load();
    imgMus.style.backgroundImage = "url(" + Playlist[musIND].img + ")";
    titleMusDoc.textContent = Playlist[musIND].title;
    msecondsInterval = setInterval(musTimeFun, 1000);
    musAudioEl.addEventListener('ended', nextMus);
    bgCoFun();
}
loadMus(musIND);

function musTimeFun() {
    if (!isNaN(musAudioEl.duration)) {
        let musTimeVal = musAudioEl.currentTime * (100 / musAudioEl.duration);
        timeIN.value = musTimeVal;
        let musDurMinutes = Math.floor(musAudioEl.duration / 60);
        let musDurSeconds = Math.floor(musAudioEl.duration - musDurMinutes * 60);
        let musCurrMinutes = Math.floor(musAudioEl.currentTime / 60);
        let musCurrSeconds = Math.floor(musAudioEl.currentTime - musCurrMinutes * 60);
        let nullTime = (eTime) => (eTime < 10 ? "0" + eTime : eTime);
        timeMus.textContent = `${nullTime(musDurMinutes)}:${nullTime(musDurSeconds)}`;
        timeCurrMus.textContent = `${nullTime(musCurrMinutes)}:${nullTime(musCurrSeconds)}`;
    }
    timeIN.addEventListener('click', (timeEtVal) => {
        let timePre = timeEtVal.target.value;
        let currTimeIN = (timePre / 100) * musAudioEl.duration;
        musAudioEl.currentTime = currTimeIN;
    });
}

document.addEventListener("keydown", (eKey) => {
    if (eKey.key === "Escape" && PlaylistULDoc.style.display === "block") {
        waveDoc.style.display = "flex";
        PlaylistULDoc.style.display = "none";
        PlaylistBNS.innerHTML = `<span class="material-symbols-rounded PlaylistBNRoShowCS"> expand_less </span>`;
    }
});

PlaylistBN.addEventListener("click", () => {
    let isHidden = PlaylistULDoc.style.display === "none";
    PlaylistULDoc.style.display = isHidden ? "block" : "none";
    waveDoc.style.display = isHidden ? "none" : "flex";
    let moreLessBN = isHidden ? "expand_more" : "expand_less";
    PlaylistBNS.innerHTML = `<span class="material-symbols-rounded PlaylistBNRoShowCS">${moreLessBN}</span>`;
});

Playlist.forEach((eLi, indLi) => {
    let liEl = document.createElement("li");
    liEl.textContent = `${indLi + 1}. ${eLi.title}`;
    PlaylistULDoc.appendChild(liEl);
    liEl.addEventListener("click", function () {
        if (currLiPlaying) {
            currLiPlaying.classList.remove("liPlayingCS");
        }
        liEl.classList.add("liPlayingCS");
        currLiPlaying = liEl;
        loadMus(indLi);
        playMus();
    });
});

volumeBN.addEventListener('click', () => {
    let isVolume = musAudioEl.volume === 0 ? 1 : 0;
    let isMute = isVolume === 0;
    musAudioEl.volume = isVolume;
    volumeIN.value = isMute ? 0 : 100;
    volumeSpan.textContent = isMute ? 'volume_off' : 'volume_up';
});

volumeIN.addEventListener('input', () => {
    musAudioEl.volume = volumeIN.value / 100;
    if (volumeSpan.textContent === 'volume_off') {
        volumeSpan.textContent = 'volume_up';
    } else if (musAudioEl.volume === 0) {
        volumeSpan.textContent = 'volume_off';
        musAudioEl.volume = 0;
        volumeIN.value = 0;
    } else {
        volumeSpan.textContent = 'volume_up';
    }
});

function musShuffle() {
    isShuffle ? pauseShuffle() : playShuffle();
}

function playShuffle() {
    isShuffle = true;
    shuffleBN.classList.add('shuffleShow');
}

function pauseShuffle() {
    isShuffle = false;
    shuffleBN.classList.remove('shuffleShow');
}

function prevMus() {
    if (isShuffle) {
        let randomMusIND;
        do {
            randomMusIND = Math.floor(Math.random() * (Playlist.length - 1));
        } while (randomMusIND === musIND);
        musIND = randomMusIND;
    } else {
        musIND = (musIND > 0) ? musIND - 1 : Playlist.length - 1;
    }
    loadMus(musIND);
    playMus();
}

function playPMus() {
    isPlaying ? pauseMus() : playMus();
}

function playMus() {
    musAudioEl.play();
    isPlaying = true;
    imgMus.classList.add('RoCDCS');
    waveDoc.classList.add('waveShowCS');
    PplayBN.innerHTML = `<span class="material-symbols-rounded"> pause_circle </span>`;
}

function pauseMus() {
    musAudioEl.pause();
    isPlaying = false;
    imgMus.classList.remove('RoCDCS');
    waveDoc.classList.remove('waveShowCS');
    PplayBN.innerHTML = `<span class="material-symbols-rounded"> play_circle </span>`;
}

function nextMus() {
    let prevMusIND = musIND;
    if (isShuffle) {
        do {
            musIND = Math.floor(Math.random() * Playlist.length);
        } while (musIND === prevMusIND);
    } else {
        musIND = (musIND < Playlist.length - 1) ? musIND + 1 : 0;
    }
    loadMus(musIND);
    playMus();
}

function musReplay() {
    let musCurrIND = musIND;
    loadMus(musCurrIND);
    playMus();
}

function musNull() {
    timeIN.value = 0;
    timeMus.textContent = "00:00";
    timeCurrMus.textContent = "00:00";
}