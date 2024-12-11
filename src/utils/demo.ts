// src/data/demoUsers.ts
import { UserState, UserRole, DeliveryAgent, DeliveryStatus, AgentVerificationStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const demoAgents: DeliveryAgent[] = [
  {
    id: uuidv4(),
    name: 'Maria Chen',
    email: 'maria.chen@shopverse.com',
    phone: '+1 (555) 987-6543',
    photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    isVerified: false,
    documentURL: 'path/to/maria_docs.pdf',
    AgentverificationStatus: AgentVerificationStatus.PENDING,
    reviews: [
      { 
        rating: 4.5, 
        comment: 'Excellent and timely service', 
        orderId: uuidv4() 
      },
      { 
        rating: 4.8, 
        comment: 'Very professional delivery', 
        orderId: uuidv4() 
      }
    ],
    reviewCount: 42,
    totalScore: 4.6,
    fraudReports: 0,
    negligenceReports: 1,
    status: DeliveryStatus.ASSIGNED,
    currentLocation: {
      latitude: 37.7749,
      longitude: -122.4194 // San Francisco coordinates
    },
    updateDeliveryStatus: (status) => {
      console.log(`Delivery status updated to ${status}`);
    },
    updateVerificationStatus: (status) => {
      console.log(`Verification status updated to ${status}`);
    },
    updateTotalScore: (score) => {
      console.log(`Total score updated to ${score}`);
    },
    updateFraudReportCount: (count) => {
      console.log(`Fraud report count updated to ${count}`);
    },
    updateNegligenceReportCount: (count) => {
      console.log(`Negligence report count updated to ${count}`);
    },
    uploadDocument: async (file) => {
      console.log(`Uploading document: ${file.name}`);
    },
    deleteDocument: async (fileId) => {
      console.log(`Deleting document with ID: ${fileId}`);
    },
    reportAgent: (reportType) => {
      console.log(`Agent reported for ${reportType}`);
    },
    resetState: () => {
      console.log('Agent state reset');
    }
  },
  {
    id: uuidv4(),
    name: 'David Rodriguez',
    email: 'david.rodriguez@shopverse.com',
    phone: '+1 (555) 123-8765',
    photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    isVerified: false,
    documentURL: '',
    AgentverificationStatus: AgentVerificationStatus.PENDING,
    reviews: [
        { 
          rating: 4.5, 
          comment: 'Excellent and timely service', 
          reviewerId: uuidv4(),
          id:uuidv4(),
          date:new Date().toDateString()
        },
        { 
          rating: 4.8, 
          comment: 'Very professional delivery', 
          reviewerId: uuidv4(),
          id:uuidv4(),
          date:new Date().toDateString()
        }
      ],
      reviewCount: 42,
    totalScore: 0,
    fraudReports: 0,
    negligenceReports: 0,
    status: DeliveryStatus.UNAVAILABLE,
    currentLocation: {
      latitude: 40.7128,
      longitude: -74.0060 // New York City coordinates
    },
    updateDeliveryStatus: (status) => {
      console.log(`Delivery status updated to ${status}`);
    },
    updateVerificationStatus: (status) => {
      console.log(`Verification status updated to ${status}`);
    },
    updateTotalScore: (score) => {
      console.log(`Total score updated to ${score}`);
    },
    updateFraudReportCount: (count) => {
      console.log(`Fraud report count updated to ${count}`);
    },
    updateNegligenceReportCount: (count) => {
      console.log(`Negligence report count updated to ${count}`);
    },
    uploadDocument: async (file) => {
      console.log(`Uploading document: ${file.name}`);
    },
    deleteDocument: async (fileId) => {
      console.log(`Deleting document with ID: ${fileId}`);
    },
    reportAgent: (reportType) => {
      console.log(`Agent reported for ${reportType}`);
    },
    resetState: () => {
      console.log('Agent state reset');
    }
  }
];

export const demoUsers: UserState[] = [
  {
    id: uuidv4(),
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@shopverse.com',
    phone: '+1 (555) 123-4567',
    currentRole: UserRole.AGENT,
    roleChangeTimestamp: new Date().toISOString(),
    currentLocation: {
      latitude: 40.7128,
      longitude: -74.0060 // New York City coordinates
    },
    error: null,
    photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    agent: demoAgents[0], // Attach a demo agent
    orders: [
      {
        id: uuidv4(),
        // Add detailed order information
      }
    ],
    activeOrders: [],
    nearByAgents: demoAgents,
    
    // Mock methods
    setRole: (role: UserRole) => {
      console.log(`Role changed to ${role}`);
    },
    setLocation: (lat: number, lng: number) => {
      console.log(`Location updated to ${lat}, ${lng}`);
    },
    fetchUserDetails: () => {
      console.log('Fetching user details');
    },
    addOrder: (order) => {
      console.log('Order added', order);
    },
    removeOrder: (orderId) => {
      console.log(`Order ${orderId} removed`);
    },
    fetchNearByAgents: () => {
      console.log('Fetching nearby agents');
    },
    setError: (error) => {
      console.log(`Error set: ${error}`);
    },
    resetState: () => {
      console.log('State reset');
    }
  },
  // Other users remain the same...
];

// Helper function to get a random demo user
export const getRandomDemoUser = (): UserState => {
  const randomIndex = Math.floor(Math.random() * demoUsers.length);
  return demoUsers[randomIndex];
};

export const {
  0: alexRodriguez,
  1: mariaChen,
  2: samWilliams
} = demoUsers;

export const {
  0: mariaAgent,
  1: davidAgent
} = demoAgents;