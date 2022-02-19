//register:
const form = document.getElementById("form-register");
const username = document.getElementById("username-reg");
const email = document.getElementById("email-reg");
const pass = document.getElementById("pass-reg");
const confirmpass = document.getElementById("confirmpass-reg");

//FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
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
const auth = getAuth();
const database = getDatabase(app);
const lstorage = window.localStorage;

//FROM VALIDATION
const validPass = (pass,confirm) => {
    if(pass != confirm) {
        showError(confirmpass, "Passwords don't match!");
        return false;
    }
    else {
        (confirmpass.parentElement).classList.remove("error");
        return true;
    }
}
const validUsername = (usr) => {
    if( usr.includes('@') || usr.includes('!') || usr.includes('#') || usr.includes('&') || usr.includes('^') ) {
        showError(username, "Username can't contain special symbols!");
        return false;
    }
    else {
        (username.parentElement).classList.remove("error");
        return true;
    }
}

//---------------------------

form.addEventListener("submit", (event) => {
    event.preventDefault();
   
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passValue = pass.value.trim();
    const confirmpassValue =confirmpass.value.trim();

    if(validUsername(usernameValue) && validPass(passValue,confirmpassValue)){
        createUserWithEmailAndPassword(auth, emailValue, passValue)
        .then((userCredential) => {
            const user = userCredential.user;
            user.displayName = usernameValue;
            const uid = user.uid;
            console.log(user);

            //add to db:
            set(ref(database, 'users/' + uid), {
                "username": usernameValue,
                "email": emailValue,
                "score" : 0
            });
            clearErrors(pass,email);
            lstorage.setItem("user",usernameValue);
            lstorage.setItem("uid",uid);
            window.location.href = 'game.html';
        })
        .catch((error) => {
            handleError(error.code);
        });
    }
});

function handleError(errorcode){
    if(errorcode === 'auth/weak-password') {
        showError(pass,"Password can't be shorter than 6 symbols!");
    }

    if(errorcode === 'auth/email-already-in-use') {
        showError(email,"An account with that email already exists!");
    } else if(errorcode === 'auth/invalid-email') {
        showError(email,"Invalid email!");
    }
 
}

function showError(inputField, message) {
    const inputItem = inputField.parentElement;
    const errorField = inputItem.querySelector('small');
    errorField.innerText = message;
    inputItem.classList.add("error");
}

function clearErrors() {
    (email.parentElement).classList.remove("error");
    (confirmpass.parentElement).classList.remove("error");
}