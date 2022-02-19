import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, set, ref  } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyB2l5uVoPrlYEsl2TK6Qg41jL_BqBok108",
    authDomain: "memory-game-2b89b.firebaseapp.com",
    databaseURL: "https://memory-game-2b89b-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "memory-game-2b89b",
    storageBucket: "memory-game-2b89b.appspot.com",
    messagingSenderId: "677436643113",
    appId: "1:677436643113:web:9e9dce37835ddb04bbc938"
};

  // Initialize Firebase

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const lstorage = window.localStorage;
  const currUser = lstorage.getItem("user");
//------------------------------------------
const deck = document.getElementById("deck");
const modal = document.getElementById("modal");

const start = document.getElementById("start-btn");
const restart = document.getElementById("reset-btn");

const modalRestart = document.getElementById("modal-restart");
const leaderboard = document.getElementById("modal-leaderboard")

const timeCounter = document.getElementById("timer");
let time;
let minutes = 0;
let seconds = 0;
let timeStart = false;

let opened = [];
let matched = [];
let cardArr = [
  "elen.jpg", "elen.jpg",
  "fox.jpg","fox.jpg",
  "compass.jpg","compass.jpg",
  "lion.jpg","lion.jpg",
  "owl.jpg","owl.jpg",
  "skull.jpg","skull.jpg",
  "triangle.jpg","triangle.jpg",
  "unicorn.jpg","unicorn.jpg",
];


//---START AND END GAME----
function startGame() {

	const shuffledDeck = shuffle(cardArr);
	for (let i = 0; i < shuffledDeck.length; i++) {
		
		const li = document.createElement('li');
		li.classList.add('card');
		const img = document.createElement("img");
		li.appendChild(img);
		img.setAttribute("src", `./images/${shuffledDeck[i]}`);
		deck.appendChild(li);
	}
}

const winGame = () => {
	if (matched.length === 16) {
		stopTimer();
    updateDatabase();
    modalStats();
		modalShow();
	}
}
const userId = lstorage.getItem("uid");

function updateDatabase() {
    let currScore = minutes*60+seconds;
    set(ref(database, 'users/' + userId + '/score'), currScore);
    lstorage.setItem("score",currScore);
  
}
//----------------------------

deck.addEventListener("click", function(e) {	
  if (e.target.nodeName === "LI") {
	  flip(e.target);	
  }
});

const flip = (card) => {
  card.classList.add("flip");
  addToOpened(card);
}
 
const addToOpened = (card) => {
  if (opened.length === 0 || opened.length === 1) {
    opened.push(card.firstElementChild);
  }
  compareCards();
}

const compareCards = () => {
	if (opened.length === 2) {
  		document.body.style.pointerEvents = "none";
  }

	if (opened.length === 2 && opened[0].src === opened[1].src) {
		matchedCards();
	} else if (opened.length === 2 && opened[0].src != opened[1].src) {
		notMatched();
	}
}

const matchedCards = () => {
	setTimeout(function() {
		opened[0].parentElement.classList.add("match");
		opened[1].parentElement.classList.add("match");
		matched.push(...opened);
		document.body.style.pointerEvents = "auto";
		winGame();
		opened = [];
	}, 600);
}

const notMatched = () => {
	setTimeout(function() {
		opened[0].parentElement.classList.remove("flip");
		opened[1].parentElement.classList.remove("flip");
		document.body.style.pointerEvents = "auto";
		opened = [];
	}, 600);
}

//---SHUFFLE----
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }
  return array;
}

//-----RESET-----
const clearDeck = () => {
	while (deck.hasChildNodes()) {
		deck.removeChild(deck.firstChild);
	}
}
function reset() {
	stopTimer();
	timeStart = false;
	seconds = 0;
	minutes = 0;
  timeCounter.innerHTML = `0min 0s` ;
	
	matched = [];
	opened = [];

	clearDeck();
}
//-------------------------------

//-----TIMER-------
const updateTimer = () => {
	time = setInterval(function() {
		seconds++;
			if (seconds === 60) {
				minutes++;
				seconds = 0;
			}
		timeCounter.innerHTML = `<span>${minutes}min ${seconds}s</span>` ;
	}, 1000);
}

const stopTimer = () => {
  clearInterval(time);
}
//-----------------

//-------MODAL----------
const modalShow = () => {
  modal.style.display= "block";  
}

const modalClose = document.getElementById("modal-close");
modalClose.onclick = function() {
  modal.style.display = "none";
};

modalRestart.addEventListener("click", (e) => {
  //clearDeck();
  reset();
  modal.style.display = "none";
})
leaderboard.addEventListener("click", (e) => {
  window.location.href = 'leaderboard.html';
  modal.style.display = "none";
})

function modalStats() {
  const greeting = document.getElementById("endgame");
  const score = document.getElementById("score");
  greeting.innerText = `Thank you for playing, ${currUser}!`;
  score.innerText = `${minutes}min ${seconds}s`;

}

//--------------------------

start.addEventListener('click',(e) => {
  if (timeStart === false) {
    timeStart = true; 
    updateTimer();
  }
  startGame();
} );

restart.addEventListener('click',(e) => {
  reset();
  if (timeStart === false) {
    timeStart = true; 
    updateTimer();
  }
	startGame();

} );
