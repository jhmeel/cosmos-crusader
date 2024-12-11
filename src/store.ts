import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  UserState,
  VendorState,
  DeliveryAgent,
  UserRole,
  OrderStatus,
  PaymentStatus,
  Location,
} from "../types";
import FirestoreService from "../services/firestoreService";
import { AuthService } from "../services/authService";
import { GlobalState, User } from "./types";


export const useGlobalStateManager = create(
  persist<GlobalState>(
    (set, get) => ({
      currentUser: {
        role: null,
        profile: null,
      },
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const { user, role } = await AuthService.signIn(email, password);
          
          let profile: User | Vendor | DeliveryAgentProfile;
          switch (role) {
            case "buyer":
              profile = await FirestoreService.getUserProfile(user.uid);
              break;
            case "agent":
              profile = await FirestoreService.getDeliveryAgentProfile(user.uid);
              break;
            case "vendor":
              profile = await FirestoreService.getVendorProfile(user.uid);
              break;
          }

          set({
            currentUser: {
              role,
              profile: { id: user.uid, ...profile },
            },
            isAuthenticated: true,
            loading: false,
          });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Login failed",
            loading: false,
          });
        }
      },

      logout: async () => {
        try {
          await AuthService.signOut();
          set({
            currentUser: { role: null, profile: null },
            isAuthenticated: false,
            error: null,
          });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Logout failed",
          });
        }
      },

      switchRole: async (newRole: UserRole) => {
        const currentUser = get().currentUser;
        if (!currentUser.profile?.id) {
          set({ error: "No user logged in" });
          return;
        }

        set({ loading: true, error: null });
        try {
          // Implement role switching logic
          await FirestoreService.updateUserRole(currentUser.profile.id, newRole);

          let newprofile = null;
          switch (newRole) {
            case "buyer":
              newprofile = await FirestoreService.getUserProfile(
                currentUser.profile.id
              );
              break;
            case "agent":
              newprofile = await FirestoreService.getDeliveryAgentProfile(
                currentUser.profile.id
              );
              break;
          }

          set({
            currentUser: {
              ...currentUser,
              role: newRole,
              profile: newprofile,
            },
            loading: false,
          });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Role switch failed",
            loading: false,
          });
        }
      },

      updateProfile: async (data) => {
        const currentUser = get().currentUser;
        if (!currentUser.profile?.id) {
          set({ error: "No user logged in" });
          return;
        }

        set({ loading: true, error: null });
        try {
          let updatedprofile;
          switch (currentUser.role) {
            case "buyer":
              updatedprofile = await FirestoreService.updateUserProfile(
                currentUser.profile.id,
                data
              );
              break;
            case "agent":
              updatedprofile = await FirestoreService.updateDeliveryAgentProfile(
                currentUser.profile.id,
                data
              );
              break;
            case "vendor":
              updatedprofile = await FirestoreService.updateVendorProfile(
                currentUser.profile.id,
                data
              );
              break;
            default:
              throw new Error("Invalid user role");
          }

          set({
            currentUser: {
              ...currentUser,
              profile: updatedprofile,
            },
            loading: false,
          });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Profile update failed",
            loading: false,
          });
        }
      },

      resetState: () => {
        set({
          currentUser: { role: null, profile: null },
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      },
    }),
    {
      name: "global-state-manager",
      getStorage: () => localStorage,
    }
  )
);

// Utility hook for easy access to current user details
export const useCurrentUser = () => {
  const { currentUser, isAuthenticated } = useGlobalStateManager();
  return {
    user: currentUser.profile,
    role: currentUser.role,
    isAuthenticated,
  };
};











import create from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  GlobalState, 
  UserRole, 
  UserState, 
  VendorState, 
  DeliveryAgent 
} from './types';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';
import { auth, firestore } from './firebaseConfig';

export const useGlobalStore = create<GlobalState>(
  persist(
    (set, get) => ({
      currentUser: {
        role: null,
        profile: null
      },
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const userDoc = await getDoc(doc(firestore, 'users', userCredential.user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            set({
              currentUser: {
                role: userData.role,
                profile: userData
              },
              isAuthenticated: true,
              loading: false
            });
          } else {
            // Trigger onboarding if no user document exists
            set({
              currentUser: {
                role: null,
                profile: null
              },
              isAuthenticated: true,
              loading: false
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed', 
            loading: false 
          });
        }
      },

      loginWithGoogle: async () => {
        set({ loading: true, error: null });
        try {
          const provider = new GoogleAuthProvider();
          const userCredential = await signInWithPopup(auth, provider);
          const userDoc = await getDoc(doc(firestore, 'users', userCredential.user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            set({
              currentUser: {
                role: userData.role,
                profile: userData
              },
              isAuthenticated: true,
              loading: false
            });
          } else {
            // Trigger onboarding for new Google Sign-In users
            set({
              currentUser: {
                role: null,
                profile: null
              },
              isAuthenticated: true,
              loading: false
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Google login failed', 
            loading: false 
          });
        }
      },

      logout: async () => {
        set({ loading: true, error: null });
        try {
          await signOut(auth);
          set({
            currentUser: { role: null, profile: null },
            isAuthenticated: false,
            loading: false
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Logout failed', 
            loading: false 
          });
        }
      },

      switchRole: async (newRole: UserRole) => {
        const { currentUser } = get();
        if (!currentUser.profile) return;

        set({ loading: true, error: null });
        try {
          await updateDoc(doc(firestore, 'users', currentUser.profile.id), {
            currentRole: newRole,
            roleChangeTimestamp: new Date().toISOString()
          });

          set(state => ({
            currentUser: {
              ...state.currentUser,
              role: newRole
            },
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Role switch failed', 
            loading: false 
          });
        }
      },

      updateProfile: async (data) => {
        const { currentUser } = get();
        if (!currentUser.profile) return;

        set({ loading: true, error: null });
        try {
          await updateDoc(doc(firestore, 'users', currentUser.profile.id), data);
          
          set(state => ({
            currentUser: {
              ...state.currentUser,
              profile: { ...state.currentUser.profile, ...data }
            },
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Profile update failed', 
            loading: false 
          });
        }
      },

      resetState: () => {
        set({
          currentUser: { role: null, profile: null },
          isAuthenticated: false,
          loading: false,
          error: null
        });
      }
    }),
    {
      name: 'global-app-storage',
      getStorage: () => localStorage
    }
  )
);