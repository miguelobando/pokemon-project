import { useNavigate, Outlet, Navigate } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import { removeUserCookie, getUserCookie } from "./cookies";
import { UserData, UserDataContext } from "../interfaces/userInfo";
import UserContext from '../context/users';
import { DashboardLayout } from "../layouts/DashboardLayout";

const PrivateRoutes = () => {
    const { user, setUser } = useContext(UserContext) as UserDataContext;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const logoutTimerIdRef = useRef<any>(null);
    const navigate = useNavigate();

    const isUserLoggedIn = () => {
        let parsedUser: UserData | null = null;
        const cookieUser = getUserCookie();
        if (cookieUser) {
            try {
                parsedUser = JSON.parse(cookieUser) as UserData;
                if (parsedUser && parsedUser.email) {
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error("Error parsing user cookie:", error);
            }
        }

        return (user && user.email !== '') || (parsedUser && parsedUser.email !== '');
    };

    const logoutUser = () => {
        removeUserCookie();
        setUser(null);
        navigate('/', { replace: true });
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                const timeoutId = window.setTimeout(logoutUser, 20 * 60 * 1000);
                logoutTimerIdRef.current = timeoutId;
            } else {
                window.clearTimeout(logoutTimerIdRef.current);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.clearTimeout(logoutTimerIdRef.current); // Clear timeout on cleanup
        };
    }, []);

    return isUserLoggedIn() ?
    <DashboardLayout>
    <Outlet /> 
    </DashboardLayout>
    : <Navigate to="/" />;
    
};

export default PrivateRoutes;