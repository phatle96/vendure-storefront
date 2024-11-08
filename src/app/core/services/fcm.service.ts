import { Injectable } from "@angular/core";
import { Messaging, getToken, deleteToken, onMessage } from "@angular/fire/messaging";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

import { StateService } from "../providers/state/state.service";
import { NovuApiService } from "./novu-api.service";


@Injectable({
  providedIn: "root",
})
export class FcmService {

  message$: Observable<any>; // Define message$ property
  permission: string;
  fcmToken: string;

  constructor(
    private msg: Messaging,
    private stateService: StateService,
    private novuApiService: NovuApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      if (Notification.permission == "granted") {
        console.log("Notification permission granted.");
        this.permission = Notification.permission
        this.getFCMToken();
        this.listenMessages().subscribe();
      }
    } else {
      this.permission = "denied"
    }
  }

  enableNotifications() {
    if (isPlatformBrowser(this.platformId)) {
      Notification.requestPermission().then((notificationPermissions: NotificationPermission) => {
        if (notificationPermissions === "granted") {
          console.log("Notification permission granted.");
          this.getFCMToken()
          this.listenMessages().subscribe();
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
            this.stateService.setState('deviceToken', token)
            this.stateService.select(state => state.userId).subscribe(
              (userId) => {
                if (userId) {
                  this.stateService.select(state => state.fcmDeviceTokens).subscribe(
                    (fcmDeviceTokens) => {
                      if (fcmDeviceTokens.length && !fcmDeviceTokens.includes(token)) {
                        this.novuApiService.updateSubscriberCredentials(userId, "fcm", [...fcmDeviceTokens.slice(-10), token], environment.pushProviderIdentifier).subscribe()
                      }
                    }
                  )
                }
              }
            )
          })
          .catch((error) => {
            console.error('Error retrieving token: ', error);
          });
      }
    }
  }

  listenMessages() {
    // Initialize the message$ observable
    return this.message$ = new Observable((sub) => {
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