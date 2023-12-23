import React from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDTsghJv8D8gqlLUdyXFosszMXaQzYTfX0",
  authDomain: "chatapp-using-react-firebase.firebaseapp.com",
  projectId: "chatapp-using-react-firebase",
  storageBucket: "chatapp-using-react-firebase.appspot.com",
  messagingSenderId: "488449512057",
  appId: "1:488449512057:web:928b7461c1669b10e23aa8"

})

const auth = firebase.auth();
const firestore = firebase.firestore();


// SIGNED IN : user is an object 
// SIGNED OUT : user is null
function App() {

  const [user] = UseAuthState(auth);
  return (
    <div className="App">
      <header>

      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const useSignInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthPrivider();
    auth.useSignInWithPopup(provider);                          // create a popup google authentication window
  }

  return (
    <button onClick = { useSignInWithGoogle } >
      Sign in with Google
    </button>
  )
}

function SignOut(){
  return auth.currentUser && (

    <button onClick={() => auth.signOut()}>
      Sign Out
    </button>
  )
}

function ChatRoom() {

  // reference a firestore collection
  const messagesRef = firestore.collection('messages');
  // query documents in a collection
  const query = messagesRef.orderBy('createAt').limit(25);

  // listen to data with a hook 
  const [messages] = useCollectionData(query, {idField: 'id'});

  return (
    <>
      <div>
        {messages && }

      </div>

      <div>

      </div>
    </>
  )

}

export default App;
