const cardNums = 20;
let cardContent = '';
let lockBoard = false;
const prepare = {
    cards: [],
    selectedCard1: null,
    selectedCard2: null,
    selectedIndex1: -1,
    selectedIndex2: -1,
    progress: 0,
    fullTrack: new Audio(),
    flipAudio: new Audio(),
    goodAudio: new Audio(),
    failAudio: new Audio(),
    gameOverAudio: new Audio(),
};
prepare.failAudio = new Audio('assets/audio/fail.mp3');
prepare.flipAudio = new Audio('assets/audio/flip.mp3');
prepare.fullTrack = new Audio('assets/audio/fulltrack.mp3');
prepare.fullTrack.loop = true;
prepare.gameOverAudio = new Audio('assets/audio/game-over.mp3');
prepare.goodAudio = new Audio('assets/audio/good.mp3');
//handle audio error
const safePlay = (audio, reset = true) => {
    try {
        if (reset) {
            audio.pause();
            audio.currentTime = 0;
        }
        audio.play().catch(err => {
            if (err.name !== "AbortError") {
                console.error("Audio play error:", err);
            }
        });
    }
    catch (err) {
        console.error("Unexpected audio error:", err);
    }
};
const stopAudio = (audio) => {
    if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
    }
};
//build card
for (let i = 0; i < cardNums / 2; i++) {
    const card = {
        id: i,
        src: `assets/images/${i}.jpg`,
        flip: '',
        clicked: true,
    };
    prepare.cards.push(Object.assign({}, card));
    prepare.cards.push(Object.assign({}, card));
}
//shuffle cards
for (let i = prepare.cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [prepare.cards[i], prepare.cards[j]] = [prepare.cards[j], prepare.cards[i]];
}
const toggleFlip = (index) => {
    safePlay(prepare.fullTrack, false);
    if (lockBoard)
        return;
    const card = prepare.cards[index];
    if (!card)
        return;
    if (card.flip || !card.clicked)
        return;
    if (prepare.selectedIndex1 === index)
        return;
    flip(card, index);
    selectCard(card, index);
};
const flip = (card, index) => {
    const el = document.getElementById(`card-flip-${index}`);
    if (!el)
        return;
    safePlay(prepare.flipAudio);
    card.flip = card.flip === '' ? 'flip' : '';
    el.classList.toggle('flip');
};
const selectCard = (card, index) => {
    if (!prepare.selectedCard1) {
        prepare.selectedCard1 = card;
        prepare.selectedIndex1 = index;
        return;
    }
    if (!prepare.selectedCard2) {
        prepare.selectedCard2 = card;
        prepare.selectedIndex2 = index;
    }
    if (prepare.selectedCard1 && prepare.selectedCard2) {
        if (prepare.selectedCard1.src === prepare.selectedCard2.src) {
            prepare.selectedCard1.clicked = false;
            prepare.selectedCard2.clicked = false;
            prepare.selectedCard1 = null;
            prepare.selectedCard2 = null;
            prepare.selectedIndex1 = -1;
            prepare.selectedIndex2 = -1;
            stopAudio(prepare.failAudio);
            stopAudio(prepare.goodAudio);
            safePlay(prepare.goodAudio);
            updateProgress();
            checkFinish();
        }
        else {
            lockBoard = true;
            setTimeout(() => {
                stopAudio(prepare.failAudio);
                stopAudio(prepare.goodAudio);
                safePlay(prepare.failAudio);
                if (prepare.selectedCard1) {
                    flip(prepare.selectedCard1, prepare.selectedIndex1);
                }
                if (prepare.selectedCard2) {
                    flip(prepare.selectedCard2, prepare.selectedIndex2);
                }
                prepare.selectedCard1 = null;
                prepare.selectedCard2 = null;
                prepare.selectedIndex1 = -1;
                prepare.selectedIndex2 = -1;
                lockBoard = false;
            }, 1000);
        }
    }
};
const updateProgress = () => {
    const progress = (prepare.cards.filter(card => !card.clicked).length / cardNums) * 100;
    const progressBar = document.getElementById('progressBar');
    const progressLabel = document.getElementById('progressLabel');
    if (progressBar)
        progressBar.style.width = `${progress}%`;
    if (progressLabel)
        progressLabel.innerText = `${Math.round(progress)}%`;
};
const checkFinish = () => {
    if (prepare.cards.filter(card => !card.clicked).length === cardNums) {
        stopAudio(prepare.fullTrack);
        stopAudio(prepare.failAudio);
        stopAudio(prepare.goodAudio);
        safePlay(prepare.gameOverAudio);
    }
};
prepare.cards.forEach((card, index) => {
    cardContent += `
    <span class="col-lg-2 col-md-3 col-6 card-wrapper">
      <div id="card-flip-${index}" class="card ${card.flip}">
        <div class="card-inner">
          <div class="card-front"></div>
          <div class="card-back">
            <img src="${card.src}" class="card-img"/>
          </div>
        </div>
      </div>
    </span>
  `;
});
document.getElementById("cardsContainer").innerHTML = cardContent;
prepare.cards.forEach((_, index) => {
    const cardElement = document.getElementById(`card-flip-${index}`);
    if (cardElement) {
        cardElement.addEventListener("click", () => toggleFlip(index));
    }
});
export {};
