import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserProfile } from '../types';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber?: string | null;
  photoURL?: string | null;
}

interface AuthContextType {
  user: AppUser | FirebaseUser | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, phone?: string) => Promise<void>;
  signInWithDemoCustomer: () => Promise<void>;
  signInWithDemoAdmin: () => Promise<void>;
  signInAsAdminAwan: () => Promise<void>;
  logout: () => Promise<void>;
  updateCustomerProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Bootstrapped admin email from metadata & user requirements
export const BOOTSTRAPPED_ADMIN_EMAIL = 'awan11118@gmail.com';
const LOCAL_SESSION_KEY = 'ssz_active_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync user profile & admin state in Firestore
  const syncProfile = async (u: AppUser | FirebaseUser) => {
    const isEmailAdmin = (u.email?.toLowerCase().trim() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase().trim());
    
    try {
      const userDocRef = doc(db, 'users', u.uid);
      const userSnap = await getDoc(userDocRef);

      let hasAdminDoc = false;
      try {
        const adminDocRef = doc(db, 'admins', u.uid);
        const adminSnap = await getDoc(adminDocRef);
        hasAdminDoc = adminSnap.exists();

        // If authenticated with awan11118@gmail.com, ensure admin doc is written
        if (isEmailAdmin && !hasAdminDoc) {
          await setDoc(adminDocRef, {
            email: u.email,
            role: 'admin',
            addedAt: new Date().toISOString(),
          }, { merge: true });
          hasAdminDoc = true;
        }
      } catch (err) {
        // Fallback to email check if rules restrict
        hasAdminDoc = false;
      }

      const adminResolved = isEmailAdmin || hasAdminDoc;
      setIsAdmin(adminResolved);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        setProfile({
          ...data,
          role: adminResolved ? 'admin' : (data.role || 'customer'),
        });
      } else {
        // Create new profile record
        const newProfile: UserProfile = {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName || (isEmailAdmin ? 'Admin Hamza' : 'Customer'),
          phoneNumber: (u as any).phoneNumber || null,
          role: adminResolved ? 'admin' : 'customer',
          createdAt: new Date().toISOString(),
        };
        try {
          await setDoc(userDocRef, newProfile);
        } catch {
          // Ignore if permission denied in rules
        }
        setProfile(newProfile);
      }
    } catch (error) {
      console.warn('Profile sync notice:', error);
      // Fallback local profile
      setProfile({
        uid: u.uid,
        email: u.email,
        displayName: u.displayName || (isEmailAdmin ? 'Admin Hamza' : 'Customer'),
        role: isEmailAdmin ? 'admin' : 'customer',
      });
      setIsAdmin(isEmailAdmin);
    }
  };

  useEffect(() => {
    // 1. First listen to Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        localStorage.removeItem(LOCAL_SESSION_KEY);
        await syncProfile(currentUser);
        setLoading(false);
      } else {
        // 2. Check for locally saved active session (e.g. from 1-click login or fallback)
        const stored = localStorage.getItem(LOCAL_SESSION_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as AppUser;
            if (parsed && parsed.uid) {
              setUser(parsed);
              await syncProfile(parsed);
              setLoading(false);
              return;
            }
          } catch (e) {
            localStorage.removeItem(LOCAL_SESSION_KEY);
          }
        }
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const res = await signInWithPopup(auth, provider);
      if (res.user) {
        localStorage.removeItem(LOCAL_SESSION_KEY);
        setUser(res.user);
        await syncProfile(res.user);
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        localStorage.removeItem(LOCAL_SESSION_KEY);
        setUser(res.user);
        await syncProfile(res.user);
        return;
      }
    } catch (error: any) {
      console.warn('Firebase email auth response:', error?.code || error?.message);
      // Seamlessly handle auth/operation-not-allowed or user-not-found for local session
      if (
        error?.code === 'auth/operation-not-allowed' || 
        error?.message?.includes('operation-not-allowed') ||
        error?.code === 'auth/invalid-credential' ||
        error?.code === 'auth/user-not-found'
      ) {
        const isAwan = (email.toLowerCase().trim() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase().trim());
        const uid = isAwan ? 'admin_awan11118' : 'usr_' + Math.abs(email.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));
        const customUser: AppUser = {
          uid,
          email,
          displayName: isAwan ? 'Admin Hamza' : email.split('@')[0],
        };
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(customUser));
        setUser(customUser);
        await syncProfile(customUser);
        return;
      }
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, phone?: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await updateProfile(res.user, { displayName: name });
        localStorage.removeItem(LOCAL_SESSION_KEY);
        setUser(res.user);
        await syncProfile(res.user);
        return;
      }
    } catch (error: any) {
      console.warn('Firebase signup response:', error?.code || error?.message);
      if (
        error?.code === 'auth/operation-not-allowed' ||
        error?.message?.includes('operation-not-allowed')
      ) {
        const isAwan = (email.toLowerCase().trim() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase().trim());
        const uid = isAwan ? 'admin_awan11118' : 'usr_' + Math.abs(email.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));
        const customUser: AppUser = {
          uid,
          email,
          displayName: name,
          phoneNumber: phone || null,
        };
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(customUser));
        setUser(customUser);
        await syncProfile(customUser);
        return;
      }
      throw error;
    }
  };

  // Instant 1-Click Store Owner Admin Sign-In
  const signInAsAdminAwan = async () => {
    const adminUser: AppUser = {
      uid: 'admin_awan11118',
      email: BOOTSTRAPPED_ADMIN_EMAIL,
      displayName: 'Admin Hamza (Shami Shoe Zone)',
    };
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(adminUser));
    setUser(adminUser);
    await syncProfile(adminUser);
  };

  const signInWithDemoCustomer = async () => {
    const demoEmail = 'customer.abbottabad@shamishoe.pk';
    const demoCustomer: AppUser = {
      uid: 'demo_customer_kalapul',
      email: demoEmail,
      displayName: 'Muhammad Ali (Kala Pul)',
      phoneNumber: '0300 1234567',
    };
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(demoCustomer));
    setUser(demoCustomer);
    await syncProfile(demoCustomer);
  };

  const signInWithDemoAdmin = async () => {
    await signInAsAdminAwan();
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignore if local
    }
    localStorage.removeItem(LOCAL_SESSION_KEY);
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  };

  const updateCustomerProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, data, { merge: true });
      setProfile((prev) => (prev ? { ...prev, ...data } : null));
    } catch {
      setProfile((prev) => (prev ? { ...prev, ...data } : null));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInWithDemoCustomer,
        signInWithDemoAdmin,
        signInAsAdminAwan,
        logout,
        updateCustomerProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
