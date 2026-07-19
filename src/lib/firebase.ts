"use client";

/**
 * Optional Firebase RTDB for Host-Only Live chat/gifts.
 * Falls back to CoinCall API + WebSocket when keys are missing.
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";
import { apiConfig } from "@/config/apiConfig";

let app: FirebaseApp | null = null;
let db: Database | null = null;

export function isFirebaseReady() {
  const f = apiConfig.firebase;
  return Boolean(f.apiKey && f.projectId && f.appId && f.authDomain);
}

export function getFirebaseDb(): Database | null {
  if (!isFirebaseReady()) return null;
  if (!app) {
    app =
      getApps()[0] ??
      initializeApp({
        apiKey: apiConfig.firebase.apiKey,
        authDomain: apiConfig.firebase.authDomain,
        projectId: apiConfig.firebase.projectId,
        storageBucket: apiConfig.firebase.storageBucket,
        messagingSenderId: apiConfig.firebase.messagingSenderId,
        appId: apiConfig.firebase.appId,
        databaseURL:
          apiConfig.firebase.databaseURL ||
          `https://${apiConfig.firebase.projectId}-default-rtdb.firebaseio.com`,
      });
  }
  if (!db) db = getDatabase(app);
  return db;
}
