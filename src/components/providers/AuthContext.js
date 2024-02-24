import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../functions/SupabaseClient'; 
import { validEmail, validUsername } from "../../functions/isEmail";
import { doReload } from '../../functions/Astar';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [meta, setMeta] = useState({});

  const getSession = async () => {
    return await supabase.auth.getSession();
  };
   


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

    const getProfilePictureUrl = async () => {
      try {
        const email = (await getSession()).data?.session.user.email;

        const { data, error } = await supabase
          .from("public_users")
          .select('pfp_url')
          .eq('email', email)
          .limit(1)
          .single();
  
        if (data) {
          setMeta((prevMeta) => ({
            ...prevMeta,
            pfp: data.pfp_url,
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

    const getPublicID = async () => {
      const email = (await getSession()).data?.session.user.email || "";
      if (email) {
        const {data,error} = await supabase.from("users").select("publicID").eq("email", user.email)
        if (data[0]?.publicID) {
          setMeta((prevMeta) => ({
            ...prevMeta,
            publicID: data[0].publicID,
          }));        
        }
      }

    }

    if (user&&session) {
      getCommissionerStatus();
      getProfilePictureUrl();
      getPublicID();
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
              setUser(null);
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
        return true;
      } catch (error) {
        //console.error('Error fetching session:', error.message);
        auth = false;
      }
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
      }
    }
    catch (error) {
      throw error;
    }
  };

  //OLD VERION KEEP IN CASE I CAN HACK IT WITH STATE VARS
  // const logout = async () => {
  //   const base = "localhost:3000"
  //   try {
  //     const { error } = await supabase.auth.signOut();
  //     window.location.href = base + "/login";
  //     if (error) {
  //       console.error('Logout error:', error.message);
  //     } else {
  //       setUser(null);
  //       setSession(null);
  //     }
  //   } catch (error) {
  //     console.error('Error during logout:', error.message);
  //   }
  // };

  const logout = async () => {
    const base = "http://localhost:3000"; // Make sure to include the protocol (http/https)
  
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
  
    // Redirect to the login page
    window.location.replace(base + "/login");
    sessionStorage.setItem('logged-in', false);

    // Log error if any
    if (error) {
      console.error('Logout error:', error.message);
    }
  };
  



  return (
    <AuthContext.Provider value={{ user, session, meta, login, logout, getSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
