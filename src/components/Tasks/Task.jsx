import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default (props) => {

    const [mode, setMode] = useState(props.mode);
    const [btn_create, set_create_mode] = useState(false);
    const [btn_edit, set_edit_mode] = useState(false);
    const [btn_remove, set_remove_mode] = useState(false);
    const [priority, setPriority] = useState({
        title: '',
        id: 0
    });
    const state_tasks = useSelector(state => state.tasks);
    const state_user = useSelector(state => state.user);
    const commonState = useSelector(state => state.common);
    const task_title = useRef(null);
    const select_create = useRef(null);
    const task_desc = useRef(null);
    const dispatch = useDispatch();

    useEffect(()=>{
        if (mode === 'show' && state_tasks.statuses.length > 0 && state_tasks.data.length > 0)
        {
            state_tasks.statuses.map(item => {
                if (item._id === props.status_choosed.status_id)
                {
                    setPriority({
                        title: item.title,
                        id: item._id
                    });
                }
            });
        }
    }, [state_tasks.statuses, mode, state_tasks.data]);

    const saveEdit = () => {
        set_edit_mode(true);
        let id = state_tasks.choosed_task.id;

        let arr_notst = [];

        if (!task_title.current.value || !task_title.current.value.trim())
        {
            arr_notst.push('Title field are empty');
        }
        else if (task_title.current.value.trim().length < 3)
        {
            arr_notst.push('Minimum length ot Title field is 3');
        }

        if (!task_desc.current.value || !task_desc.current.value.trim())
        {
            arr_notst.push('Description field are empty');
        }
        else if (task_desc.current.value.trim().length < 5)
        {
            arr_notst.push('Minimum length ot Descriptions field is 5');
        }

        if (arr_notst.length > 0)
        {
            arr_notst.map(item=>{
                toast.warn(item);
            });
            set_edit_mode(false);
            return false;
        }

        axios.get(`${commonState.url}/tasks`, {
            params: {
                action: 'edit_one',
                id: id,
                title: task_title.current.value.trim(),
                desc: task_desc.current.value.trim(),
                status_id: select_create.current.value
            }
        })
        .then(function (response) {
            set_edit_mode(false);
            if (response.data && response.data.status && response.data.status === 'updated')
            {
                dispatch({
                    type: 'SET_PAGE_MODE',
                    payload: 'show'
                });
                dispatch({
                    type: 'UPDATE_INFO',
                    payload: true
                });
                toast.success('Task Updated');
            }
          })
        .catch(function (error) {
            set_create_mode(false);
            console.log(error);
        });
    }

    const cancelEdit = () => {
        dispatch({
            type: 'SET_CHOOSED_ITEM',
            payload: {
                id: 0
            }
        });
        dispatch({
            type: 'SET_PAGE_MODE',
            payload: 'show'
        });
    }

    const createTask = () => {
        set_create_mode(true);

        let arr_notst = [];

        if (!task_title.current.value || !task_title.current.value.trim())
        {
            arr_notst.push('Title field are empty');
        }
        else if (task_title.current.value.trim().length < 3)
        {
            arr_notst.push('Minimum length ot Title field is 3');
        }

        if (!task_desc.current.value || !task_desc.current.value.trim())
        {
            arr_notst.push('Description field are empty');
        }
        else if (task_desc.current.value.trim().length < 5)
        {
            arr_notst.push('Minimum length ot Descriptions field is 5');
        }

        if (arr_notst.length > 0)
        {
            arr_notst.map(item=>{
                toast.warn(item);
            });
            set_create_mode(false);
            return false;
        }

        axios.get(`${commonState.url}/tasks`, {
            params: {
                action: 'create_new',
                user_id: state_user.user_id,
                title: task_title.current.value.trim(),
                desc: task_desc.current.value.trim(),
                status_id: select_create.current.value
            }
        })
        .then(function (response) {
            set_create_mode(false);
            if (response.data && response.data.status && response.data.status === 'created')
            {
                dispatch({
                    type: 'SET_ALL_TASKS',
                    payload: response.data.tasks
                });
                dispatch({
                    type: 'SET_PAGE_MODE',
                    payload: 'show'
                });
                dispatch({
                    type: 'UPDATE_INFO',
                    payload: true
                });
                toast.success('Task Created');
            }
          })
        .catch(function (error) {
            set_create_mode(false);
            console.log(error);
        });
    }

    const backToPage = () => {
        dispatch({
            type: 'SET_PAGE_MODE',
            payload: 'show'
        });
    }

    const changeItem = (id) => {
        set_edit_mode(true);
        axios.get(`${commonState.url}/tasks`, {
            params: {
                action: 'get_one',
                id: id
            }
        })
        .then(function (response) {
            set_edit_mode(false);
            if (response.data && response.data.info)
            {
                response.data.info['id'] = response.data.info._id;
                dispatch({
                    type: 'SET_CHOOSED_ITEM',
                    payload: response.data.info
                });
                dispatch({
                    type: 'SET_PAGE_MODE',
                    payload: 'edit'
                });
            }
          })
        .catch(function (error) {
            set_edit_mode(false);
            console.log(error);
        });
    }

    const removeTask = (id) => {
        set_remove_mode(true);
        axios.get(`${commonState.url}/tasks`, {
            params: {
                action: 'remove',
                id: id
            }
        })
        .then(function (response) {
            set_remove_mode(false);
            if (response.data && response.data.status && response.data.status === 'removed')
            {
                dispatch({
                    type: 'UPDATE_INFO',
                    payload: true
                });
                toast.success('Task Removed');
            }
        })
        .catch(function (error) {
            set_remove_mode(false);
            console.log(error);
        });
    }

    return (
        <div className="section-task">
            {
                mode === 'show' &&
                <div className={`d-flex py-2 px-2 flex-row align-items-center justify-content-between bg-${priority.title === 'important' ? 'primary' : 'dark'}`}>
                    <h4 className="setion-task__title">{props.title}</h4>
                    <button disabled={btn_edit} onClick={()=>{
                        changeItem(props.task_id);
                    }} className="btn btn-success">Edit</button>
                    <button disabled={btn_remove} onClick={()=>{
                        removeTask(props.task_id);
                    }} className="btn btn-danger">Remove</button>
                </div>
            }
            {
                mode === 'edit' && 
                <>
                    <div className="section__input-group section__input-row">
                        <p>Title:</p>
                        <div className="section__input">
                            <input type="text" ref={task_title} placeholder="Title:" defaultValue={state_tasks.choosed_task.title} />
                        </div>
                    </div>
                    <div className="section__input-group section__input-row">
                        <p>Description:</p>
                        <div className="section__input">
                            <textarea cols={10} rows={5} type="text" ref={task_desc} placeholder="Description:" defaultValue={state_tasks.choosed_task.desc}></textarea>
                        </div>
                    </div>
                    <p className="mb-2">Task priority:</p>
                    <select className="custom-select section-task__select mb-3" ref={select_create}>
                        {
                            props.statuses.map(item => {
                                if (item._id === state_tasks.choosed_task.status_id)
                                {
                                    return(
                                        <option selected value={item._id} key={item._id}>{item.title}</option>
                                    );
                                    
                                }
                                return (
                                    <option value={item._id} key={item._id}>{item.title}</option>
                                );
                            })
                        }
                    </select>
                    <div className="d-flex flex-column align-items-center justify-content-center">
                        <button disabled={btn_edit} onClick={()=>{
                            saveEdit();
                        }} className="button button_log mb-3">Save Edit</button>
                        <button onClick={()=>{
                            cancelEdit();
                        }} className="button button_log">Cancel</button>
                    </div>
                </>
            }
            {
                mode === 'create' && 
                <>
                    <div className="section__input-group section__input-row">
                        <p>Title:</p>
                        <div className="section__input">
                            <input type="text" ref={task_title} placeholder="Title:" />
                        </div>
                    </div>
                    <div className="section__input-group section__input-row">
                        <p>Description:</p>
                        <div className="section__input">
                            <textarea cols={10} rows={5} ref={task_desc} placeholder="Description:"></textarea>
                        </div>
                    </div>
                    <p className="mb-2">Task priority:</p>
                    <select ref={select_create} className="custom-select section-task__select mb-3">
                        {
                            props.statuses.map(item => {
                                return (
                                    <option value={item._id} key={item._id}>{item.title}</option>
                                );
                            })
                        }
                    </select>
                    <div className="d-flex flex-column align-items-center justify-content-center">
                        <button disabled={btn_create} onClick={()=>{
                            createTask();
                        }} className="button button_log mb-3">Create</button>
                        <button onClick={()=>{
                            backToPage();
                        }} className="button button_log">Back</button>
                    </div>
                </>
            }
        </div>
    );
}