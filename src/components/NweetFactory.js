import { dbService, storageService } from 'fbase';
import { React, useState, useRef }  from 'react';
import { v4 as uuidv4 } from 'uuid';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from '@firebase/storage';

// Nweets 생성 담당
const NweetFactory = ({userObj}) => {
    const [nweet, setNweet] = useState(""); // form을 위한 state
    const [attachment, setAttachment] = useState("");
    
    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if (attachment !== "") {
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(response.ref);
        }
        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        }
        await addDoc(collection(dbService, "nweets"), nweetObj);
        //add data
        // await addDoc(collection(dbService, "nweets"), { //collection에 데이터 지정
        //     text: nweet,
        //     createdAt: Date.now(),
        //     creatorId: userObj.uid
        // });
        setNweet("");
        
    };

    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNweet(value);
    };
    const onFileChange = (event) => {
        console.log(event.target.files);
        const {
            target: { files }, //ES6, event > target으로 가서 파일을 받아옴
        } = event;
        const theFile = files[0]; // 첫번째 파일
        const reader = new FileReader(); //reader만듦
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile); //readAsDataURL > 파일 읽기
    };
    const fileInput = useRef();
    const onClearAttachment = () => {
        setAttachment(null);
        fileInput.current.value = null;
    };

    return(
        <form onSubmit={onSubmit}>
            <input value={nweet} onChange={onChange} type="text" placeholder="what's on your mind?" maxLength={120} />

            <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput} />
            <input type="submit" value="Nweet" />
            {attachment && (
                <div>
                    <img src={attachment} alt="preview" width="50px" height="50px" />
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
            )}
        </form>
    )
};
export default NweetFactory; 