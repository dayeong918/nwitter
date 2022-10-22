import React, { useEffect, useState } from 'react';
import { authService, dbService } from '../fbase';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { updateProfile } from "@firebase/auth";


//1. 로그인 한 유저정보 prop으로 받기
const Profile = ({refreshUser, userObj}) => { 
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const navigate = useNavigate();
    const onLogOutClick = () => {
        authService.signOut();
        authService.updateCurrentUser();
        navigate("/");
    };
    //2. 내 nweets 얻는 function 생성
    const getMyNweets = async () => {
        const q = query(
        collection(dbService, "nweets"),
        where("creatorId", "==", `${userObj.uid}`)
        )
        orderBy("createdAt", "desc")
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        console.log((doc.id, " => ", doc.data()));
        });
    };
    useEffect(()=> {
        getMyNweets();
    });

    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewDisplayName(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, { displayName: newDisplayName });
            // refreshUser();
        }; 
        refreshUser();
    };
    
    return (
        <>
            <form onSubmit = {onSubmit}> 
                <input
                    onChange={onChange}
                    type="text" 
                    placeholer="Display name" 
                    value={newDisplayName}
                /> 
                <input type="submit" value="Update Profile" />
            </form>  
            <button onClick={onLogOutClick}>Log out</button>
        </>
    );
};

export default Profile;