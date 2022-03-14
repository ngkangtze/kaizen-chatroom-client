import React, { state, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { useChatContext } from "stream-chat-react";
import Cookies from 'universal-cookie';
import axios from 'axios';

import signinImage from '../assets/kaizen-background.png';

const cookies = new Cookies();

const initialState = {
    displayName: '',
    username: '',
    password: '',
    image: '',
}

const Auth = () => {
    const { client } = useChatContext();
    const [form, setForm] = useState(initialState);
    const [ isSignup, setIsSignup ] = useState(true);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password } = form;

        // const URL = 'http://localhost:3000/auth';
        const URL = 'https://kaizen-chatroom.herokuapp.com/auth';

        const { data: { token, userId, hashedPassword, displayName, image } } = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
            username, password, displayName: form.displayName,
        });

        cookies.set('token', token);
        cookies.set('username', username);
        cookies.set('displayName', displayName);
        cookies.set('userId', userId);
        cookies.set('image', image);

        if(isSignup) {
            cookies.set('hashedPassword', hashedPassword);
        }

        window.location.reload();
    }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
    }

    return (
        <div className="auth__form-container">
            <div className="auth__form-container_fields">
                <div className="auth__form-container_fields-content">
                    <p>{isSignup ? 'Sign Up' : 'Sign In'}</p>
                    <form onSubmit={handleSubmit}>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="displayName">Display Name</label>
                                <input 
                                    name="displayName" 
                                    type="text"
                                    placeholder="Display Name"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="username">Username</label>
                                <input 
                                    name="username" 
                                    type="text"
                                    placeholder="Username"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        <div className="auth__form-container_fields-content_input">
                                <label htmlFor="password">Password</label>
                                <input 
                                    name="password" 
                                    type="password"
                                    placeholder="Password"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        <div className="auth__form-container_fields-content_button">
                            <button>{isSignup ? "Sign Up" : "Sign In"}</button>
                        </div>
                    </form>
                    <div className="auth__form-container_fields-account">
                        <p>
                            {isSignup
                             ? "Already have an account? " 
                             : "Don't have an account? "
                             }
                             <span onClick={switchMode}>
                             {isSignup ? 'Sign In' : 'Sign Up'}
                             </span>
                        </p>
                    </div>
                </div> 
            </div>
            <div className="auth__form-container_image">
                <img src={signinImage} alt="sign in" />
            </div>
        </div>
    )
}

export default Auth