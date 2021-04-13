const initial = {
    url: 'http://localhost:3001/api',
    login_page: 'login'
};


export default function (state=initial, action) {
    switch (action.type)
    {
        case 'CHANGE_LOGIN_PAGE':
            return {
                ...state,
                login_page: action.payload
            };
        default:
            return state;
    }
}