import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
    getMessaging,
    isSupported,
    onBackgroundMessage,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-sw.js";

const firebaseApp = initializeApp({
    apiKey: "AIzaSyBBBxnuQCVVXV_vR5YhPrwCS-n-iJ9ktk8",
    authDomain: "vendure-app-demo.firebaseapp.com",
    projectId: "vendure-app-demo",
    storageBucket: "vendure-app-demo.firebasestorage.app",
    messagingSenderId: "1012751272104",
    appId: "1:1012751272104:web:99208b08353d836e83da9d",
    measurementId: "G-ZE6GH5CP63",
});

isSupported().then((isSupported) => {
    if (isSupported) {
        const messaging = getMessaging(firebaseApp);

        onBackgroundMessage(
            messaging,
            ({ notification: { title, body, image } }) => {
                self.registration.showNotification(title, {
                    body,
                    icon: image || "/assets/icons/icon-72x72.png",
                });
            }
        );
    }
});
