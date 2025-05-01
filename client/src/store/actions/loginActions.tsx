// Actions related to login
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const saveLogin = (content: any) => ({
    type: LOGIN,
    payload: {
        token: content.token,
        isAdmin: content.isAdmin,
        email: content.email
    }
});

export const logoutUser = () => ({
    type: LOGOUT
});
