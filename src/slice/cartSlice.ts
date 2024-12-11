import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import debounce from 'lodash.debounce';


const db = getFirestore();

// Cart Slice
const createCartSlice = (set: any, get: any) => ({
  cart: [] as CartItem[],

  activeAgents: [], // Store for active agents

  setActiveAgents: (agents: any[]) => {
    set({ activeAgents: agents });
  },

  // Function to fetch active agents and update the store
  fetchActiveAgents: async () => {
    const agents = await getActiveAgentsFromFirebase();
    set({ activeAgents: agents });
  },

  addToCart: (item: CartItem) => {
    set((state: any) => {
      const existingItem = state.cart.find((cartItem: CartItem) => cartItem.productId === item.productId);
      if (existingItem) {
        return {
          cart: state.cart.map((cartItem: CartItem) =>
            cartItem.productId === item.productId
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem
          ),
        };
      }
      return { cart: [...state.cart, item] };
    });
    get().debouncedSyncCart(); // Sync cart with Firebase
  },
  removeFromCart: (productId: string) =>
    set((state: any) => ({ cart: state.cart.filter((item: CartItem) => item.productId !== productId) })),
  clearCart: () => set({ cart: [] }),

  debouncedSyncCart: debounce(async () => {
    const { user, cart } = get();
    if (user && cart.length > 0) {
      const cartRef = doc(db, 'carts', user.userId);
      try {
        await setDoc(cartRef, { items: cart });
      } catch (error) {
        console.error('Failed to sync cart:', error);
      }
    }
  }, 1000), // Debounce for 1 second
});

// Delivery Agent Slice
const createDeliveryAgentSlice = (set: any, get: any) => ({
    deliveryAgent: {
        agentId: null,
        location: { lat: 0, lng: 0 },
        status: "Unavailable", // Default status
      },
    startTrackingLocation: (agentId: string) => {
      let updates = 0;
  
      const interval = setInterval(async () => {
        if (updates >= 3) {
          clearInterval(interval); // Stop tracking after 3 updates
          console.log("Tracking session complete.");
          return;
        }
  
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
  
            // Update Zustand state
            set((state: any) => ({
              deliveryAgent: { ...state.deliveryAgent, location },
            }));
  
            // Update Firebase (throttled)
            await updateAgentLocationInFirebase(agentId, location);
  
            updates += 1;
          },
          (error) => {
            console.error("Geolocation error:", error);
          }
        );
      }, 100000); // Update every 1 minute 40 seconds (3 updates in 5 minutes)
    },
    setAgentStatus: (status: string) => {
        const agentId = get().deliveryAgent.agentId;
    
        if (!agentId) {
          console.error("Agent ID is required to update status!");
          return;
        }
    
        // Update Zustand state
        set((state: any) => ({
          deliveryAgent: { ...state.deliveryAgent, status },
        }));
    
        // Update Firebase
        updateAgentStatusInFirebase(agentId, status).catch((error) =>
          console.error("Failed to update status in Firebase:", error)
        );
      },

    stopTrackingLocation: () => {
      clearInterval(); // Clears the interval
    },
  });
  





