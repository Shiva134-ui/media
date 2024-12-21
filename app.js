import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCAquVB8qXnUoaHH0FGEYURA_7JvWinewQ",
    authDomain: "media1-eac72.firebaseapp.com",
    databaseURL: "https://media1-eac72-default-rtdb.firebaseio.com",
    projectId: "media1-eac72",
    storageBucket: "media1-eac72.firebasestorage.app",
    messagingSenderId: "1087553912836",
    appId: "1:1087553912836:web:54070f13ec0998057b3551",
    measurementId: "G-F6NK7D5X6H"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);





const emailInput = document.getElementById("email") || document.getElementById("signup-email");
const passwordInput = document.getElementById("password") || document.getElementById("signup-password");
const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button");
const logoutButton = document.getElementById("logout-button");
const welcomeMessage = document.getElementById("welcome-message");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

const messagesRef = collection(db, "messages");

if (loginButton) {
    loginButton.addEventListener("click", () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        signInWithEmailAndPassword(auth, email, password)
            .then(() => window.location.href = "chat.html")
            .catch((error) => alert(error.message));
    });
}

if (signupButton) {
    signupButton.addEventListener("click", () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => window.location.href = "chat.html")
            .catch((error) => alert(error.message));
    });
}

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        signOut(auth)
            .then(() => window.location.href = "index.html")
            .catch((error) => alert(error.message));
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (window.location.pathname !== "/chat.html") {
            window.location.href = "chat.html";
        }
        welcomeMessage.textContent = `Welcome, ${user.email}`;
        fetchMessages();
    } else {
        if (window.location.pathname !== "/index.html" && window.location.pathname !== "/signup.html") {
            window.location.href = "index.html";
        }
    }
});


// Fetch messages in real-time
function fetchMessages() {
    const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
    onSnapshot(messagesQuery, (snapshot) => {
        messagesDiv.innerHTML = "";
        snapshot.forEach((doc) => {
            const messageData = doc.data();
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message");
            messageDiv.textContent = `${messageData.user}: ${messageData.text}`;
            if (messageData.user === auth.currentUser.email) messageDiv.classList.add("user");
            messagesDiv.appendChild(messageDiv);
        });
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

// Send a new message
if (sendButton) {
    sendButton.addEventListener("click", async () => {
        const messageText = messageInput.value.trim();
        if (messageText && auth.currentUser) {
            await addDoc(messagesRef, {
                text: messageText,
                user: auth.currentUser.email,
                timestamp: new Date(),
            });
            messageInput.value = "";
        }
    });
}



