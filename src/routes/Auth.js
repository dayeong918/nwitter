import React,{useState} from 'react';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup} from 'firebase/auth';
import { authService } from '../fbase';
import { async } from '@firebase/util';

//function components
const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (event) => {
        const {
            target:{name, value}
        } = event;
        if(name === "email"){
            setEmail(value); 
        }
        else if(name === "password"){
            setPassword(value);
        }
    }
    const onSubmit = async(event) => {
        event.preventDefault(); //form안에 submit버튼 눌렀을 때 새로 실행하지 않도록 함(제어)
        const auth = getAuth();
        try{
            let data;
            if(newAccount) {
                data = await createUserWithEmailAndPassword(auth,email,password)
            }
            else {
                data = await signInWithEmailAndPassword(auth,email, password)
            }
            console.log(data);
        }
        catch (error){
            setError(error.message);
        }
    };
    const toggleAccount = () => setNewAccount(prev => !prev);
    const onSocialClick = async (event) => {
        const auth = getAuth();
        const {
            target:{name}, 
        } = event;

        let provider;
        if (name === "google"){
            provider = new GoogleAuthProvider();
        } else if(name === "github"){
            provider = new GithubAuthProvider();
        }
        const data = await signInWithPopup(auth, provider);
        console.log(data);
    };
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input name="email" type="email" placeholder="Email" required value={email} onChange={onChange}/>
                <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange}/>
                <input type="submit" value={newAccount ? "Create Account":"Log In"} />
                {error}
            </form>
                <span onClick={toggleAccount}>{newAccount ? "Sign in":"Create Account"}</span>
                <div>
                    <button onClick={onSocialClick} name="google">Continue  with Google</button>
                    <button onClick={onSocialClick} name="github">Continue with Github</button>
                </div>
        </div>
        );
    };
export default Auth;
