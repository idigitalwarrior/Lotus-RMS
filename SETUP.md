# Lotus Reviews Dashboard — Setup Guide

## Quick Start

1. **Create a Firebase project** at https://console.firebase.google.com
2. Enable **Authentication** (Email/Password)
3. Enable **Firestore Database**
4. Copy your Firebase config into `js/firebase-config.js`
5. Open `index.html` in your browser

---

## Firebase Configuration

Open `js/firebase-config.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**How to get config:** Firebase Console → Project Settings → Your Apps → Web App → SDK Setup & Configuration

---

## Firestore Security Rules

In Firebase Console → Firestore → Rules, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    // Reviews: employees can write their own, admins can read all
    match /reviews/{reviewId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource == null || resource.data.employeeId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    // Brands, Dealerships, Targets: admin only write, all read
    match /brands/{id} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /dealerships/{id} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /targets/{id} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## First Admin Setup

Since the first admin needs to be bootstrapped manually:

1. Register via Admin Login → Sign Up (use @lhmail.com or @lvmail.com email)
2. Go to **Firebase Console → Firestore → users** collection
3. Find your user document → edit `role` to `"admin"` and `status` to `"active"`
4. Sign in via Admin Login — you now have full access!

---

## Email Domain Rules

| Email Domain | Brand |
|---|---|
| @lhmail.com | Lotus Hyundai |
| @lvmail.com | Lotus Vinfast |

Any other email domain will be rejected at signup.

---

## File Structure

```
lotus-dashboard/
├── index.html              ← Landing page (role selection)
├── employee-login.html     ← Employee sign in / sign up
├── employee-dashboard.html ← Employee portal
├── admin-login.html        ← Admin sign in / sign up
├── admin-dashboard.html    ← Full admin panel
├── css/
│   └── style.css           ← All styles (Bauhaus + Neomorphism)
├── js/
│   ├── firebase-config.js  ← Firebase setup + email validation
│   └── utils.js            ← Shared utilities, animations, toasts
└── SETUP.md                ← This file
```

---

## Features

### Employee Portal
- Submit daily review count (with +/- controls)
- Edit past records
- View weekly chart, monthly breakdown
- Stats: today, month, year, streak

### Admin Dashboard
- **Overview:** All stats, target progress bars, brand breakdown, top performers
- **Targets:** Set daily/monthly/yearly targets per brand; confetti on achievement, danger alert if missed
- **Brands:** CRUD — add/edit/delete brands with email domain mapping
- **Dealerships:** CRUD — assign to brands, filter by brand, search
- **Employees:** View/edit all users, assign to dealerships, change roles/status
- **All Reviews:** Browse all submissions with filters
- **Approvals:** Approve or reject pending admin account requests

---

## Notes

- The site uses Firebase CDN (no npm/build step needed)
- Works directly from the file system or any static web server
- For local testing with CORS: use VS Code Live Server, or `npx serve .`
- Font: Barlow (loaded from Google Fonts — needs internet)

---

**Developed by Dharun Kumar N** ( SEO & ORM Analyst @ Lotus Hyundai HO )
