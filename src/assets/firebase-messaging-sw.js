import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-sw.js";

const firebaseApp = initializeApp({
    apiKey: "AIzaSyBBBxnuQCVVXV_vR5YhPrwCS-n-iJ9ktk8",
    authDomain: "vendure-app-demo.firebaseapp.com",
    projectId: "vendure-app-demo",
    storageBucket: "vendure-app-demo.firebasestorage.app",
    messagingSenderId: "1012751272104",
    appId: "1:1012751272104:web:99208b08353d836e83da9d",
    measurementId: "G-ZE6GH5CP63",
});


const messaging = getMessaging(firebaseApp);

// Add push event listener immediately
self.addEventListener('push', (event) => {
    const data = event.data.json();
    console.log('Push notification received:', data);

    const title = data.notification.title || 'New Notification';
    const options = {
        body: data.notification.body,
        icon: data.notification.icon || '/default-icon.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});


// Add notification click event listener immediately
self.addEventListener('notificationclick', (event) => {
    console.log('Notification click received.');
    event.notification.close(); // Close the notification

    // Define a custom URL to open when the notification is clicked
    const clickResponsePromise = clients.openWindow('/some-page');
    event.waitUntil(clickResponsePromise);
});


// Add pushsubscriptionchange event listener immediately
self.addEventListener('pushsubscriptionchange', (event) => {
    console.log('Push subscription change detected.');

    // Handle the subscription change
    event.waitUntil(
        messaging.getToken({ vapidKey: 'your-vapid-key' })
            .then((newToken) => {
                console.log('New token generated:', newToken);
                // Update the token in your database or app as needed
            })
            .catch((error) => {
                console.error('Error generating new token:', error);
            })
    );
});