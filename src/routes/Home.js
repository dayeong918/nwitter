import { dbService, storageService } from 'fbase';
import React, {useEffect, useState, useRef} from 'react';
import { v4 as uuidv4 } from 'uuid';
import {collection, addDoc, onSnapshot, query, orderBy} from 'firebase/firestore';
import Nweet from 'components/Nweet';
import { ref, uploadString, getDownloadURL } from '@firebase/storage';

const Home = ({userObj}) => { //Props:userObj > Router.js에서 받음
    const [nweet, setNweet] = useState(""); // form을 위한 state
    const [nweets, setNweets] = useState([]); 
    const [attachment, setAttachment] = useState("");

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

    const onSubmit = async (event) => { 
        event.preventDefault();
        let attachmentUrl = "";
        if (attachment !== ""){
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(response.ref);
        } 
        const nweetObj = {
            text: nweet,
            createdAt:Date.now(),
            creatorId:userObj.uid,
            attachmentUrl
        }
        await addDoc(collection(dbService, "nweets"), nweetObj);
        // add data
        // await addDoc(collection(dbService,"nweets"),{ //collection에 데이터 지정
        //     text :nweet,å
        //     createdAt:Date.now(),
        //     creatorId:userObj.uid
        // }); 
        //  setNweet(""); 
    };

    const onChange = (event)=> {
        const { 
            target:{ value },
        } = event;
        setNweet(value);
    };
    const onFileChange = (event) => {
        console.log(event.target.files);
        const {
            target:{files}, //ES6, event > target으로 가서 파일을 받아옴
        } = event;
        const theFile = files[0]; // 첫번째 파일
        const reader = new FileReader(); //reader만듦
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget:{result},
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile); //readAsDataURL > 파일 읽기
    };
    const fileInput = useRef();
    const onClearAttachment = () => {
        setAttachment(null);
        fileInput.current.value=null;
    };
    
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="what's on your mind?" maxLength={120} />
                
                <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput} />
                <input type="submit" value="Nweet" />
                {attachment && (
                <div>
                    <img src={attachment} alt="preview" width="50px" height="50px"/>
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
                )}
            </form>
        <div> 
            {nweets.map((nweet) => ( //배열을 map하고 Nweet Component생성(nweetObj, isOwner)
                <Nweet key = {nweet.id} nweetObj = {nweet} isOwner={nweet.creatorId === userObj.uid}/> // nweetObj:nweet의 모든 데이터[author, text,createdAt], isOwner:true(nweet을 만든 사람과 userObj.uid와 같을 때) or false
            ))} 
        </div>
    </div>
    );
};

export default Home;