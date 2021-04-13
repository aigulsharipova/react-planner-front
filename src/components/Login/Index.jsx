import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { EffectFlip } from 'swiper';
import Login from './Login';
import Register from './Register';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import axios from 'axios';

SwiperCore.use([EffectFlip]);

export default () => {
    const state_common = useSelector(state => state.common);
    const state_user = useSelector(state => state.user);
    const [slider, setSwiper] = useState(null);
    const dispatch = useDispatch();

    useEffect(()=>{
        if (localStorage.getItem('token'))
        {
            axios.post(`${state_common.url}/users`, {
                action: 'verify',
                token: localStorage.getItem('token')
            })
            .then(function (response) {
                if (response.data && response.data.info && response.data.info.username)
                {
                    dispatch({
                        type: 'CHANGE_USER_STATUS',
                        payload: true
                    });
                }
                else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user_id');
                    localStorage.removeItem('user_login');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }, []);

    useEffect(()=>{
        if (state_common.login_page === 'login' && slider)
        {
            slider.slideTo(1);
        }
        else if (state_common.login_page === 'reg' && slider) {
            slider.slideTo(2);
        }
    }, [state_common.login_page]);

    return (
        <>
            {state_user.logged && <Redirect to="/tasks"></Redirect>}
            <section className="section-index">
                <div className="container">
                    <Swiper
                        effect="flip"
                        autoHeight={true}
                        loop={true}
                        allowTouchMove={false}
                        onSwiper={setSwiper} controller={{ control: slider }}
                    >
                        <SwiperSlide>
                            <Login></Login>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Register></Register>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </section>

            <ToastContainer position="top-right" />
        </>
    );
}