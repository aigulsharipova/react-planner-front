import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export default () => {
    const commonState = useSelector(state => state.common);
    const dispatch = useDispatch();

    const [status, setStatus] = useState(false);

    const reg_login = useRef(null);
    const reg_pass = useRef(null);
    const reg_email = useRef(null);

    const tryUserRegister = () => {
        setStatus(true);

        let res_toats = [];
        if (!reg_email.current.value || !reg_email.current.value.trim())
        {
            res_toats.push({
                msg: 'Email field is empty'
            });
        }
        else if (!validateEmail(reg_email.current.value.trim())) {
            res_toats.push({
                msg: 'Email is not correct'
            });
        }

        if (!reg_pass.current.value || !reg_pass.current.value.trim())
        {
            res_toats.push({
                msg: 'Password field is empty'
            });
        }
        else if (reg_pass.current.value.trim().length < 5)
        {
            res_toats.push({
                msg: 'Minimum length of password is 5'
            });
        }

        if (!reg_login.current.value && !reg_login.current.value.trim())
        {
            res_toats.push({
                msg: 'Login field is empty'
            });
        }
        else if (reg_login.current.value.trim().length < 3)
        {
            res_toats.push({
                msg: 'Minimum length of login is 3'
            });
        }

        if (res_toats.length > 0)
        {
            res_toats.map(item => toast.warn(item.msg));
            setStatus(false);
            return false;
        }

        axios.post(`${commonState.url}/users`, {
            action: 'reg_user',
            login: reg_login.current.value.trim(),
            email: reg_email.current.value.trim(),
            password: reg_pass.current.value.trim()
        })
        .then(function (response) {
            setStatus(false);
            if (response.data && response.data.token)
            {
                // localStorage.setItem('token', response.data.token);
                dispatch({
                    type: 'CHANGE_LOGIN_PAGE',
                    payload: 'login'
                });
                toast.success('User created');
            }
            else if (response.data && response.data.message)
            {
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
            <h2 className="section-index__title">Register</h2>
            <div className="section-index__form">
                <div className="section__input-group section__input-row">
                    <p>Login:</p>
                    <div className="section__input">
                        <input type="text" ref={reg_login} placeholder="Login:"/>
                    </div>
                </div>
                <div className="section__input-group section__input-row">
                    <p>Email:</p>
                    <div className="section__input">
                        <input type="email" ref={reg_email} placeholder="Email:"/>
                    </div>
                </div>
                <div className="section__input-group section__input-row">
                    <p>Password:</p>
                    <div className="section__input">
                        <input type="password" ref={reg_pass} placeholder="Password:"/>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <button disabled={status} className="button button_log" onClick={tryUserRegister}>Register</button>
                </div>
                <p className="section-index__choose">or</p>
                <div className="d-flex justify-content-center">
                    <button className="button button_log" onClick={()=>{
                        dispatch({
                            type: 'CHANGE_LOGIN_PAGE',
                            payload: 'login'
                        });
                    }}>Login</button>
                </div>
            </div>
        </>
    );
}