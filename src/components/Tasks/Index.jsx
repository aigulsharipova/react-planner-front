import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import Header from '../Header/Header';
import Task from './Task';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';

export default () => {
    const state_user = useSelector(state => state.user);
    const commonState = useSelector(state => state.common);
    const state_tasks = useSelector(state => state.tasks);

    const dispatch = useDispatch();

    useEffect(()=>{
        axios.get(`${commonState.url}/statuses`, {
            params: {
                action: 'get_statuses'
            }
        })
        .then(function (response) {
            dispatch({
                type: 'SET_STATUSES',
                payload: response.data.statuses
            });
        })
        .catch(function (error) {
            console.log(error);
        });

        axios.get(`${commonState.url}/tasks`, {
            params: {
                action: 'get_all',
                user_id: state_user.user_id
            }
        })
        .then(function (response) {
            dispatch({
                type: 'SET_ALL_TASKS',
                payload: response.data.tasks
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }, []);

    useEffect(()=>{
        if (state_tasks.updated_info)
        {
            axios.get(`${commonState.url}/tasks`, {
                params: {
                    action: 'get_all',
                    user_id: state_user.user_id
                }
            })
            .then(function (response) {
                dispatch({
                    type: 'SET_ALL_TASKS',
                    payload: response.data.tasks
                });
                dispatch({
                    type: 'UPDATE_INFO',
                    payload: false
                });
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }, [state_tasks.updated_info]);

    const createTask = () => {
        dispatch({
            type: 'SET_PAGE_MODE',
            payload: 'create'
        });
    }

    return (
        <>
            {
                !state_user.logged && <Redirect to="/"></Redirect>
            }
            <Header></Header>
            <section className="section-tasks mt-5">
                <div className="container">
                    <h2 className="text-center">Project Planning</h2>
                    <div className="section-tasks__row">
                        {
                            state_tasks.page_mode === 'show' && 
                            <div onClick={createTask} className="text-center section-tasks__create btn btn-outline-light w-100">Create New Task +</div>
                        }
                        {
                            state_tasks.data && state_tasks.data.length > 0 && state_tasks.page_mode === 'show' &&
                            <div className="section-tasks__group">
                                {state_tasks.data.map(item => {
                                    return (
                                        <Task key={item._id} mode={state_tasks.page_mode} title={item.title} desc={item.desc} status_choosed={item} task_id={item._id}></Task>
                                    );
                                })}
                            </div>
                        }
                        {
                            state_tasks.page_mode === 'create' &&
                            <Task mode={state_tasks.page_mode} statuses={state_tasks.statuses} ></Task>
                        }
                        {
                            state_tasks.page_mode === 'edit' &&
                            <Task mode={state_tasks.page_mode} statuses={state_tasks.statuses} ></Task>
                        }
                    </div>
                </div>
            </section>
            <ToastContainer position="top-right" />
        </>
    );
}