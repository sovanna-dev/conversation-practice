const firebaseConfig = {
  apiKey: "AIzaSyCaaLenFiseFSkOdTYzzlQYu0AwK__t4aQ",
  authDomain: "conversation-pro-54d60.firebaseapp.com",
  projectId: "conversation-pro-54d60",
  storageBucket: "conversation-pro-54d60.firebasestorage.app",
  messagingSenderId: "591079299204",
  appId: "1:591079299204:web:c770d08c270578cfc0cad1",
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db = firebase.firestore();
export const FieldValue = firebase.firestore.FieldValue;
export default firebase;

export const syncUserStats = async (uid, stats) => {
  return db.collection('users').doc(uid).set({
    ...stats,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
};

export const getLeaderboard = async (limit = 5) => {
  const snapshot = await db.collection('users').orderBy('xp', 'desc').limit(limit).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateUserRole = async (uid, newRole) => {
  return db.collection('users').doc(uid).update({ role: newRole });
};
