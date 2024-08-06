import { removeUserCookie } from "../utils/cookies";
import { useNavigate } from "react-router-dom";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { UserDataContext } from "../interfaces/userInfo";
import UserContext from "../context/users";

export const DashboardPage = () => {
    const navigate = useNavigate();
    const {  user , setUser } = useContext(UserContext) as UserDataContext;
        const logoutUser = () => {
            removeUserCookie();
            setUser(null);
            navigate('/', { replace: true });
        
        };
    
    if (!user) {
        return <Text>You are not logged in</Text>;
    }


    return (
        <Flex direction="column" alignItems="center" justifyContent="center">
            <Button onClick={() => logoutUser()}>Logout</Button>
            <Text fontSize="2xl" textAlign="center">
                Logged in as {user?.name}
            </Text>
        </Flex>
    )
}