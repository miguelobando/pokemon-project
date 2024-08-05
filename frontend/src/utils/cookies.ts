import Cookies from "universal-cookie";

const cookies = new Cookies(null, {
    path: '/',
});

export const userCookiee = cookies.get('user');
export const setUserCookie = (user: string) => {
    cookies.set('user', user);
};