import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onChildAdded, onChildChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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
const scoreboard = document.getElementById("scoreboard");

//----get scores----
const scoreArray = [];

const dataRef = ref(database,"users");
onChildAdded(dataRef,(data) => {
    scoreArray.push(data.val());
    scoreArray.sort((a,b) => a.score - b.score);
    updateUIList();
});

onChildChanged(dataRef,(data) => {
    console.log(data.val());
    const idx = scoreArray.indexOf((element) => element.username === data.val().username);
    if (idx < 0) { 
        return;
    }
    scoreArray[idx] = data.val();
    updateUIListAtIndex(idx);
});

const dataToElement = (data) => {
    const li = document.createElement("li");
    li.innerHTML = `${data.username}: <span>${data.score}</span>`;
    if (data.username === currUser){
        li.classList.add("user-score");
    }
    return li;
};

const updateUIList = () => {
    const newChildren = scoreArray.map(dataToElement);
    scoreboard.replaceChildren(...newChildren);
};

const updateUIListAtIndex = (idx) => {
    const element = scoreboard.children[idx];
    const newElement = dataToElement(scoreArray[idx]);
    scoreboard.replaceChild(newElement, element);
};