import { ErrorCodeMapping, ParsedError, UserRole } from "../types";


export const parseFirebaseError = (error: any): ParsedError => {
  const firebaseErrorMap: ErrorCodeMapping = {
    // Authentication Errors
    "auth/user-not-found": "User not found. Please check your credentials.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/email-already-in-use":
      "This email is already associated with an account.",
    "auth/weak-password": "Password is too weak. Please choose a stronger one.",
    "auth/invalid-email": "Invalid email address format.",
    "auth/network-request-failed":
      "Network error. Check your connection and try again.",
    "auth/too-many-requests":
      "Too many login attempts. Please try again later.",
    "auth/operation-not-allowed": "Operation not allowed. Contact support.",
    // Firestore Errors
    "firestore/permission-denied":
      "Access denied. You do not have the required permissions.",
    "firestore/not-found": "Requested data not found.",
    // Storage Errors
    "storage/unauthorized": "Unauthorized access to this file.",
    "storage/object-not-found": "Requested file not found.",
    // Default fallback
    default: "An unexpected error occurred. Please try again later.",
  };

  const sanitizedMessage = sanitizeErrorMessage(error?.message || "");
  const errorCode = error?.code || "default";
  const userMessage =
    firebaseErrorMap[errorCode] || firebaseErrorMap["default"];

  return {
    userMessage,
    developerMessage: sanitizedMessage, // Original error sanitized for logs
    originalError: error, // Attach original error for debugging if needed
    timestamp: new Date().toISOString(),
  };
};

/**
 * Sanitize Firebase-specific text from raw error messages.
 */
const sanitizeErrorMessage = (message: string): string => {
  return message
    .replace(/firebase/gi, "")
    .replace(/Firestore/gi, "")
    .replace(/Google/gi, "")
    .replace(/auth/gi, "")
    .replace(/Permission denied/gi, "Access denied")
    .replace(/^\[.*?\]\s*/, "") // Remove code patterns like "[code] Message"
    .trim();
};


export const validateRoleTransition = (
  currentRole:UserRole,
  newRole: UserRole
) => {
  const allowedTransitions = {
    buyer: ["agent"],
    agent: ["buyer"],
    vendor: [], // Vendors cannot switch roles
  };

  if (!allowedTransitions[currentRole]?.includes(newRole)) {
   return false
  }

  return true
};
