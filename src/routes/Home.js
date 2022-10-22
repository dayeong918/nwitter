import { dbService } from 'fbase';
import React, {useEffect, useState, useRef} from 'react';
import {collection, onSnapshot, query, orderBy} from 'firebase/firestore';
import Nweet from 'components/Nweet';
import NweetFactory from 'components/NweetFactory';

const Home = ({userObj}) => { //Props:userObj > Router.js에서 받음
    const [nweets, setNweets] = useState([]); 

    useEffect(()=> {
        const querySnapshot = query(collection(dbService,"nweets"), orderBy("createdAt","desc"));
        onSnapshot(querySnapshot,(snapshot) => { //listner로 snapshot 사용(데이터베이스에 이슈가 생기면 snapshot실행, 알림 받음):삭제, 업데이트 등
            const nweetArr = snapshot.docs.map((doc)=> ({
                id:doc.id, //배열 내 아이템(document id/data)
                ...doc.data(), 
            })); //새로운 snapshot을 받을 때 배열 생성함
            setNweets(nweetArr); //state에 배열 넣음
        });
    },[]);
    
    return(
        <div>
            <NweetFactory userObj={userObj}/>
        <div> 
            {nweets.map((nweet) => ( //배열을 map하고 Nweet Component생성(nweetObj, isOwner)
                <Nweet key = {nweet.id} nweetObj = {nweet} isOwner={nweet.creatorId === userObj.uid}/> // nweetObj:nweet의 모든 데이터[author, text,createdAt], isOwner:true(nweet을 만든 사람과 userObj.uid와 같을 때) or false
            ))} 
        </div>
    </div>
    );
};

export default Home;