import logo from "./logo.svg";
import "./App.css";
import { initializeApp } from "firebase/app";
import { getAuth, signOut  } from "firebase/auth";
import firebaseConfig from "./firebase.config";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";

const app = initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSingdIn: false,
    name: "",
    email: "",
    photo: "",
  });
  const provider = new GoogleAuthProvider();
  const signinHandel = () => {
    console.log("sign ind");
    const auth = getAuth();
    signInWithPopup(auth, provider).then((result) => {
      console.log(result);
      const { displayName, photoURL, email } = result.user;
      const singedUser = {
        isSingdIn: true,
        photo: photoURL,
        name: displayName,
        email: email,
      };
      setUser(singedUser);
    });
  };
  const sigOutnHandel =()=>{
    const auth = getAuth();
    signOut(auth).then((res) => {
      const signedOutuser = {
        isSingdIn: false,
        // photo: '',
        // name: '',
        // email: '',
      }
      setUser(signedOutuser);
    }).catch((error) => {
    });
  }
  return (
    <div className="App">
      {
        user.isSingdIn ? <button onClick={sigOutnHandel}>sign out</button> : <button onClick={signinHandel}>sign in</button>
      }
      {
        user.isSingdIn && <div> 
          <img src={user.photo} alt="" />
          <h4>welcme: {user.name}</h4>
          <p>your mail is: {user.email}</p>
           </div>
      }
    </div>
  );
}

export default App;
