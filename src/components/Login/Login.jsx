import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';

const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export default () => {
    const dispatch = useDispatch();
    const commonState = useSelector(state => state.common);

    const [status, setStatus] = useState(false);

    const log_email = useRef(null);
    const log_pass = useRef(null);

    const tryUserLog = () => {
        setStatus(true);
        let res_toats = [];
        if (!log_email.current.value || !log_email.current.value.trim())
        {
            res_toats.push({
                msg: 'Email field is empty'
            });
        }
        else if (!validateEmail(log_email.current.value.trim())) {
            res_toats.push({
                msg: 'Email is not correct'
            });
        }

        if (!log_pass.current.value || !log_pass.current.value.trim())
        {
            res_toats.push({
                msg: 'Password field is empty'
            });
        }
        else if (log_pass.current.value.trim().length < 5)
        {
            res_toats.push({
                msg: 'Minimum length of password is 5'
            });
        }


        if (res_toats.length > 0)
        {
            res_toats.map(item => toast.warn(item.msg));
            setStatus(false);
            return false;
        }

        axios.post(`${commonState.url}/users`, {
            action: 'login',
            email: log_email.current.value.trim(),
            password: log_pass.current.value.trim()
        })
        .then(function (response) { 
            setStatus(false);
            
            if (response.data && response.data.token)
            {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user_id', response.data.user_id);
                localStorage.setItem('user_login', response.data.login);
                dispatch({
                    type: 'CHANGE_USER_LOGIN',
                    payload: response.data.login
                });
                dispatch({
                    type: 'CHANGE_USER_ID',
                    payload: response.data.user_id
                });
                dispatch({
                    type: 'CHANGE_USER_STATUS',
                    payload: true
                });
            }
            else if (response.data && response.data.message) {
                toast.warn(response.data.message);
            }
        })
        .catch(function (error) {
            console.log(error);
            setStatus(false);
        });
    }

    return (
        <>
            <h2 className="section-index__title">Login</h2>
            <div className="section-index__form">
                <div className="section__input-group section__input-row">
                    <p>Email:</p>
                    <div className="section__input">
                        <input type="email" ref={log_email} placeholder="Email"/>
                    </div>
                </div>
                <div className="section__input-group section__input-row">
                    <p>Password:</p>
                    <div className="section__input">
                        <input type="password" ref={log_pass} placeholder="Password"/>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <button disabled={status} className="button button_log" onClick={tryUserLog}>Submit</button>
                </div>
                <p className="section-index__choose">or</p>
                <div className="d-flex justify-content-center">
                    <button className="button button_log" onClick={()=>{
                        dispatch({
                            type: 'CHANGE_LOGIN_PAGE',
                            payload: 'reg'
                        });
                    }}>Register</button>
                </div>
            </div>
        </>
    );
}