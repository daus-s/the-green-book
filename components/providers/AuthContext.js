import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../functions/SupabaseClient'; 
import { validEmail, validUsername } from "../../functions/isEmail";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [meta, setMeta] = useState({});

  const getSession = async () => {
    return await supabase.auth.getSession();
  };
   
  async function checkPassword(email, password) {
    try {
      const { error } = await supabase.auth.api.signInWithEmailAndPassword(email, password);
      if (error) {
        throw error;
      } else {
        return true; 
      }
    } catch (error) {
      return false;
    }
  }

  useEffect(()=>{
    const getCommissionerStatus = async () => {
      const id = (await getSession()).data?.session.user.id;
      const { data, error } = await supabase.from('commissioners').select('commissionerID').eq('userID', id);
      let val = 0;
      if (data && data.length > 0) {
        val = data[0]?.commissionerID || 0;
      }
  
      setMeta((prevMeta) => ({
        ...prevMeta,
        commish: val,
      }));
      
    }

    const getPublicData = async () => {
      try {
        const email = (await getSession()).data?.session.user.email;

        const { data, error } = await supabase
          .from("public_users")
          .select('*')
          .eq('email', email)
          .limit(1)
          .single();
  
        if (data) {
          setMeta((prevMeta) => ({
            ...prevMeta,
            pfp: data.pfp_url,
            publicID: data.id,
            username: data.username
          }));
        } 
        else {
          setMeta((prevMeta) => ({
            ...prevMeta,
            pfp: 'user.png',
          }));
        }
      } catch (error) {
        // Handle error
        console.error('Error fetching profile picture:', error);
      }
    }
    if (user&&session) {
      getCommissionerStatus();
      getPublicData();
    }
  },[user,session]);

  useEffect(() => {
    const checkUserAuthentication = async () => {
      let auth = true;
      try {
        const {data, error} = await getSession();
        
        if (data.session) {
          var ts = Math.round((new Date()).getTime() / 1000);
          if (data.session.expires_at>ts) { 
            sessionStorage.setItem("logged-in", true);
            setSession(data.session);
            if (data.session.user) {
              setUser(data.session.user);
            } else {
              setUser();
              auth = false;
            }
          } else {
            setSession(null);
            setUser(null);
            auth = false;
          } 
        } 
        else {
          setUser(null);
          setSession(null);
          auth = false;
        }     
      } catch (error) {
        //console.error('Error fetching session:', error.message);
        auth = false;
      }
      sessionStorage.setItem('logged-in', auth);
      return auth;
    };

    checkUserAuthentication();
  }, []);



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
        setUser(res.data.user);
        setSession(res.data.session);
        sessionStorage.setItem('logged-in', true);
        let b = sessionStorage.getItem('breadcrumb');
        sessionStorage.removeItem('breadcrumb');
        if (b) 
          return b;
        else 
          return null;
      }
    }
    catch (error) {
      throw error;
    }
  };

  const logout = async () => {  
    const { error } = await supabase.auth.signOut();
  
    if (error) {
      console.error('Logout error:', error.message);
    } else {
      window.location.replace("/");
      sessionStorage.setItem('logged-in', false);
    }
  };
  
  const admin = async () => {
    if (user) {
      const {data, error} = await supabase.rpc('user_is_admin');
      return data;
    }
  }


  return (
    <AuthContext.Provider value={{ user, session, meta, login, logout, getSession, checkPassword, admin }}>
      {children}
    </AuthContext.Provider>
  );
};
/**
 * 
 * OBJECT
 * meta: Object = {
 *    pfp
 *    publicID
 *    username
 * };
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
