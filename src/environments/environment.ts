// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseURL: 'http://localhost:5000/utpl-play/us-central1',
  clientId: 'f99950bd-e2f1-47b9-8e83-ffc681374197',
  redirectUri: 'https://localhost:4200',
  firebaseConfig: {
    apiKey: "AIzaSyAfqq_hhBozYVXzQtcIitCDsjprno4u63A",
    authDomain: "utpl-play.firebaseapp.com",
    projectId: "utpl-play",
    storageBucket: "utpl-play.appspot.com",
    messagingSenderId: "30358049886",
    appId: "1:30358049886:web:65263609e0508dd1afd0cf",
    measurementId: "G-NXZPDVZDKQ"
  },
  areas: [

    { name: 'Ciencias económicas y empresariales', value: 'economicas' },
    { name: 'Ciencias jurídicas y políticas', value: 'juridicas' },
    { name: 'Ciencias de la salud', value: 'salud' },
    { name: 'Ingenierías y arquitectura', value: 'ingenierias' },
    { name: 'Ciencias exactas y naturales', value: 'exactas' },
    { name: 'Ciencias sociales, educación y humanidades', value: 'sociales' },

  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
