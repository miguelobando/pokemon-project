import { removeUserCookie } from "../utils/cookies";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { useContext } from "react";
import { UserDataContext } from "../interfaces/userInfo";
import UserContext from "../context/users";

export const DashboardPage = () => {
    const navigate = useNavigate();
    const {  setUser } = useContext(UserContext) as UserDataContext;
        const logoutUser = () => {
            removeUserCookie();
            setUser(null);
            navigate('/', { replace: true });
        
        };
    

    return (
        <div>
            <Button onClick={() => logoutUser()}>Logout</Button>
         
        </div>
    )
}