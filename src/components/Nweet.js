import React, { useState } from 'react';
import { dbService, storageService } from 'fbase';
import {doc, deleteDoc, updateDoc} from "firebase/firestore";
import {deleteObject, ref} from "@firebase/storage";


const Nweet = ({ nweetObj, isOwner }) => {

    const [editing, setEditing] = useState(false);  //Editing(편집)모드인지 여부확인(T/F)
    const [newNweet, setNewNweet] = useState(nweetObj.text); //input에 입력된 text값 수정할 수 있음
    
    const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`); //리터럴
    const urlRef = ref(storageService, nweetObj.attachmentUrl);

    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(NweetTextRef, { //update Tweet
        text: newNweet,
});
        console.log(nweetObj, newNweet); 
    }

    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewNweet(value);
    }

    const onDeleteClick = async () => {
        const ok = window.confirm('Are you sure you want to delete this nweet?'); //user 확인
        if (ok) {
            //delete Tweet
            try{
                //해당하는 트윗 파이어스토어에서 삭제
                await deleteDoc(NweetTextRef);
            
            //삭제하려는 트윗에 이미지 파일이 있는 경우 이미지 파일 스토리지에서 삭제
            if(nweetObj.attachmentUrl != ""){
                await deleteObject(urlRef);
            }
        } catch(error){
            window.alert("트윗 삭제 실패")
        }
    }
    };
    const toggleEditing = () => setEditing((prev) => !prev);


    return(
        <div>
            {editing ? ( //수정 시에 아래의 form을 보여줌
                <>
                    {isOwner && ( //Tweet한 해당 사람만 수정가능
                        <>
                            <form onSubmit={onSubmit}>
                                <input 
                                    type="text" 
                                    placeholder="Edit your tweet" 
                                    value={newNweet} 
                                    required
                                    onChange={onChange}
                                    />
                                <input type="submit" value="Update Nweet" /> 
                            </form> 
                                <button onClick={toggleEditing}>Cancel</button>
                        </>)
                    }
                </>
                ) : (
                <>
                    <h4>{nweetObj.text}</h4>
                    {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} alt="preview" width="50px" heigh="50px"/>}
                    {isOwner && (
                    <>
                        <button onClick={onDeleteClick}>Delete Nweet</button>
                        <button onClick={toggleEditing}>Edit Nweet</button>
                    </>
                )}
                </>
                )
            }
        </div>
)};

export default Nweet;