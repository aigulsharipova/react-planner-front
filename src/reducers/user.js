const initial = {
    logged: false,
    user_id: localStorage.getItem('user_id') ? localStorage.getItem('user_id') : 0,
    user_email: '',
    user_login: localStorage.getItem('user_login') ? localStorage.getItem('user_login') : 0,
};


export default function (state=initial, action) {
    switch (action.type)
    {
        case 'CHANGE_USER_STATUS':
            return {
                ...state,
                logged: action.payload
            };
        case 'CHANGE_USER_EMAIL':
            return {
                ...state,
                user_email: action.payload
            };
        case 'CHANGE_USER_LOGIN':
            return {
                ...state,
                user_login: action.payload
            };
        case 'CHANGE_USER_ID':
            return {
                ...state,
                user_id: action.payload
            };
        default:
            return state;
    }
}