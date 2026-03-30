# Firebase Replication Strategy: Exportoptimum to FFI

This guide outlines the core architecture of the Exportoptimum project, focusing on the seamless interaction between Authentication, Storage, and Firestore. Use this as a blueprint for the FFI project.

---

## 1. Authentication Flow (The Heartbeat)

The system relies on a **Global Context Provider** (`src/firebase/provider.tsx`) to manage state.

### Sequence:
1.  **Initialization**: `initializeFirebase()` creates singleton instances of Auth, Firestore, and Storage.
2.  **Listener Attachment**: In `FirebaseProvider`, `onAuthStateChanged` is attached immediately on mount.
3.  **Loading State**: `isUserLoading` starts as `true`. This prevents components from firing requests prematurely.
4.  **Availability**: The `user` object becomes available only after the SDK checks local storage/indexedDB for a valid session. Components use `useUser()` to "soft-guard" actions.

---

## 2. Storage Upload Flow (The Atomic Pattern)

Uploads succeed without "unauthorized" errors because they follow a strict chronological sequence.

### The 5-Step Upload Sequence:
1.  **Preparation**: The UI captures a `File` object from an `<input type="file">`.
2.  **Auth Check**: The code checks `if (user && !isUserLoading)`. This ensures the Auth token is present in the outgoing XHR request.
3.  **Physical Upload**: `uploadBytes` is called with a structured path: `folder/{uniqueId}/{filename}`.
4.  **URL Retrieval**: `getDownloadURL` is called *only after* the upload promise resolves.
5.  **Database Sync**: The resulting URL is packaged with other data and sent to Firestore via `setDoc` or `addDoc`.

---

## 3. Firestore Flow

### Logic Patterns:
*   **ID Generation**: Often done client-side *before* upload via `doc(collection(db, 'name'))`. This ID is used for both the Storage path and the Firestore document path, ensuring a 1:1 mapping.
*   **Temporal Data**: `serverTimestamp()` is used for `createdAt` and `updatedAt` to ensure global time consistency across all clients.

---

## 4. Security Rules (The Gatekeeper)

The rules are designed for a **Content Management System (CMS)** model.

### Why they work:
*   **Public Visibility**: `allow read: if true;` ensures that the public can see products/blogs without logging in.
*   **Authenticated Writes**: `allow write: if request.auth != null;`. 
*   **The "Secret"**: Because the frontend logic waits for the Auth state to be ready, the Firebase SDK automatically attaches the user's JWT to the Storage/Firestore request. This satisfies the `request.auth != null` condition in the rules.

---

## 5. Critical Dependencies for FFI

For this system to work in FFI, the following MUST be present:
1.  **Auth Timing**: UI logic must never call an upload function if `user` is null.
2.  **Modular SDK**: Use `@firebase/storage` and `@firebase/firestore` (v9+ syntax).
3.  **CORS**: The Firebase Storage bucket must have a CORS policy (refer to `storage.cors.json`) to allow the browser to read the uploaded files.

---

## 6. Replication Checklist

1.  **Environment**: Match `NEXT_PUBLIC_FIREBASE_*` keys in `.env`.
2.  **Core Files**: Copy `src/firebase/` directory exactly. It is the engine.
3.  **SDK Setup**: Ensure `src/firebase/index.ts` handles the singleton pattern (`getApps().length > 0`).
4.  **Rules Deployment**: Copy `firestore.rules` and `storage.rules`.
5.  **CORS Deployment**: Apply `storage.cors.json` to the new bucket via GSUtil.
6.  **The Guard**: Wrap the root layout in `FirebaseClientProvider`.
