import teams from './teams.json' assert { type: 'json' };

let cards;
const timeTag = document.querySelector(".time b");
const flipsTag = document.querySelector(".flips b");
const matchedTag = document.querySelector(".matched b");

const refreshBtn = document.querySelector(".details button");

let maxTime = 120;
let timeLeft = maxTime;
let flips = 0;
let matchedCard = 0;
let disableDeck = false;
let isPlaying = false;
let cardOne, cardTwo, timer;


function createCard() {
    const card = document.createElement("div");
    card.classList.add("card");

    const frontView = document.createElement("div");
    frontView.classList.add("view", "front-view");

    const frontBox = document.createElement("div");
    frontBox.classList.add("box");

    const frontContent = document.createElement("div");
    frontContent.classList.add("content");

    const champ = document.createElement("img");
    champ.src = "images/cl-logo.png";

    frontContent.appendChild(champ);
    frontBox.appendChild(frontContent);
    frontView.appendChild(frontBox);
    card.appendChild(frontView);

    const backView = document.createElement("div");
    backView.classList.add("view", "back-view");

    const backBox = document.createElement("div");
    backBox.classList.add("box");

    const backContent = document.createElement("div");
    backContent.classList.add("content");

    const backImg = document.createElement("img");
    backImg.src = "";
    backImg.alt = "image";

    backContent.appendChild(backImg);
    backBox.appendChild(backContent);
    backView.appendChild(backBox);
    card.appendChild(backView);

    return card;
}

function createCards() {
    const crds = [];
    for (let i = 0; i < 28; i++) {
        crds.push(createCard());
    }
    return crds;
}

function renderCards() {
    let crds = createCards();

    const deck = document.querySelector(".container");
    crds.forEach((card) => {
        deck.appendChild(card);
    });
    cards = document.querySelectorAll(".card");

}

renderCards();




let teamShorts = teams.map(team => team.short);

function initTimer() {
    if (timeLeft <= 0) {
        return clearInterval(timer);
    }
    timeLeft--;
    timeTag.innerText = timeLeft;
    if (timeLeft == 0) {

        //add flip animation to all cards
        cards.forEach(card => {
            card.classList.remove("flip");
            card.classList.add("flip");
        }
        )
    }
}

function flipCard({ target: clickedCard }) {
    if (!isPlaying) {
        isPlaying = true;
        timer = setInterval(initTimer, 1000);
    }
    if (clickedCard !== cardOne && !disableDeck && timeLeft > 0) {

        flips++;
        flipsTag.innerText = flips;

        clickedCard.classList.add("flip");
        if (!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector(".back-view img").src,
            cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2) {
    if (img1 === img2) {
        matchedCard++;
        matchedTag.innerText = matchedCard;
        if (matchedCard == teams.length && timeLeft > 0) {
            return clearInterval(timer);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }

    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}

function shuffleCard() {
    timeLeft = maxTime;
    flips = matchedCard = 0;
    cardOne = cardTwo = "";
    clearInterval(timer);
    timeTag.innerText = timeLeft;
    flipsTag.innerText = flips;
    matchedTag.innerText = matchedCard;
    disableDeck = isPlaying = false;

    let arr = teams.concat(teams);
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);

    console.log(arr)
    cards.forEach((card, index) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img");
        setTimeout(() => {
            imgTag.src = `teams/${arr[index].img}`;
        }, 500);
        card.addEventListener("click", flipCard);
    });
}

shuffleCard();

refreshBtn.addEventListener("click", shuffleCard);

cards.forEach(card => {
    card.addEventListener("click", flipCard);
});