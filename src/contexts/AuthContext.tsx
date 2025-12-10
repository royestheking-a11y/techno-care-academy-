import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getUsers, saveUser, getUserByEmail, updateUser, getUserEnrollments } from '../utils/localStorage';
import { toast } from "sonner";
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, onSuccess?: () => void) => Promise<{ success: boolean; message: string }>;
  googleLogin: (email: string, name: string, picture: string, onSuccess?: () => void) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, phone: string, password: string, onSuccess?: () => void) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isVerified: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Check if user is logged in via local storage cache
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          // Verify with backend
          try {
            // We can use the generic GET /users/:id
            const response = await api.get(`/users/${parsedUser.id}`);
            const freshUser = response.data;

            if (freshUser) {
              setUser(freshUser);
              if (JSON.stringify(freshUser) !== JSON.stringify(parsedUser)) {
                localStorage.setItem('currentUser', JSON.stringify(freshUser));
              }
              await checkVerificationStatus(freshUser);
            } else {
              // User not found in DB
              logout();
            }
          } catch (err) {
            console.error("User validation failed", err);
            // If sensitive, logout. For now, keep session if just network error?
            // But if 404, logout.
            logout();
          }
        } catch (e) {
          console.error("Failed to parse user from local storage", e);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Security Check: Poll for account existence
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        await api.get(`/users/${user.id}`);
      } catch (e) {
        // If 404, user deleted
        toast.error("আপনার অ্যাকাউন্টটি অ্যাডমিন কর্তৃক ডিলিট করা হয়েছে।");
        logout();
        window.location.hash = "";
      }
    }, 10000); // Check every 10 seconds (relaxed from 2s to save bandwidth)

    return () => clearInterval(interval);
  }, [user]);

  const checkVerificationStatus = async (user: User) => {
    if (user.isVerified) {
      setIsVerified(true);
      return;
    }

    try {
      const enrollments = await getUserEnrollments(user.id);
      const hasConfirmedEnrollment = enrollments.some(
        e => e.status === 'confirmed'
      );
      setIsVerified(hasConfirmedEnrollment);
    } catch (error) {
      console.error("Error checking verification", error);
      setIsVerified(false);
    }
  };

  const login = async (email: string, password: string, onSuccess?: () => void): Promise<{ success: boolean; message: string }> => {
    try {
      // Use the dedicated login endpoint
      const response = await api.post('/login', { email, password });
      const user = response.data;

      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      await checkVerificationStatus(user);

      if (onSuccess) onSuccess();
      return { success: true, message: 'সফলভাবে লগইন হয়েছে' };
    } catch (error: any) {
      const msg = error.response?.data?.message || 'লগইন ব্যর্থ হয়েছে';
      return { success: false, message: msg };
    }
  };

  const googleLogin = async (email: string, name: string, picture: string, onSuccess?: () => void): Promise<{ success: boolean; message: string }> => {
    try {
      let user = await getUserByEmail(email);

      if (!user) {
        // Create new user for Google login
        const newUser: User = {
          id: `user-${Date.now()}`,
          name,
          email,
          phone: "",
          password: Math.random().toString(36).slice(-8),
          role: 'user',
          profilePicture: picture,
          createdAt: new Date().toISOString(),
          isVerified: false
        };
        await saveUser(newUser);
        user = newUser;
      } else {
        if (!user.profilePicture) {
          await updateUser(user.id, { profilePicture: picture });
          user = { ...user, profilePicture: picture };
        }
      }

      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      await checkVerificationStatus(user);

      if (onSuccess) onSuccess();
      return { success: true, message: 'সফলভাবে লগইন হয়েছে' };
    } catch (error) {
      console.error("Google login error", error);
      return { success: false, message: 'Google লগইন ব্যর্থ হয়েছে' };
    }
  };

  const signup = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    onSuccess?: () => void
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return { success: false, message: 'এই ইমেইল দিয়ে ইতিমধ্যে একাউন্ট আছে' };
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        phone,
        password,
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      await saveUser(newUser);
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setIsVerified(false);

      if (onSuccess) onSuccess();
      return { success: true, message: 'সফলভাবে একাউন্ট তৈরি হয়েছে' };
    } catch (error) {
      console.error("Signup error", error);
      return { success: false, message: 'একাউন্ট তৈরি ব্যর্থ হয়েছে' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsVerified(false);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (user) {
      try {
        const updatedUser = { ...user, ...updates };
        await updateUser(user.id, updates);
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Update profile error", error);
        toast.error("প্রোফাইল আপডেট ব্যর্থ হয়েছে");
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        googleLogin,
        signup,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isVerified,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}