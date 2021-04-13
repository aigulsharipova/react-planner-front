const initial = {
    data: [],
    statuses: [],
    page_mode: 'show',
    updated_info: false,
    choosed_task: {}
};


export default function (state=initial, action) {
    switch (action.type)
    {
        case 'SET_STATUSES':
            return {
                ...state,
                statuses: action.payload
            };
        case 'SET_CHOOSED_ITEM':
            return {
                ...state,
                choosed_task: action.payload
            };
        case 'UPDATE_INFO':
            return {
                ...state,
                updated_info: action.payload
            };
        case 'SET_PAGE_MODE':
            return {
                ...state,
                page_mode: action.payload
            };
        case 'SET_ALL_TASKS':
            return {
                ...state,
                data: action.payload
            }
        default:
            return state;
    }
}