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
    }).catch(error=>{ 
    })
  }

  if(!newUser && user.email && user.password){ 
    signInWithEmailAndPassword(user.email, user.password)
    .then(res=>{
      // setUser(res)
      // setLoggedInUser(res)
      // history.replace(from);
      handleResponse(res,true)
    }).catch(error=>{ 
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
      }).catch(error=>{ 
      })

    }

    const SignOut=()=>{
      handleSignOut().then(res=>{
        // setUser(res);
        // setLoggedInUser(res)
        handleResponse(res,false)
      }).then(error=>{ 
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