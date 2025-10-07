import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  userRole: 'admin' | 'user' | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!mounted) return;

      setUser(user);

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));

          if (userDoc.exists()) {
            setUserRole(userDoc.data().role || 'user');
          } else {
            // Create user document if it doesn't exist
            const newUser = {
              email: user.email,
              fullName: user.displayName || 'User',
              role: 'user', // Default role
              createdAt: new Date(),
            };

            await setDoc(doc(db, 'users', user.uid), newUser);
            setUserRole('user');
          }
        } catch (error: any) {
          console.error('Error fetching user role:', error.message);
          // Set default role if there's an error
          setUserRole('user');
        }
      } else {
        setUserRole(null);
      }

      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return (
      <AuthContext.Provider value={{ user, userRole, loading }}>
        {children}
      </AuthContext.Provider>
  );
};



// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { onAuthStateChanged, User } from 'firebase/auth';
// import { auth, db } from '../firebase';
// import { doc, getDoc } from 'firebase/firestore';
//
// interface AuthContextType {
//   user: User | null;
//   userRole: 'admin' | 'user' | null;
//   loading: boolean;
// }
//
// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   userRole: null,
//   loading: true,
// });
//
// export const useAuth = () => useContext(AuthContext);
//
// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     let mounted = true;
//
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (!mounted) return;
//
//       setUser(user);
//
//       if (user) {
//         try {
//           const userDoc = await getDoc(doc(db, 'users', user.uid));
//           if (userDoc.exists()) {
//             setUserRole(userDoc.data().role);
//           } else {
//             setUserRole('user');
//           }
//         } catch (error) {
//           console.error('Error fetching user role:', error);
//           setUserRole('user');
//         }
//       } else {
//         setUserRole(null);
//       }
//
//       if (mounted) {
//         setLoading(false);
//       }
//     });
//
//     return () => {
//       mounted = false;
//       unsubscribe();
//     };
//   }, []);
//
//   return (
//       <AuthContext.Provider value={{ user, userRole, loading }}>
//         {children}
//       </AuthContext.Provider>
//   );
// };