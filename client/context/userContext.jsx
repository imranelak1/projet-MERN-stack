import axios from 'axios';
import { createContext, useState,useEffect } from 'react';






export const UserContext = createContext({});
export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    useEffect(() => {
        if (!user) {
          axios.get('/profile').then(({ data }) => {
            console.log('User data:', data);
            setUser(data);  // Ensure the user state is updated
          }).catch(err => {
            console.error('Error fetching user:', err);
          });
        }
      }, [user]); 
    const logout = () => {
        setUser(null);
        axios.post('/logout', {}, { withCredentials: true });
      };
    return (
        <UserContext.Provider value={{user,setUser,logout}}>
            {children}
        </UserContext.Provider>
    );
}