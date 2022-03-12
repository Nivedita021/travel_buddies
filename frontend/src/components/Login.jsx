import React from 'react';
import "./login.css";
import { Room } from '@material-ui/icons';
import {SentimentVerySatisfied, SentimentVeryDissatisfied, Cancel} from '@material-ui/icons';
import { useState } from 'react';
import { useRef } from 'react';
  
import axios from 'axios';
export default function Login({setShowLogin, myStorage, setCurrentUser}){
    const [error, setError]=useState(false);
    const nameRef=useRef();
    const passwordRef=useRef();

    const handleSubmit= async (e) =>{
        e.preventDefault();
        const user={
            username:nameRef.current.value,
            
            password:passwordRef.current.value,
        };
        try{
 const res= await axios.post("/users/login",user);
 setCurrentUser(res.data.username);
myStorage.setItem("user",res.data.username);
setShowLogin(false);
setError(false);

        }catch(err){
            
            setError(true);
        }
    }
    return (
        <div className='loginContainer'>
<div className='logolog'>
    <Room/>Let'sPin
    </div>
    <form onSubmit={handleSubmit}>
        <input type="text" placeholder='username' ref={nameRef}/>
       
        <input type="password" placeholder='password' ref={passwordRef}/>
        <button className='loginButton'>Login</button>

    {error && (
        <span className='failure'><SentimentVeryDissatisfied/>Oops! Something went wrong.</span>
    )}
        </form>
<Cancel className='cancellogin' onClick={() => setShowLogin(false)}/>
        </div>
    )
}