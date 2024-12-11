/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  deleteDoc,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db, storage } from "../../firebase";
import {
  UserState,
  VendorState,
  DeliveryAgent,
  Order,
  OrderStatus,
  PaymentStatus,
  DeliveryStatus,
  Location,
  Vendor,
  VerificationDocument,
  AgentVerificationStatus,
} from "../types";
import { parseFirebaseError } from "../utils/parser";
import { success, error } from "../utils/notifications";

interface VerificationPayload {
  documentType: VerificationDocument;
  documentUrl: string;
  status: AgentVerificationStatus;
}

class DBOPS {
  static async updateAgentLocation(agentId: string, location: Location) {
    try {
      const agentRef = doc(db, "agents", agentId);
      await updateDoc(agentRef, {
        location,
        lastUpdated: new Date().toISOString(),
      });
      success("Location updated!", `Location updated successfully ${location}`);
    } catch (err) {
      const parsedError = parseFirebaseError(err);
      error("Error updating location", parsedError.userMessage);
    }
  }

  static async updateAgentStatus(agentId: string, status: string) {
    try {
      const agentRef = doc(db, "agents", agentId);
      await updateDoc(agentRef, { status });
      success("Agent Status Updated", `Status changed to ${status}`);
    } catch (err) {
      const parsedError = parseFirebaseError(err);
      error("Error updating agent status", parsedError.userMessage);
    }
  }

  static async getActiveAgents() {
    try {
      const agentsRef = collection(db, "agents");
      const q = query(agentsRef, where("status", "in", ["Available"]));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        agentId: doc.id,
        ...doc.data(),
      }));
    } catch (err) {
      const parsedError = parseFirebaseError(err);
      console.error(parsedError);
      return [];
    }
  }

  static async updateUserProfile(userId: string, photoUrl: string) {}

  static async updateAgentVerification(
    agentId: string,
    payload: VerificationPayload
  ) {}
  static async createDeliveryAgent(agentData: Partial<DeliveryAgent>) {
    try {
      const agentRef = await addDoc(collection(db, "agents"), {
        ...agentData,
        createdAt: serverTimestamp(),
        isVerified: false,
        verificationStatus: "Pending",
        reviews: [],
        fraudReports: 0,
        negligenceReports: 0,
      });
      success("Agent Created", "Agent successfully created.");
      return agentRef.id;
    } catch (err) {
      const parsedError = parseFirebaseError(err);
      error("Agent Creation Failed", parsedError.userMessage);
      throw parsedError;
    }
  }

  static async verifyDeliveryAgent(agentId: string, documentURL: string) {
    try {
      const agentRef = doc(db, "agents", agentId);
      await updateDoc(agentRef, {
        documentURL,
        isVerified: true,
        verificationStatus: "Verified",
      });
      success("Agent Verified", "Verification successful.");
    } catch (err) {
      const parsedError = parseFirebaseError(err);
      error("Verification Failed", parsedError.userMessage);
      throw parsedError;
    }
  }

  static async assignOrderToAgent(orderId: string, agentId: string) {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        "agent.id": agentId,
        "tracking.status": OrderStatus.IN_TRANSIT,
        updatedAt: serverTimestamp(),
      });
      success("Order Assigned", "Order assigned to delivery agent.");
    } catch (err) {
      const parsedError = parseFirebaseError(err);
      error("Order Assignment Failed", parsedError.userMessage);
      throw parsedError;
    }
  }

  static async createVendor(vendorData: Vendor) {
    try {
      const vendorRef = await addDoc(collection(db, "vendors"), {
        ...vendorData,
        createdAt: serverTimestamp(),
        catalog: [],
        orders: [],
        activeOrders: [],
      });
      success("Vendor Created", "Vendor successfully created.");
      return vendorRef.id;
    } catch (err) {
      const parsedError = parseFirebaseError(err);
      error("Vendor Creation Failed", parsedError.userMessage);
      throw parsedError;
    }
  }

  static async updateVendorProfile(
    vendorId: string,
    updateData: Partial<Vendor>
  ) {
    try {
      const vendorRef = doc(db, "vendors", vendorId);
      await updateDoc(vendorRef, updateData);
      success("Profile Updated", "Vendor profile updated successfully.");
    } catch (err) {
      const parsedError = parseFirebaseError(err);
      error("Profile Update Failed", parsedError.userMessage);
      throw parsedError;
    }
  }

  static async filterProductsByRatingForVendor(
    vendorId: string,
    minRating: number
  ) {
    try {
      const vendorRef = collection(db, "vendors", vendorId, "products");
      const productsSnapshot = await getDocs(vendorRef);

      return productsSnapshot.docs
        .map((doc) => doc.data())
        .filter((product) => {
          const reviews = product.reviews || [];
          const avgRating =
            reviews.length > 0
              ? reviews.reduce((acc, review) => acc + review.rating, 0) /
                reviews.length
              : 0;
          return avgRating >= minRating;
        });
    } catch (err) {
      const parsedError = parseFirebaseError(err);
      error("Product Filtering Failed", parsedError.userMessage);
      throw parsedError;
    }
  }

  static async createOrder(orderData: Order) {
    try {
      const orderRef = await addDoc(collection(db, "orders"), {
        ...orderData,
        createdAt: serverTimestamp(),
        tracking: {
          status: OrderStatus.PENDING,
          currentLocation: orderData.tracking?.currentLocation,
          estimatedDeliveryTime: orderData.tracking?.estimatedDeliveryTime,
        },
        paymentStatus: PaymentStatus.PENDING,
      });
      success("Order Created", "Order successfully created.");
      return orderRef.id;
    } catch (err) {
      const parsedError = parseFirebaseError(err);
      error("Order Creation Failed", parsedError.userMessage);
      throw parsedError;
    }
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus) {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        "tracking.status": status,
        updatedAt: serverTimestamp(),
      });
      success("Order Status Updated", `Status changed to ${status}`);
    } catch (err) {
      const parsedError = parseFirebaseError(err);
      error("Order Update Failed", parsedError.userMessage);
      throw parsedError;
    }
  }

  static async updateOrderPaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus
  ) {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        paymentStatus,
        updatedAt: serverTimestamp(),
      });
      success("Payment Processed", `Payment updated to ${paymentStatus}`);
    } catch (err) {
      const parsedError = parseFirebaseError(err);
      error("Payment Processing Failed", parsedError.userMessage);
      throw parsedError;
    }
  }

  static async uploadVerificationDocument(agentId: string, file: File) {
    try {
      const fileRef = storageRef(
        storage,
        `verificationDocuments/${agentId}/${file.name}`
      );
      const uploadResult = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      const agentRef = doc(db, "agents", agentId);
      await updateDoc(agentRef, {
        documentURL: downloadURL,
        verificationStatus: "Pending",
      });
      success(
        "Document Uploaded",
        "Verification document uploaded successfully."
      );
      return downloadURL;
    } catch (err) {
      const parsedError = parseFirebaseError(err);
      error("Upload Failed", parsedError.userMessage);
      throw parsedError;
    }
  }

  static async getVendorOrders(vendorId: string, callback: (arg: any) => void) {
    try {
      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("vendor.id", "==", vendorId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const vendors = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(vendors);
      return vendors;
    } catch (err) {
      const parsedError = parseFirebaseError(err);
      error("Orders Retrieval Failed", parsedError.userMessage);
      throw parsedError;
    }
  }

  static async fetchAgentOrders(agentId: string, callback: (arg: any) => void) {
    try {
      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("agent.id", "==", agentId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(orders);
      return orders;
    } catch (err) {
      const parsedError = parseFirebaseError(err);
      error("Orders Retrieval Failed", parsedError.userMessage);
      throw parsedError;
    }
  }

  static async fetchUserOrders(userId: string, callback: (arg: any) => void) {
    try {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("buyerId", "==", userId));
      const querySnapshot = await getDocs(q);
      const userOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(userOrders);

      return userOrders;
    } catch (err) {
      const parsedError = parseFirebaseError(err);
      error("User Orders Retrieval Failed", parsedError.userMessage);
      throw parsedError;
    }
  }
}

export default DBOPS;
