import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; 
import 'firebase/compat/firestore';
import 'firebase/analytics';


import { useAuthState } from 'react-firebase-hooks/auth';
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
const analytics = firebase.analytics();


// SIGNED IN : user is an object 
// SIGNED OUT : user is null
function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">

      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);                          // create a popup google authentication window
  }

  return (
    <>
      <button className="sign-in" onClick = { signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )
}

function SignOut() {
  return auth.currentUser && (

    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  
  const dummy = useRef();
  // reference a firestore collection
  const messagesRef = firestore.collection('messages');
  // query documents in a collection
  const query = messagesRef.orderBy('createdAt').limit(25);

  // listen to data with a hook 
  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');


  const sendMessage = async(e) => {
    // normally when a form is submited it will refresh the page to stop that (preventDefault)

    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;
    
    // create new document in firestore 
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });

  }

  return (<>

      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>

      </main>
      
      {/* write value to firestore */}
      <form onSubmit={sendMessage}>
        {/* bind state to form input */}
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Say Something Nice" />

        <button type="submit" disabled={!formValue}>🕊️</button>

      </form>
    </>
  )
}

function ChatMessage(props){
  const {text , uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>
  ) 
    
}

export default App;
