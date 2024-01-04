import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../functions/SupabaseClient'; 
import { validEmail, validUsername } from "../functions/isEmail";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  const login = async (usr, password) => {
    try {
      let email = "";
      if (validEmail(usr)) {
        email = usr;
      } 
      else if (validUsername(usr)) {
        const {data,error} = (await supabase.from("public_users").select("email").eq("username", usr));
        if (error) {
          throw new Error("Database error: " + error.message);
        }
        
        if (data && data.length === 1) {
          email = data[0].email;
        } else {
          throw new Error('User does not exist');
        }
      } else {
        throw new Error("User is badly formatted.");
      }
      const res = 
        await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
  
      if (res.error) {
        throw new Error("Database error: "+ error.message)
      } 
      else {
        console.log("user:", res.data.user, "session:", res.data.session)
        setUser(res.data.user);
        setSession(res.data.session);
      }
      console.log(user);
      console.log(session);
    }
    catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout error:', error.message);
      } else {
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  useEffect(() => {
    console.log("Effect triggered with user:", user, "session:", session);

  }, [user, session]);

  return (
    <AuthContext.Provider value={{ user, session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
