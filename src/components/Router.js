import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import Profile from '../routes/Profile.js';
import Navigation from './Navigation';

const AppRouter = ({refreshUser, isLoggedIn, userObj}) => { 
   return(
    <BrowserRouter> 
        {isLoggedIn && <Navigation userObj = {userObj}/>} 
        <Routes>
            {isLoggedIn ? (
             <>
                <Route exact path="/" element={<Home userObj={userObj}/>}/> 
                       <Route exact path="/profile" element={<Profile userObj={userObj} refreshUser={refreshUser} />}/>       
            </> 
        ) : ( 
            <Route exact path="/Auth" element={<Auth/>}/>
            )}
        </Routes>
    </BrowserRouter>
   );
};

export default AppRouter;