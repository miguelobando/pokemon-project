import { createContext, useState } from 'react';
import { UserData } from '../interfaces/userInfo';

const Context = createContext({});

interface Props {
    children: React.ReactNode;
}

export function UserContextProvider({ children }:Props) {
  const [user, setUser] = useState<UserData | null>(null);
  
  // useEffect(() => {
  //   const userCookie = getUserCookie();
  //   if (userCookie) {
  //     setUser(JSON.parse(userCookie));
  //   }
  // }, []);

  return( 
    <Context.Provider value={{user, setUser}}>
      {children}
    </Context.Provider>
  );
}

export default Context;