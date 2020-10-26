import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

const firebaseConfigFIRESTORE = {
  apiKey: "AIzaSyD2tNgssS7SN0yzqib87qVitcXtzgTp9WM",
  authDomain: "job-crafting-journey.firebaseapp.com",
  databaseURL: "https://job-crafting-journey.firebaseio.com",
  projectId: "job-crafting-journey",
  storageBucket: "job-crafting-journey.appspot.com",
  messagingSenderId: "177360630636",
  appId: "1:177360630636:web:ac5008c0af7ca81836f949",
  measurementId: "G-FVVJP69P0F"
};
class Firebase {
  constructor() {
    app.initializeApp(firebaseConfigFIRESTORE);
    /* Helper */

    this.fieldValue = app.firestore.FieldValue;
    this.emailAuthProvider = app.auth.EmailAuthProvider;

    this.auth = app.auth();
    this.db = app.firestore();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: 'http://localhost:3000'
    });

  // *** Merge Auth and DB User API *** //

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
        .get()
          .then(snapshot => {
            const dbUser = snapshot.data();

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = [];
            }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser,
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });

  // *** User API ***

  user = uid => this.db.doc(`users/${uid}`);
  users = () => this.db.collection('users');

  // *** Message API ***
//message = uid => this.db.doc(`messages/${uid}`);
//messages = () => this.db.collection(`messages`);
jobDemand = (users, uid) => this.db.doc(`users/${users}/jobDemands/${uid}`);
jobDemands = (users) => this.db.collection(`users/${users}/jobDemands`);

jobResource = (users, uid) => this.db.doc(`users/${users}/jobResources/${uid}`);
jobResources = (users) => this.db.collection(`users/${users}/jobResources`);

homeDemand = (users, uid) => this.db.doc(`users/${users}/homeDemands/${uid}`);
homeDemands = (users) => this.db.collection(`users/${users}/homeDemands`);

homeResource = (users, uid) => this.db.doc(`users/${users}/homeResources/${uid}`);
homeResources = (users) => this.db.collection(`users/${users}/homeResources`);

personalResource = (users, uid) => this.db.doc(`users/${users}/personalResources/${uid}`);
personalResources = (users) => this.db.collection(`users/${users}/personalResources`);

challenge = (users, uid) => this.db.doc(`users/${users}/challenges/${uid}`);
challenges = (users) => this.db.collection(`users/${users}/challenges`);

reflection = (users, uid) => this.db.doc(`users/${users}/reflections/${uid}`);
reflections = (users) => this.db.collection(`users/${users}/reflections`);
}

export default Firebase;
