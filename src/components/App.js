import React,{ useEffect, useState } from 'react';
import AppRouter from './Router';
import {authService} from '../fbase';
import { updateProfile, updateCurrentUser } from 'firebase/auth';

const App = () => { // state : init, isLoggedIn, userObj
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null); 

  useEffect(()=>{                                                              
    authService.onAuthStateChanged((user)=> { //onAuthStateChanged : 로그인, 로그아웃, 앱 초기화 시 실행됨
        if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
        setUserObj ({
          displayName:user.displayName,
          uid: user.uid,
          updateProfile:(args)=> user.updateProfile(args),
        }); 
      } else {
        setIsLoggedIn(false);
      }
      setInit(true); //애플리케이션이 시작하고 준비되면 실행
    });
  }, []);

  const refreshUser = () => {
    console.log(authService.currentUser);
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    }); 
  };

    return (
      <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={isLoggedIn } 
          userObj={userObj}/>
        ):(
          "Initializing..."
          )}
      <footer>&copy; Nwitter {new Date().getFullYear()} Nwitter</footer>
      </>
    );
  };

export default App;