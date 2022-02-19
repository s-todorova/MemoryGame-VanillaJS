import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, child, get  } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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
const auth = getAuth();
const lstorage = window.localStorage;
//login:
const form = document.getElementById("form-login");
const email = document.getElementById("email-login");
const pass = document.getElementById("pass-login");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("clicked login");
    const emailValue = email.value.trim();
    const passValue = pass.value.trim();

    
    signInWithEmailAndPassword(auth, emailValue, passValue)
    .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;

        clearErrors(pass,email);

        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            lstorage.setItem("user",snapshot.val().username);
            lstorage.setItem("uid",uid);

            window.location.href = 'game.html';
          }
        }).catch((error) => {
          console.error(error);
        });
        
    })
    .catch((error) => {
        handleError(error.code);
    });
    
});

//helpers:

function handleError(errorcode){
    if(errorcode === 'auth/wrong-password') {
        showError(pass,"Wrong password!");
        console.log("wrong pass");
    }

    if(errorcode === 'auth/user-not-found') {
        showError(email,"No account with that email found!");
        console.log("no acc with email");
    } else if(errorcode === 'auth/invalid-email') {
        showError(email,"Invalid email!");
        console.log("wrong email");
    }
 
}

function showError(inputField, message) {
    const inputItem = inputField.parentElement;
    const errorField = inputItem.querySelector('small');
    errorField.innerText = message;
    inputItem.classList.add("error");
}

function clearErrors(em,pas) {
    (pas.parentElement).classList.remove("error");
    (em.parentElement).classList.remove("error");
}