// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    // apiHost: 'http://vendure-dev.innity.com.my',
    apiHost: 'http://localhost',
    apiPort: 3000,
    shopApiPath: 'shop-api',
    baseHref: '/',
    tokenMethod: 'bearer',
    novuApplicationIdentifier: 's8ONsCGfYoUY',
    firebaseConfig: {
        apiKey: "AIzaSyBBBxnuQCVVXV_vR5YhPrwCS-n-iJ9ktk8",
        authDomain: "vendure-app-demo.firebaseapp.com",
        projectId: "vendure-app-demo",
        storageBucket: "vendure-app-demo.firebasestorage.app",
        messagingSenderId: "1012751272104",
        appId: "1:1012751272104:web:99208b08353d836e83da9d",
        measurementId: "G-ZE6GH5CP63"
    },
    vapid: 'BOYrCE0eSsMi2FXzA_A7za4qGGK6CX_RmNauyPocdyyoiWZlhls6B8YRnl0W1TWiJrN4xobuOXXyycTvWCwJJno',
    pushProviderIdentifier: 'firebase-vendure-storefront'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
