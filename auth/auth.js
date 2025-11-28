const home = () => {
  window.location.href = '../index.html';
};
window.home = home;
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCvxY8EDpuQppy4XIXgiT-ALTfb8YFsjm8",
  authDomain: "linguaplay-9a91f.firebaseapp.com",
  projectId: "linguaplay-9a91f",
  storageBucket: "linguaplay-9a91f.firebasestorage.app",
  messagingSenderId: "821462503878",
  appId: "1:821462503878:web:16fd36f70641fd545e62c7"
};


const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

const auth = getAuth(app);

const googleSignIn = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log('User Info:', user);
    })
    .catch((error) => {
      const errorCode = error.code;
      console.log('Error Code:', errorCode);
    });
};

const create = () => {
  createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value)
  .then((userCredential) => {
    const user = userCredential.user;
    window.location.href = "../Dashboard/dashboard-r.html";
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log('Error Code:', errorCode);
  });
}

const signIn = () => {
  signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
  .then((userCredential) => {
    const user = userCredential.user;
    window.location.href = "../Dashboard/dashboard-r.html";
  })
  .catch((error) => {
    const errorCode = error.code;
    console.log('Error Code:', errorCode);
  });
}
  
window.googleSignIn = googleSignIn;
window.create = create;
window.signIn = signIn;