import logo from "./logo.svg";
import "./App.css";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
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
    password: "",
    photo: "",
    success: false,
    error: "",
  });
  const [newUser, setNewUser] = useState(false);

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
  const sigOutnHandel = () => {
    const auth = getAuth();
    signOut(auth)
      .then((res) => {
        const signedOutuser = {
          isSingdIn: false,
          // photo: '',
          // name: '',
          // email: '',
        };
        setUser(signedOutuser);
      })
      .catch((error) => {});
  };

  const handelBlur = (e) => {
    let isFormValid = true;
    let isMailValid = true;
    let isNameValid = true;
    if ((e.target.name = "name")) {
      isNameValid = e.target.value;
    }
    if (isNameValid) {
      const newUser = { ...user };
      newUser[e.target.name] = e.target.value;
      setUser(newUser);
    }
    if ((e.target.name = "email")) {
      isMailValid = /\S+@\S+\.\S+/.test(e.target.value);
      console.log(isFormValid);
    }
    if (isMailValid) {
      const newUser = { ...user };
      newUser[e.target.name] = e.target.value;
      setUser(newUser);
    }
    if ((e.target.name = "password")) {
      const passwordValidate = e.target.value.length > 6;
      const passwordNumber = /\d{3}/.test(e.target.value);
      isFormValid = passwordValidate && passwordNumber;
    }
    if (isFormValid) {
      const newUser = { ...user };
      newUser[e.target.name] = e.target.value;
      setUser(newUser);
    }
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    console.log(user.email, user.password);
    if ( newUser && user.email && user.password ) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential ) => {
          const newData = { ...user };
          newData.error = "";
          newData.success = true;
          setUser(newData);
          userNameUpdate(user.name)
          // Signed in
          // const user = userCredential.user;
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
          const newData = { ...user };
          newData.error = errorCode;
          newData.success = false;
          setUser(newData);
          // ..
        });
    }
    if (!newUser && user.email && user.password) {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          const newData = {...user };
          newData.error = "";
          newData.success = true;
          setUser(newData);
          console.log('sign in info',userCredential.user)
          // Signed in
          // const user = userCredential.user;
          // console.log(user);
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
          const newData = { ...user };
          newData.error = errorCode;
          newData.success = false;
          setUser(newData);
        });
    }
  };
  const userNameUpdate = (name) => {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        console.log('user name updated successfully')
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="App">
      {user.isSingdIn ? (
        <button onClick={sigOutnHandel}>sign out</button>
      ) : (
        <button onClick={signinHandel}>sign in</button>
      )}
        <br />
        <button>Sign in with facebook</button>

      {user.isSingdIn && (
        <div>
          <img src={user.photo} alt="" />
          <h4>welcme: {user.name}</h4>
          <p>your mail is: {user.email}</p>
        </div>
      )}
      <p>Name: {user.name}</p>
      <p>E-mail: {user.email}</p>
      <p>Password: {user.password}</p>
      <input
        type="checkbox"
        onChange={() => setNewUser(!newUser)}
        name="newUser"
        id=""
      />
      <label htmlFor="newUser">New user sign up</label>
      <form onSubmit={handelSubmit}>
        {newUser && <input type="text" name="name" onBlur={handelBlur} />}
        <br />
        <br />
        <input type="text" name="email" onBlur={handelBlur} required />
        <br />
        <br />
        <input type="password" name="password" onBlur={handelBlur} required />
        <br />
        <br />
        <input type="submit" value='sign in' />
      </form>
      <p style={{ color: "red" }}>{user.error}</p>
      {user.success && (
        <p style={{ color: "green" }}>
          User{newUser ? "created" : "loged in"} successfully
        </p>
      )}
    </div>
  );
}

export default App;
