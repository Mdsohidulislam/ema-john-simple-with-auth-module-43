// 43.3 app.login.js====================>>>>>>>>>>>
import React, { useContext, useState } from 'react';
import firebase from 'firebase'
import 'firebase/auth'
import '../../App.css'
import firebaseConfig from '../../firebaseConfig'
import { UserContext } from '../../App';


firebase.initializeApp(firebaseConfig);

const Login = () => { 

  const [newUser,setNewUser]=useState(false)

  const [user,setUser]=useState({
    isSignIn:false, 
    name:'',
    email:'',
    photo:''
  })

const [loggedInUser,setLoggedInUser]=useContext(UserContext);


  var provider = new firebase.auth.GoogleAuthProvider();


  const handleSignIn=()=>{
      firebase.auth().signInWithPopup(provider)
      .then(res=>{
          const userInfo=res.user;
          setUser({
            isSignIn:true,
            name:userInfo.displayName,
            email:userInfo.email,
            photo:userInfo.photoURL
          })
      })
      .catch(err=>{
        console.log(err.message);
      })
  }

  const handleSignOut=()=>{
    firebase.auth().signOut().then(res=>{
      const signedOutUser={
        isSignIn:false,
        name:'',
        email:'',
        photo:'',
        error:'',
        success:false
      }
      setUser(signedOutUser)
    })
  }

  const {isSignIn,name,email,photo}=user;

  const handleBlur=(event)=>{ 
    let isFieldValid=true; 
    if(event.target.name === 'email'){
            isFieldValid= /\S+@\S+\.\S+/.test(event.target.value);
    }if(event.target.name === 'password'){
        const  isPasswordValid = event.target.value.length > 6;
        const passwordHasNumber = /\d{1}/.test(event.target.value);
        isFieldValid=isPasswordValid && passwordHasNumber;
    }if(isFieldValid){
        const newUserInfo={...user}
        newUserInfo[event.target.name]=event.target.value;
        setUser(newUserInfo);
    }
    
}

const handleSubmit=(e)=>{
  if(newUser && user.email && user.password){
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then((res) => {
    const newUserInfo={...user}
    newUserInfo.success=true;
    newUserInfo.name=res.name;
    newUserInfo.error=''
    setUser(newUserInfo)
    updateUserInfo(user.name)
    
  })
  .catch((error) => {
  const newUserInfo={...user}
  var errorMessage = error.message;
  newUserInfo.success=false;
  newUserInfo.error=errorMessage;
  setUser(newUserInfo)
  // ..
  });
}

if(!newUser && user.email && user.password){
  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then((res) => {
    const newUserInfo={...user}
    newUserInfo.success=true;
    newUserInfo.error=''
    setUser(newUserInfo)
    setLoggedInUser(newUserInfo)
  })
  .catch((error) => {
    const newUserInfo={...user}
    var errorMessage = error.message; 
    newUserInfo.success=false;
    newUserInfo.error=errorMessage;
    setUser(newUserInfo)
  });
}

e.preventDefault();
}

  function updateUserInfo(name){
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName:name
    }).then(function() {
      // Update successful.
      console.log('user name updated successfully');
    }).catch(function(error) {
      // An error happened.
      console.log(error.message);
    });
  }

  return (
    <div className='loginDiv'>
      <h1>App components</h1>
      {isSignIn ? <button className='btn' onClick={handleSignOut}>Sing Out</button> : <button className='btn' onClick={handleSignIn}>Sing In</button>}
      {
        user.isSignIn && <div>
                <p>Welcome {name}.....</p>
                <p>Your email is {email}</p>
                <img src={photo} alt=""/>
        </div> 
      }
      <div className="create-account">
      <h1>Create Account component</h1>
            <form onSubmit={handleSubmit}>
                <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" id=""/>
                <label htmlFor="">New user sign up</label>
                <br/>
                {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Write your name" required/>}
                <br/>
                <input type="email" name="email" onBlur={handleBlur} placeholder="Write your Email" required/>
                <br/>
                <input type="password" name="password" onBlur={handleBlur} placeholder="Write your password" required/>
                <br/>
                <input className='btn' type="submit" value="Submit"/>
            </form>
            <p style={{color:'red'}}>{user.error}</p>
            {user.success && <p style={{color:'green'}}> User {newUser ? 'account created' : 'logged In'} Successfully</p>}
      </div>
    </div>
  );
};

export default Login;


// app.js

import Header from './components/Header/Header';
import Shop from './components/Shop/Shop';
import {Route,Switch,Link} from 'react-router-dom';
import NotFound from './components/NotFound/NotFound';
import Inventory from './components/Inventory/Inventory'
import Review from './components/Review/Review';
import PorductDetail from './components/ProductDetail/PorductDetail';
import Login from './components/Login/Login';
import Shipment from './components/Shipment/Shipment'
import { createContext, useState } from 'react';
import PrivateRoute from './PrivateRoute/PrivateRoute';

export const UserContext=createContext()

const App=()=>{

  const [loggedInUser,setLoggedInUser]=useState({})

  return (
    <UserContext.Provider value={[loggedInUser,setLoggedInUser]}>  
    <h3>Email : {loggedInUser.email}</h3>
      <Header></Header>
      <Switch>
          <Route path='/shop'>
            <Shop></Shop>
          </Route>
          <Route path='/review'> 
            <Review></Review>
          </Route>
          <Route path='/inventory'> 
            <Inventory></Inventory>
          </Route>
          <Route path='/login'> 
            <Login></Login>
          </Route>
          <Route path='/shipment'> 
            <Shipment></Shipment>
          </Route>
          <Route exact path='/'>
            <Shop></Shop>
          </Route>
          <Route path='/product/:productKey'>
              <PorductDetail></PorductDetail>
          </Route>
          {/* path='*' sob niche dite hobe na hole kaj korbe na */}
          <Route path='*'>
              <NotFound></NotFound>
          </Route>
      </Switch>

      {/* <h1>Hi, I am md sohidul islam. I am from Bangladesh</h1> */}
    </UserContext.Provider>
  )
}


export default App;




43.4============================>>>>
PrivateRoute.js
import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { UserContext } from '../../App';

const PrivateRoute = ({children,...rest}) => {
    const [loggedInUser,setLoggedInUser]=useContext(UserContext)
    return (
        <Route
        {...rest}
        render={({ location }) =>
        loggedInUser.email ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
};

export default PrivateRoute;

// app.js
import Header from './components/Header/Header';
import Shop from './components/Shop/Shop';
import {Route,Switch,Link} from 'react-router-dom';
import NotFound from './components/NotFound/NotFound';
import Inventory from './components/Inventory/Inventory'
import Review from './components/Review/Review';
import PorductDetail from './components/ProductDetail/PorductDetail';
import Login from './components/Login/Login';
import Shipment from './components/Shipment/Shipment'
import { createContext, useState } from 'react';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

export const UserContext=createContext()

const App=()=>{

  const [loggedInUser,setLoggedInUser]=useState({})

  return (
    <UserContext.Provider value={[loggedInUser,setLoggedInUser]}>  
    <h3>Email : {loggedInUser.email}</h3>
      <Header></Header>
      <Switch>
          <Route path='/shop'>
            <Shop></Shop>
          </Route>
          <Route path='/review'> 
            <Review></Review>
          </Route>
          <PrivateRoute path='/inventory'> 
            <Inventory></Inventory>
          </PrivateRoute>
          <Route path='/login'> 
            <Login></Login>
          </Route>
          <PrivateRoute path='/shipment'> 
            <Shipment></Shipment>
          </PrivateRoute>
          <Route exact path='/'>
            <Shop></Shop>
          </Route>
          <Route path='/product/:productKey'>
              <PorductDetail></PorductDetail>
          </Route>
          {/* path='*' sob niche dite hobe na hole kaj korbe na */}
          <Route path='*'>
              <NotFound></NotFound>
          </Route>
      </Switch>

      {/* <h1>Hi, I am md sohidul islam. I am from Bangladesh</h1> */}
    </UserContext.Provider>
  )
}


export default App;

43.5=======================>>>>>>>>>
// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/logo.png'
import './Header.css';


const Header=()=>{
    return(
        <div className='header'>
            <img src={logo} alt=""/> 
            <nav>
                <Link to="/shop">Shop</Link>
                <Link to="/review">Order Review</Link>
                <Link to="/inventory">Manage Inventory here</Link>
            </nav>
        </div>
    )
}

export default Header;
// Login.js
import React, { useContext, useState } from 'react';
import firebase from 'firebase'
import 'firebase/auth'
import '../../App.css'
import firebaseConfig from '../../firebaseConfig'
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';


firebase.initializeApp(firebaseConfig);

const Login = () => { 

  const [newUser,setNewUser]=useState(false)

  const [user,setUser]=useState({
    isSignIn:false, 
    name:'',
    email:'',
    photo:''
  })

  const [loggedInUser,setLoggedInUser]=useContext(UserContext);
  // module43.5
  const history=useHistory();
  const location=useLocation()
  const  { from } = location.state || { from: { pathname: "/" } };
  // module43.5

  var provider = new firebase.auth.GoogleAuthProvider();


  const handleSignIn=()=>{
      firebase.auth().signInWithPopup(provider)
      .then(res=>{
          const userInfo=res.user;
          setUser({
            isSignIn:true,
            name:userInfo.displayName,
            email:userInfo.email,
            photo:userInfo.photoURL
          })
      })
      .catch(err=>{
        console.log(err.message);
      })
  }

  const handleSignOut=()=>{
    firebase.auth().signOut().then(res=>{
      const signedOutUser={
        isSignIn:false,
        name:'',
        email:'',
        photo:'',
        error:'',
        success:false
      }
      setUser(signedOutUser)
    })
  }

  const {isSignIn,name,email,photo}=user;

  const handleBlur=(event)=>{ 
    let isFieldValid=true; 
    if(event.target.name === 'email'){
            isFieldValid= /\S+@\S+\.\S+/.test(event.target.value);
    }if(event.target.name === 'password'){
        const  isPasswordValid = event.target.value.length > 6;
        const passwordHasNumber = /\d{1}/.test(event.target.value);
        isFieldValid=isPasswordValid && passwordHasNumber;
    }if(isFieldValid){
        const newUserInfo={...user}
        newUserInfo[event.target.name]=event.target.value;
        setUser(newUserInfo);
    }
    
}

const handleSubmit=(e)=>{
  if(newUser && user.email && user.password){
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then((res) => {
    const newUserInfo={...user}
    newUserInfo.success=true;
    newUserInfo.name=res.name;
    newUserInfo.error=''
    setUser(newUserInfo)
    updateUserInfo(user.name)
    
  })
  .catch((error) => {
  const newUserInfo={...user}
  var errorMessage = error.message;
  newUserInfo.success=false;
  newUserInfo.error=errorMessage;
  setUser(newUserInfo)
  // ..
  });
}

if(!newUser && user.email && user.password){
  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then((res) => {
    const newUserInfo={...user}
    newUserInfo.success=true;
    newUserInfo.error=''
    setUser(newUserInfo)
    setLoggedInUser(newUserInfo)
    // module 43.5
    history.replace(from);
  })
  .catch((error) => {
    const newUserInfo={...user}
    var errorMessage = error.message; 
    newUserInfo.success=false;
    newUserInfo.error=errorMessage;
    setUser(newUserInfo)
    // module
  });
}

e.preventDefault();
}

  function updateUserInfo(name){
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName:name
    }).then(function() {
      // Update successful.
      console.log('user name updated successfully');
    }).catch(function(error) {
      // An error happened.
      console.log(error.message);
    });
  }

  return (
    <div className='loginDiv'>
      <h1>App components</h1>
      {isSignIn ? <button className='btn' onClick={handleSignOut}>Sing Out</button> : <button className='btn' onClick={handleSignIn}>Sing In</button>}
      {
        user.isSignIn && <div>
                <p>Welcome {name}.....</p>
                <p>Your email is {email}</p>
                <img src={photo} alt=""/>
        </div> 
      }
      <div className="create-account">
      <h1>Create Account component</h1>
            <form onSubmit={handleSubmit}>
                <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" id=""/>
                <label htmlFor="">New user sign up</label>
                <br/>
                {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Write your name" required/>}
                <br/>
                <input type="email" name="email" onBlur={handleBlur} placeholder="Write your Email" required/>
                <br/>
                <input type="password" name="password" onBlur={handleBlur} placeholder="Write your password" required/>
                <br/>
                <input className='btn' type="submit" value="Submit"/>
            </form>
            <p style={{color:'red'}}>{user.error}</p>
            {user.success && <p style={{color:'green'}}> User {newUser ? 'account created' : 'logged In'} Successfully</p>}
      </div>
    </div>
  );
};

export default Login;


43.6=========================>>>>>>>

create loginManager.js


import firebase from 'firebase/app'
import 'firebase/auth'
import firebaseConfig from '../../firebaseConfig'
 
export const InitializeFirebaseApp=()=>{
    if(firebase.apps.length === 0){
        firebase.initializeApp(firebaseConfig);
    }
}



export const handleGoogleSignIn=()=>{

    const provider = new firebase.auth.GoogleAuthProvider();

    return firebase.auth().signInWithPopup(provider)
    .then(res=>{
        const userInfo=res.user;
        const signedInUser={
          isSignIn:true,
          name:userInfo.displayName,
          email:userInfo.email,
          photo:userInfo.photoURL
        }
        return signedInUser;
    })
    .catch(err=>{
      console.log(err.message);
    })
}

export const handleSignOut=()=>{
    return firebase.auth().signOut().then(res=>{
        const signedOutUser={
        isSignIn:false,
        name:'',
        email:'',
        photo:'',
        error:'',
        success:false
        }
        return signedOutUser;
    })
    }

    export const signInWithFb=()=>{
        const  fbProvider = new firebase.auth.FacebookAuthProvider(); 
        return firebase.auth().signInWithPopup(fbProvider)
        .then(res => {
                const user=res.user;
                return user;
        })
        .catch((error) => {
            
        });
    }








    // export const createUserWithEmailAndPassword=()=>{
    //     firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    //     .then((res) => {
    //       const newUserInfo={...user}
    //       newUserInfo.success=true;
    //       newUserInfo.name=res.name;
    //       newUserInfo.error=''
    //       setUser(newUserInfo)
    //       updateUserInfo(user.name)
          
    //     })
    //     .catch((error) => {
    //     const newUserInfo={...user}
    //     var errorMessage = error.message;
    //     newUserInfo.success=false;
    //     newUserInfo.error=errorMessage;
    //     setUser(newUserInfo)
    //     // ..
    //     });
    // }

    // export const signInWithEmailAndPassword=()=>{
    //     firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    //     .then((res) => {
    //       const newUserInfo={...user}
    //       newUserInfo.success=true;
    //       newUserInfo.error=''
    //       setUser(newUserInfo)
    //       setLoggedInUser(newUserInfo)
    //       // module 43.5
    //       history.replace(from);
    //     })
    //     .catch((error) => {
    //       const newUserInfo={...user}
    //       var errorMessage = error.message; 
    //       newUserInfo.success=false;
    //       newUserInfo.error=errorMessage;
    //       setUser(newUserInfo)
    //       // module
    //     });
    // }


    // export const updateUserInfo=name=>{
    //     const user = firebase.auth().currentUser;
    
    //     user.updateProfile({
    //       displayName:name
    //     }).then(function() {
    //       // Update successful.
    //       console.log('user name updated successfully');
    //     }).catch(function(error) {
    //       // An error happened.
    //       console.log(error.message);
    //     });
    //   }



    // login.js

    import React, { useContext, useState } from 'react';
import '../../App.css'
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { handleGoogleSignIn, handleSignOut, InitializeFirebaseApp, signInWithFb } from './LoginManager';

 

const Login = () => { 

  const [newUser,setNewUser]=useState(false)

  const [user,setUser]=useState({
    isSignIn:false, 
    name:'',
    email:'',
    photo:''
  })

  InitializeFirebaseApp();

  const [loggedInUser,setLoggedInUser]=useContext(UserContext);
  // module43.5
  const history=useHistory();
  const location=useLocation()
  const  { from } = location.state || { from: { pathname: "/" } };
  // module43.5




  const {isSignIn,name,email,photo}=user;

  const handleBlur=(event)=>{ 
    let isFieldValid=true; 
    if(event.target.name === 'email'){
            isFieldValid= /\S+@\S+\.\S+/.test(event.target.value);
    }if(event.target.name === 'password'){
        const  isPasswordValid = event.target.value.length > 6;
        const passwordHasNumber = /\d{1}/.test(event.target.value);
        isFieldValid=isPasswordValid && passwordHasNumber;
    }if(isFieldValid){
        const newUserInfo={...user}
        newUserInfo[event.target.name]=event.target.value;
        setUser(newUserInfo);
    }
    
}

  const handleSubmit=(e)=>{
  if(newUser && user.email && user.password){

  }

  if(!newUser && user.email && user.password){ 
  
  }

e.preventDefault();
}

    const GoogleSignIn=()=>{

      handleGoogleSignIn().then(res=>{
        setUser(res)
        setLoggedInUser(res)
        history.replace(from);
      })

    }

    const SignOut=()=>{
      handleSignOut().then(res=>{
        setUser(res);
        setLoggedInUser(res)
      })
    }

    const fbSignIn=()=>{
      signInWithFb().then(res=>{
        setUser(res)
        setLoggedInUser(res);
        history.replace(from);
      })
    }

  return (
    <div className='loginDiv'>
      <h1>App components</h1>
      {isSignIn ? <button className='btn' onClick={SignOut}>Sing Out</button> : <button className='btn' onClick={GoogleSignIn}>Sing In</button>}
      <br/>
      <br/>
      <button className='btn' onClick={fbSignIn}>Sign in with facebook</button>
      <div className="create-account">
      <h1>Create Account component</h1>
            <form onSubmit={handleSubmit}>
                <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" id=""/>
                <label htmlFor="">New user sign up</label>
                <br/>
                {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Write your name" required/>}
                <br/>
                <input type="email" name="email" onBlur={handleBlur} placeholder="Write your Email" required/>
                <br/>
                <input type="password" name="password" onBlur={handleBlur} placeholder="Write your password" required/>
                <br/><br/>
                <input className='btn' type="submit" value="Submit"/>
            </form>
            <p style={{color:'red'}}>{user.error}</p>
            {user.success && <p style={{color:'green'}}> User {newUser ? 'account created' : 'logged In'} Successfully</p>}
      </div>
    </div>
  );
};

export default Login;




43.7============================>>>>>>>>>>>>>>>>>>>>
loginManager.js

import firebase from 'firebase/app'
import 'firebase/auth'
import firebaseConfig from '../../firebaseConfig'
 
export const InitializeFirebaseApp=()=>{
    if(firebase.apps.length === 0){
        firebase.initializeApp(firebaseConfig);
    }
}



export const handleGoogleSignIn=()=>{

    const provider = new firebase.auth.GoogleAuthProvider();

    return firebase.auth().signInWithPopup(provider)
    .then(res=>{
        const userInfo=res.user;
        const signedInUser={
          isSignIn:true,
          name:userInfo.displayName,
          email:userInfo.email,
          photo:userInfo.photoURL
        }
        return signedInUser;
    })
    .catch(err=>{
      console.log(err.message);
    })
}

export const handleSignOut=()=>{
    return firebase.auth().signOut().then(res=>{
        const signedOutUser={
        isSignIn:false,
        name:'',
        email:'',
        photo:'',
        error:'',
        success:false
        }
        return signedOutUser;
    })
    }

    export const signInWithFb=()=>{
        const  fbProvider = new firebase.auth.FacebookAuthProvider(); 
        return firebase.auth().signInWithPopup(fbProvider)
        .then(res => {
                const user=res.user;
                return user;
        })
        .catch((error) => {
            
        });
    }








    export const createUserWithEmailAndPassword=(name,email,password)=>{
        return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((res) => {
          const newUserInfo=res.user;
          newUserInfo.success=true;
          newUserInfo.name=res.name;
          newUserInfo.error=''
          updateUserInfo(name)
          return newUserInfo;
        })
        .catch((error) => {
        const newUserInfo={}
        var errorMessage = error.message;
        newUserInfo.success=false;  
        return newUserInfo;
        });
    }

    export const signInWithEmailAndPassword=(email,password)=>{
        return firebase.auth().signInWithEmailAndPassword(email, password)
        .then((res) => {
          const newUserInfo=res.user;
          newUserInfo.success=true;
          newUserInfo.error=''
          return newUserInfo;
        })
        .catch((error) => {
          const newUserInfo={}
          var errorMessage = error.message; 
          newUserInfo.success=false;
          newUserInfo.error=errorMessage;
            return newUserInfo;
          // module
        });
    }


    export const updateUserInfo=name=>{
        const user = firebase.auth().currentUser;
    
        user.updateProfile({
          displayName:name
        }).then(function() {
          // Update successful.
          console.log('user name updated successfully');
        }).catch(function(error) {
          // An error happened.
          console.log(error.message);
        });
      }


      Login.js


      import React, { useContext, useState } from 'react';
import '../../App.css'
import { UserContext } from '../../App';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, handleGoogleSignIn, handleSignOut, InitializeFirebaseApp, signInWithEmailAndPassword, signInWithFb } from './LoginManager';

 

const Login = () => { 

  const [newUser,setNewUser]=useState(false)

  const [user,setUser]=useState({
    isSignIn:false, 
    name:'',
    email:'',
    photo:''
  })

  InitializeFirebaseApp();

  const [loggedInUser,setLoggedInUser]=useContext(UserContext);
  // module43.5
  const history=useHistory();
  const location=useLocation()
  const  { from } = location.state || { from: { pathname: "/" } };
  // module43.5




  const {isSignIn,name,email,photo}=user;

  const handleBlur=(event)=>{ 
    let isFieldValid=true; 
    if(event.target.name === 'email'){
            isFieldValid= /\S+@\S+\.\S+/.test(event.target.value);
    }if(event.target.name === 'password'){
        const  isPasswordValid = event.target.value.length > 6;
        const passwordHasNumber = /\d{1}/.test(event.target.value);
        isFieldValid=isPasswordValid && passwordHasNumber;
    }if(isFieldValid){
        const newUserInfo={...user}
        newUserInfo[event.target.name]=event.target.value;
        setUser(newUserInfo);
    }
    
}

  const handleSubmit=(e)=>{
  if(newUser && user.email && user.password){
    createUserWithEmailAndPassword(user.name,user.email,user.password).then(res=>{
      // setUser(res)
      // setLoggedInUser(res)
      // history.replace(from);
      handleResponse(res,true)
    })
  }

  if(!newUser && user.email && user.password){ 
    signInWithEmailAndPassword(user.email, user.password)
    .then(res=>{
      // setUser(res)
      // setLoggedInUser(res)
      // history.replace(from);
      handleResponse(res,true)
    })
  }

e.preventDefault();
}

    const GoogleSignIn=()=>{

      handleGoogleSignIn().then(res=>{
        // setUser(res)
        // setLoggedInUser(res)
        // history.replace(from);
        handleResponse(res,true)
      })

    }

    const SignOut=()=>{
      handleSignOut().then(res=>{
        // setUser(res);
        // setLoggedInUser(res)
        handleResponse(res,false)
      })
    }

    const fbSignIn=()=>{
      signInWithFb().then(res=>{
        // setUser(res)
        // setLoggedInUser(res);
        // history.replace(from);
        handleResponse(res,true)
      })
    }

    const handleResponse=(res,Redirect)=>{
      setUser(res)
      setLoggedInUser(res);
      if(Redirect){
        history.replace(from);
      }
    }

  return (
    <div className='loginDiv'>
      <h1>App components</h1>
      {isSignIn ? <button className='btn' onClick={SignOut}>Sing Out</button> : <button className='btn' onClick={GoogleSignIn}>Sing In</button>}
      <br/>
      <br/>
      <button className='btn' onClick={fbSignIn}>Sign in with facebook</button>
      <div className="create-account">
      <h1>Create Account component</h1>
            <form onSubmit={handleSubmit}>
                <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" id=""/>
                <label htmlFor="">New user sign up</label>
                <br/>
                {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Write your name" required/>}
                <br/>
                <input type="email" name="email" onBlur={handleBlur} placeholder="Write your Email" required/>
                <br/>
                <input type="password" name="password" onBlur={handleBlur} placeholder="Write your password" required/>
                <br/><br/>
                <input className='btn' type="submit" value="Submit"/>
            </form>
            <p style={{color:'red'}}>{user.error}</p>
            {user.success && <p style={{color:'green'}}> User {newUser ? 'account created' : 'logged In'} Successfully</p>}
      </div>
    </div>
  );
};

export default Login;


43.8 ================>>>>>>>>>>>>>>


import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import logo from '../../images/logo.png'
import './Header.css';


const Header=()=>{
    const [loggedInUser,setLoggedInUser]=useContext(UserContext);
    const btnStyle={
        padding:'7px',
        border:'none',
        outline:'none',
        backgroundColor:'tomato',
        color:"white"
    }
    return(
        <div className='header'>
            <img src={logo} alt=""/> 
            <nav>
                <Link to="/shop">Shop</Link>
                <Link to="/review">Order Review</Link>
                <Link to="/inventory">Manage Inventory here</Link>
                <button onClick={()=>setLoggedInUser({})} 
                style={btnStyle}>Sign out</button>
            </nav>
        </div>
    )
}

export default Header;


43.9======================>>>> shipment.js



import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "../../App";
import './Shipment.css'

export default function App() {
  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = data => console.log(data);
    const [loggedInUser,setLoggedInUser]=useContext(UserContext)

  return (
    <form className="ship-form" onSubmit={handleSubmit(onSubmit)}>   

      <input placeholder="Enter your name here...."  defaultValue={loggedInUser.name} name="name" ref={register({ required: true })} />
      {errors.name && <span className="error">Name is required</span>}

      <input placeholder="Enter your Email here...." name="email" defaultValue={loggedInUser.email} ref={register({ required: true })} />
      {errors.email && <span className="error">Email is required</span>}

      <input placeholder="Enter your Phone number here...." name="phone" ref={register({ required: true })} />
      {errors.phone && <span className="error">Phone is required</span>}

      <input placeholder="Enter your address here...." name="address" ref={register({ required: true })} />
      {errors.address && <span className="error">Address is required</span>}

      <input placeholder="Enter your zipCode here...." name="zipCode" ref={register({ required: true })} />
      {errors.zipCode && <span className="error">ZipCode is required</span>}
      
      <input type="submit" />
    </form>
  );
}



