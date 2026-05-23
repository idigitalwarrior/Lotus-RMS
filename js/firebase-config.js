// ============================================================
// LOTUS DASHBOARD — Firebase Configuration
// Replace with your actual Firebase project credentials
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ⚠️ REPLACE THESE WITH YOUR FIREBASE PROJECT CONFIG
// Go to: Firebase Console → Project Settings → Your Apps → Firebase SDK snippet
const firebaseConfig = {
    apiKey: "AIzaSyAEiHHK_RcN4aqgjIhBDqcNEXzdnnYaINw",
    authDomain: "lets-collect-reviews.firebaseapp.com",
    projectId: "lets-collect-reviews",
    storageBucket: "lets-collect-reviews.firebasestorage.app",
    messagingSenderId: "685155637353",
    appId: "1:685155637353:web:f080dca7e7541ae46c2af8",
    measurementId: "G-BBEKKQRXM5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ── Brand email domain mapping ──
export const VALID_DOMAINS = {
  'lhmail.com': 'Lotus Hyundai',
  'lvmail.com': 'Lotus Vinfast'
};

export function getBrandFromEmail(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  return VALID_DOMAINS[domain] || null;
}

export function validateEmail(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!VALID_DOMAINS[domain]) {
    return { valid: false, message: `Email must end with @lhmail.com (Lotus Hyundai) or @lvmail.com (Lotus Vinfast)` };
  }
  return { valid: true, brand: VALID_DOMAINS[domain] };
}
