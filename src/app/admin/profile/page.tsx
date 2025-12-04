
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUser, useAuth } from '@/firebase';
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Camera } from 'lucide-react';

export default function ManageProfilePage() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const storage = getStorage();
    const { toast } = useToast();

    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
            setEmail(user.email || '');
            setImagePreview(user.photoURL);
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
        if (!user || !auth) return;

        setIsSubmittingProfile(true);

        try {
            let photoURL = user.photoURL;

            if (imageFile) {
                const storageRef = ref(storage, `avatars/${user.uid}/${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                photoURL = await getDownloadURL(snapshot.ref);
            }

            // Update profile (display name and photo)
            await updateProfile(auth.currentUser!, {
                displayName: displayName,
                photoURL: photoURL,
            });

            // Update email if it has changed
            if (email !== user.email) {
                // This is a sensitive operation and requires re-authentication
                const credential = EmailAuthProvider.credential(user.email!, prompt('Please enter your current password to change your email.')!);
                await reauthenticateWithCredential(auth.currentUser!, credential);
                await updateEmail(auth.currentUser!, email);
            }

            toast({ title: "Profile Updated", description: "Your profile details have been saved." });

        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast({ variant: 'destructive', title: "Update Failed", description: error.message });
        } finally {
            setIsSubmittingProfile(false);
        }
    };
    
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !auth || !currentPassword || !newPassword) return;
        
        if (newPassword !== confirmPassword) {
            toast({ variant: 'destructive', title: "Passwords Don't Match", description: "The new password and confirmation do not match." });
            return;
        }

        setIsSubmittingPassword(true);

        try {
            const credential = EmailAuthProvider.credential(user.email!, currentPassword);
            await reauthenticateWithCredential(auth.currentUser!, credential);
            await updatePassword(auth.currentUser!, newPassword);
            toast({ title: "Password Updated", description: "Your password has been changed successfully." });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            console.error("Error updating password:", error);
            toast({ variant: 'destructive', title: "Password Change Failed", description: error.message });
        } finally {
            setIsSubmittingPassword(false);
        }
    }

    if (isUserLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-8">Manage Profile</h1>
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                    <form onSubmit={handleProfileSubmit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Details</CardTitle>
                                <CardDescription>Update your personal information.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="displayName">Display Name</Label>
                                    <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </CardContent>
                             <CardFooter className="border-t px-6 py-4">
                                <Button type="submit" disabled={isSubmittingProfile}>
                                    {isSubmittingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Profile
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>

                     <form onSubmit={handlePasswordSubmit} className="mt-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>Update your login password.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button type="submit" disabled={isSubmittingPassword}>
                                    {isSubmittingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Update Password
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Picture</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <div className="relative group">
                                <Avatar className="h-40 w-40">
                                    <AvatarImage src={imagePreview || undefined} alt={displayName} />
                                    <AvatarFallback>{displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div 
                                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Camera className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <Input
                                ref={fileInputRef}
                                id="picture"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                                Change Picture
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
