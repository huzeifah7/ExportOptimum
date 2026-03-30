# Exportoptimum Firebase Architecture Blueprint

## 1. Authentication Lifecycle
The application uses a **Context-Based Provider** (`src/firebase/provider.tsx`) that wraps the entire Next.js component tree.

### Key Logic:
- **Initialization**: `onAuthStateChanged` is called exactly once inside a `useEffect` in the provider.
- **Loading State**: The `isUserLoading` flag is the most critical variable. It prevents the app from firing Firestore/Storage requests before the Auth token is ready.
- **Singleton Pattern**: Core services (Auth, Firestore, Storage) are initialized in `src/firebase/index.ts` using a check to prevent multiple instances: `getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)`.

## 2. Storage Upload Strategy
The project uses the **Modular Firebase SDK (v9+)**.

### Execution Flow:
```typescript
const storage = getStorage();
const docId = doc(collection(db, 'entity')).id; // Generate ID first
const fileRef = ref(storage, `folder/${docId}/${file.name}`);

// 1. Upload
const snapshot = await uploadBytes(fileRef, file);
// 2. Retrieve URL
const downloadUrl = await getDownloadURL(snapshot.ref);
// 3. Save to Firestore
await setDoc(doc(db, 'entity', docId), { imageUrl: downloadUrl });
```

## 3. Security Rules Logic
### Firestore
- **Public Collections**: Products, Blogs, Partners are `allow read: if true`.
- **Admin Collections**: Messages are `allow get, list: if request.auth != null`.
- **Write Access**: Strictly `if request.auth != null`.

### Storage
- **Public Read**: All assets are public.
- **Scoped Writes**: 
  - `match /avatars/{userId}/...` uses `if request.auth.uid == userId`.
  - Other folders use `if request.auth != null`.

## 4. Error Handling
The `non-blocking-updates.tsx` utility is a unique architectural choice. Instead of `awaiting` every write, it initiates the promise and attaches a `.catch()` that triggers a global `FirebaseErrorListener`. This provides:
1. **Speed**: UI updates instantly.
2. **Context**: If a rule fails, the `FirestorePermissionError` class generates a simulated request object that tells the developer (or an AI agent) exactly why the rule rejected the request.
