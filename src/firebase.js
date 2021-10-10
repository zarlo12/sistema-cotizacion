import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import 'firebase/compat/messaging'

let configFirebase = {
  apiKey: "AIzaSyCQPAAyuyZKi9V5PNsFDR0e63k8EOf__4w",
  authDomain: "cotizaciones-credito.firebaseapp.com",
  projectId: "cotizaciones-credito",
  storageBucket: "cotizaciones-credito.appspot.com",
  messagingSenderId: "973499255749",
  appId: "1:973499255749:web:a72a7cb65b188c587359ac"
}; 


export const config = configFirebase; 


firebase.initializeApp(config)

export default firebase

export const FS_COLLECTIONS = {
  
}

