
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUser, useAuth, useFirestore } from '@/firebase';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateEmail } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Camera, User, Mail, Lock, ShieldCheck } from 'lucide-react';

export default function ManageProfilePage() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const firestore = useFirestore();
    const storage = getStorage();
    const { toast } = useToast();

    const [isEditing, setIsEditing] = useState(false);
    
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Store original values to revert on cancel
    const [originalState, setOriginalState] = useState({ displayName: '', email: '', photoURL: '' });

    useEffect(() => {
        if (user) {
            const profileState = {
                displayName: user.displayName || 'Admin',
                email: user.email || '',
                photoURL: user.photoURL || '',
            }
            setDisplayName(profileState.displayName);
            setEmail(profileState.email);
            setImagePreview(profileState.photoURL);
            setOriginalState(profileState);
        }
    }, [user]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !auth?.currentUser || !firestore) return;

        setIsSubmitting(true);

        try {
            let photoURL = user.photoURL;
            const emailChanged = email !== auth.currentUser.email;
            const passwordChanged = !!newPassword;
            const needsReauth = emailChanged || passwordChanged;

            // Handle email and password changes which require re-authentication
            if (needsReauth) {
                if (!currentPassword) {
                    toast({ variant: 'destructive', title: "Current Password Required", description: "Please enter your current password to change your email or password." });
                    setIsSubmitting(false);
                    return;
                }
                
                const credential = EmailAuthProvider.credential(auth.currentUser.email!, currentPassword);
                await reauthenticateWithCredential(auth.currentUser, credential);

                if (emailChanged) {
                    await updateEmail(auth.currentUser, email);
                }
                
                if (passwordChanged) {
                    await updatePassword(auth.currentUser, newPassword);
                }
                
                setNewPassword('');
                setCurrentPassword('');
            }

            // Only upload a new image if a new file has been selected
            if (imageFile) {
                const storageRef = ref(storage, `avatars/${user.uid}/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                photoURL = await getDownloadURL(snapshot.ref);
            }
            
            // Update Auth profile
            await updateProfile(auth.currentUser, {
                displayName: displayName,
                photoURL: photoURL,
            });
            
            // Update Firestore user profile document for global app use
            const userDocRef = doc(firestore, 'users', user.uid);
            const userProfileData = {
                displayName: displayName,
                email: email,
                photoURL: photoURL,
                updatedAt: new Date().toISOString()
            };
            await setDoc(userDocRef, userProfileData, { merge: true });

            toast({ title: "Profile Updated", description: "Your changes have been saved successfully." });
            setOriginalState({ displayName, email, photoURL: photoURL || '' });
            setIsEditing(false);
            setImageFile(null);

        } catch (error: any) {
            console.error("Error updating profile:", error);
            let description = "An unknown error occurred.";
            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                description = "Incorrect current password. Please try again.";
            } else if (error.code === 'auth/requires-recent-login') {
                description = "This operation is sensitive and requires a recent login. Please logout and sign in again."
            } else if (error.code === 'auth/email-already-in-use') {
                description = "This email is already associated with another account."
            }
            toast({ variant: 'destructive', title: "Update Failed", description: description });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelEdit = () => {
        setDisplayName(originalState.displayName);
        setEmail(originalState.email);
        setImagePreview(originalState.photoURL);
        setImageFile(null);
        setNewPassword('');
        setCurrentPassword('');
        setIsEditing(false);
    }
    
    if (isUserLoading) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-headline">My Profile</h1>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)}>
                        Edit Profile
                    </Button>
                )}
            </div>

            <form onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Avatar Upload */}
                    <Card className="lg:col-span-1">
                        <CardContent className="pt-6 flex flex-col items-center gap-6">
                            <div className="relative group">
                                <Avatar className="h-40 w-40 border-4 border-background shadow-xl">
                                    <AvatarImage src={imagePreview || undefined} alt={displayName} className="object-cover" />
                                    <AvatarFallback className="text-4xl font-black bg-primary text-primary-foreground">
                                        {displayName?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                {isEditing && (
                                    <div 
                                        className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Camera className="h-10 w-10 text-white" />
                                    </div>
                                )}
                            </div>
                            
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={!isEditing}
                            />
                            
                            <div className="text-center">
                                <h3 className="font-bold text-xl">{displayName}</h3>
                                <p className="text-sm text-muted-foreground">{email}</p>
                            </div>

                            {isEditing && (
                                <Button variant="outline" size="sm" type="button" onClick={() => fileInputRef.current?.click()}>
                                    Change Photo
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Right: Form Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Personal Details
                                </CardTitle>
                                <CardDescription>Your public-facing profile information.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="displayName">Display Name</Label>
                                    <Input 
                                        id="displayName" 
                                        value={displayName} 
                                        onChange={(e) => setDisplayName(e.target.value)} 
                                        disabled={!isEditing || isSubmitting}
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            id="email" 
                                            type="email" 
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            disabled={!isEditing || isSubmitting}
                                            className="pl-10"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    {isEditing && email !== originalState.email && (
                                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-tight">Requires current password to update</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {isEditing && (
                            <Card className="border-primary/20 bg-primary/[0.02]">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lock className="h-5 w-5 text-primary" />
                                        Security & Credentials
                                    </CardTitle>
                                    <CardDescription>Update your password or verify sensitive changes.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password (Leave blank to keep current)</Label>
                                        <Input 
                                            id="newPassword" 
                                            type="password" 
                                            value={newPassword} 
                                            onChange={(e) => setNewPassword(e.target.value)} 
                                            disabled={isSubmitting}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    
                                    <div className="pt-4 border-t border-primary/10">
                                        <div className="bg-white p-4 rounded-lg border border-primary/20 shadow-inner">
                                            <Label htmlFor="currentPassword" className="text-primary font-bold flex items-center gap-2 mb-2">
                                                <ShieldCheck className="h-4 w-4" />
                                                Current Password Verify
                                            </Label>
                                            <Input 
                                                id="currentPassword" 
                                                type="password" 
                                                value={currentPassword} 
                                                onChange={(e) => setCurrentPassword(e.target.value)} 
                                                disabled={isSubmitting}
                                                placeholder="Required for email/password changes"
                                                className="bg-white"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end gap-3 pt-6 border-t border-primary/10">
                                    <Button variant="ghost" type="button" onClick={handleCancelEdit} disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Updating...
                                            </>
                                        ) : 'Save Changes'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}
