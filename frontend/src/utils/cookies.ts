import Cookies from "universal-cookie";

const cookies = new Cookies(null, {
    path: '/',
});

export const userCookiee = cookies.get('user');
export const setUserCookie = (user: string) => {
    const SECONDS_IN_A_MINUTE = 60;
    const MINUTES_IN_AN_HOUR = 60;
    const NUMBER_OF_HOURS = 6;
    const MAX_AGE_IN_SECONDS = SECONDS_IN_A_MINUTE * MINUTES_IN_AN_HOUR * NUMBER_OF_HOURS;

    
    cookies.set('user', user, { path: '/', maxAge: MAX_AGE_IN_SECONDS });
};
export const removeUserCookie = () => {
    cookies.remove('user');
};

export const getUserCookie = () => {
    return cookies.get('user');
}