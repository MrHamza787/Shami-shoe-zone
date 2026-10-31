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
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, phone?: string) => Promise<void>;
  signInWithDemoCustomer: () => Promise<void>;
  signInWithDemoAdmin: () => Promise<void>;
  logout: () => Promise<void>;
  updateCustomerProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Bootstrapped admin email from metadata
const BOOTSTRAPPED_ADMIN_EMAIL = 'awan11118@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync user profile & admin state
  const syncProfile = async (fbUser: FirebaseUser) => {
    try {
      const userDocRef = doc(db, 'users', fbUser.uid);
      const userSnap = await getDoc(userDocRef);

      const isEmailAdmin = (fbUser.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase());
      let hasAdminDoc = false;

      try {
        const adminDocRef = doc(db, 'admins', fbUser.uid);
        const adminSnap = await getDoc(adminDocRef);
        hasAdminDoc = adminSnap.exists();

        // If authenticated with awan11118@gmail.com, ensure admin doc is written
        if (isEmailAdmin && !hasAdminDoc) {
          await setDoc(adminDocRef, {
            email: fbUser.email,
            role: 'admin',
            addedAt: new Date().toISOString(),
          }, { merge: true });
          hasAdminDoc = true;
        }
      } catch (err) {
        // Fallback to email check
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
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || 'Customer',
          phoneNumber: fbUser.phoneNumber || null,
          role: adminResolved ? 'admin' : 'customer',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, newProfile);
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Error syncing profile:', error);
      // Fallback local profile
      setProfile({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || 'Customer',
        role: (fbUser.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()) ? 'admin' : 'customer',
      });
      setIsAdmin(fbUser.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase());
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncProfile(currentUser);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const res = await signInWithPopup(auth, provider);
      if (res.user) {
        await syncProfile(res.user);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await syncProfile(res.user);
      }
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, phone?: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await updateProfile(res.user, { displayName: name });
        const userDocRef = doc(db, 'users', res.user.uid);
        const newProfile: UserProfile = {
          uid: res.user.uid,
          email: res.user.email,
          displayName: name,
          phoneNumber: phone || null,
          role: (email.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()) ? 'admin' : 'customer',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, newProfile);
        setProfile(newProfile);
        setIsAdmin(newProfile.role === 'admin');
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      throw error;
    }
  };

  // Demo sign-in helpers for rapid testing if user doesn't want to type credentials
  const signInWithDemoCustomer = async () => {
    const demoEmail = 'customer.abbottabad@shamishoe.pk';
    const demoPass = 'ShamiShoe2026!';
    try {
      await signInWithEmail(demoEmail, demoPass);
    } catch (err) {
      // If demo user does not exist, create it
      await signUpWithEmail(demoEmail, demoPass, 'Muhammad Ali (Kala Pul)');
    }
  };

  const signInWithDemoAdmin = async () => {
    const adminEmail = BOOTSTRAPPED_ADMIN_EMAIL;
    const adminPass = 'AdminPass2026!';
    try {
      await signInWithEmail(adminEmail, adminPass);
    } catch (err) {
      // If admin user does not exist, create it
      await signUpWithEmail(adminEmail, adminPass, 'Admin Shami Shoe Zone');
    }
  };

  const logout = async () => {
    await signOut(auth);
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
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
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
        logout,
        updateCustomerProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
