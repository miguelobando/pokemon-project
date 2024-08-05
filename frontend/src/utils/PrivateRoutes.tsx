import { useNavigate, Outlet, Navigate } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import { removeUserCookie } from "./cookies";
import { UserDataContext } from "../interfaces/userInfo";
import UserContext from '../context/users';
import { DashboardLayout } from "../layouts/DashboardLayout";

const PrivateRoutes = () => {
    const { user, setUser } = useContext(UserContext) as UserDataContext;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const logoutTimerIdRef = useRef<any>(null);
    const navigate = useNavigate();

    const isUserLoggedIn = () => {
        
        return (user && user.email !== '');
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