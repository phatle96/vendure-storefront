import { Injectable } from "@angular/core";
import { Messaging, getToken, deleteToken, onMessage } from "@angular/fire/messaging";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

import { getMessaging, onMessage as onFCMMessage } from 'firebase/messaging';


@Injectable({
  providedIn: "root",
})
export class FcmService {
  message$: Observable<any>; // Define message$ property
  permission = Notification.permission;

  constructor(
    private msg: Messaging,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (this.permission == "granted") {
      console.log("Notification permission granted.");
      this.getFCMToken();
    }
  }

  enableNotifications() {
    if (isPlatformBrowser(this.platformId)) {
      Notification.requestPermission().then((notificationPermissions: NotificationPermission) => {
        if (notificationPermissions === "granted") {
          console.log("Notification permission granted.");
          this.getFCMToken()
        } else if (notificationPermissions === "denied") {
          console.log("Notification permission denied.");
        }
      });
    }
  }

  getFCMToken() {
    if (isPlatformBrowser(this.platformId)) {
      // Register service worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register("assets/firebase-messaging-sw.js", { type: 'module' })
          .then((serviceWorkerRegistration) => {
            return getToken(this.msg, {
              vapidKey: environment.vapid,
              serviceWorkerRegistration: serviceWorkerRegistration,
            });
          })
          .then((token) => {
            console.log('My FCM token:', token);
            this.listenMessages();
            // This is a good place to store the token in your database for each user
          })
          .catch((error) => {
            console.error('Error retrieving token: ', error);
          });
      }
    }
  }

  listenMessages() {

    // Initialize the message$ observable
    // this.message$ = new Observable((sub) => {
    //   const unsubscribe = onMessage(this.msg, (msg) => {
    //     sub.next(msg);
    //     console.log("My Firebase Cloud Message:", msg);
    //   });

    //   // Cleanup function
    //   return () => {
    //     unsubscribe();
    //   };
    // });

    const messaging = getMessaging();
    onFCMMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
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