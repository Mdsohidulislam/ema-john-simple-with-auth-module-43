
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