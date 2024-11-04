import { Injectable } from "@angular/core";
import { Messaging, getToken, deleteToken, onMessage } from "@angular/fire/messaging";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class FcmService {
  message$: Observable<any>; // Define message$ property

  constructor(private msg: Messaging) {
    Notification.requestPermission().then((notificationPermissions: NotificationPermission) => {
      if (notificationPermissions === "granted") {
        console.log("Notification permission granted.");
      } else if (notificationPermissions === "denied") {
        console.log("Notification permission denied.");
      }
    });

    // Register service worker
    navigator.serviceWorker
      .register("firebase-messaging-sw.js", { type: 'module', scope: '__' })
      .then((serviceWorkerRegistration) => {
        return getToken(this.msg, {
          vapidKey: environment.vapid,
          serviceWorkerRegistration: serviceWorkerRegistration,
        });
      })
      .then((token) => {
        console.log('My FCM token:', token);
        // This is a good place to store the token in your database for each user
      })
      .catch((error) => {
        console.error('Error retrieving token: ', error);
      });

    // Initialize the message$ observable
    this.message$ = new Observable((sub) => {
      const unsubscribe = onMessage(this.msg, (msg) => {
        sub.next(msg);
        console.log("My Firebase Cloud Message:", msg);
      });

      // Cleanup function
      return () => {
        unsubscribe();
      };
    });
  }

  async deleteToken() {
    try {
      await deleteToken(this.msg);
      console.log("FCM token deleted successfully.");
      // Update this on your Firestore database if you are storing them
    } catch (error) {
      console.error("Error deleting FCM token:", error);
    }
  }
}