# Migration Guide: Exportoptimum to FFI

To replicate this success in the FFI project, follow these steps exactly:

## Step 1: Core SDK Setup
Copy the entire `src/firebase/` directory. It is self-contained and handles:
- Initialization.
- Context Providers.
- Real-time Hooks (`useCollection`, `useDoc`).
- Non-blocking mutation utilities.

## Step 2: Environment Configuration
Ensure the `.env` file in the FFI project has all the `NEXT_PUBLIC_FIREBASE_*` keys matching the FFI Firebase Project settings.

## Step 3: Storage CORS (Crucial)
You **MUST** apply the CORS configuration to the new FFI bucket, or image previews and certain uploads will fail.
1. Create a `storage.cors.json` file.
2. Deploy it via GSUtil: `gsutil cors set storage.cors.json gs://<your-ffi-bucket-url>`.

## Step 4: Security Rules Sync
Copy the `firestore.rules` and `storage.rules` from this project. 
- Adjust the paths in `storage.rules` if FFI uses different folder names (e.g., if you have `reports/` instead of `products/`).

## Step 5: The "Auth Timing" Guard
When building the FFI frontend, never trigger a file upload directly from a component without checking the `user` object from `useUser()`.

**Wrong:**
```tsx
const { firestore } = useFirebase();
const upload = () => uploadBytes(...); // Might fail if called too early
```

**Right:**
```tsx
const { user, isUserLoading } = useUser();
const handleUpload = () => {
  if (!user) return; // Guard
  // logic here
};
```

## Step 6: Backend Schema Sync
Copy `docs/backend.json` and update the `entities` to match FFI's data requirements. This file is your blueprint for both the database and the rules.
