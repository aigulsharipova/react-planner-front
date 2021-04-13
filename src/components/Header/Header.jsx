import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default () => {

    const dispatch = useDispatch();

    const user_state = useSelector(state => state.user);

    const userLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_login');
        dispatch({
            type: 'CHANGE_USER_STATUS',
            logged: false
        });
    }

    return (
        <header className="section-header">
            <div className="container d-flex flex-row justify-content-end align-items-center">
                <div className="d-flex flex-column align-items-center">
                    <p className="section-header__login">Hi, {user_state.user_login}</p>
                    <button onClick={userLogOut} className="button button_log">Logout</button>
                </div>
            </div>
        </header>
    );
}