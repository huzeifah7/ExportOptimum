
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUser, useAuth } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Camera, Edit, X } from 'lucide-react';

export default function ManageProfilePage() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const storage = getStorage();
    const { toast } = useToast();

    const [isEditing, setIsEditing] = useState(false);
    
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Store original values to revert on cancel
    const [originalState, setOriginalState] = useState({ displayName: '', email: '', photoURL: '' });

    useEffect(() => {
        if (user) {
            const profileState = {
                displayName: user.displayName || '',
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
        if (!user || !auth || !auth.currentUser) return;

        setIsSubmitting(true);

        try {
            let photoURL = user.photoURL;

            // Only upload a new image if a new file has been selected
            if (imageFile) {
                const storageRef = ref(storage, `avatars/${user.uid}/${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                photoURL = await getDownloadURL(snapshot.ref);
            }
            
            // Check if profile data has actually changed
             if(displayName !== originalState.displayName || photoURL !== originalState.photoURL) {
                await updateProfile(auth.currentUser, {
                    displayName: displayName,
                    photoURL: photoURL,
                });
             }

            toast({ title: "Profile Updated", description: "Your profile details have been saved." });
            setOriginalState({ displayName, email, photoURL: photoURL || '' });
            setIsEditing(false);
            setImageFile(null); // Clear the selected file

        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast({ variant: 'destructive', title: "Update Failed", description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelEdit = () => {
        setDisplayName(originalState.displayName);
        setEmail(originalState.email);
        setImagePreview(originalState.photoURL);
        setImageFile(null);
        setIsEditing(false);
    }
    
    if (isUserLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-8">My Profile</h1>
            <form onSubmit={handleProfileSubmit}>
                <Card>
                    <CardHeader className="flex flex-row justify-between items-start">
                        <div>
                            <CardTitle>Profile Details</CardTitle>
                            <CardDescription>
                                {isEditing ? "Update your personal information." : "View your personal information."}
                            </CardDescription>
                        </div>
                        {!isEditing && (
                            <Button variant="outline" onClick={() => setIsEditing(true)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Info
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="grid gap-8 md:grid-cols-3">
                         <div className="flex flex-col items-center gap-4 text-center md:col-span-1">
                            <div className="relative group">
                                <Avatar className="h-40 w-40">
                                    <AvatarImage src={imagePreview || undefined} alt={displayName} />
                                    <AvatarFallback>{displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                {isEditing && (
                                    <div 
                                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Camera className="h-8 w-8 text-white" />
                                    </div>
                                )}
                            </div>
                            <Input
                                ref={fileInputRef}
                                id="picture"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={!isEditing}
                            />
                            {isEditing && (
                                <Button variant="outline" type="button" onClick={() => fileInputRef.current?.click()}>
                                    Change Picture
                                </Button>
                            )}
                        </div>
                        <div className="space-y-6 md:col-span-2">
                             <div className="space-y-2">
                                <Label htmlFor="displayName">Display Name</Label>
                                {isEditing ? (
                                    <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                                ) : (
                                    <p className="text-lg font-medium">{displayName || "Not set"}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                 <p className="text-lg text-muted-foreground">{email || "Not set"}</p>
                            </div>
                        </div>
                    </CardContent>
                     {isEditing && (
                         <CardFooter className="border-t px-6 py-4 flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </CardFooter>
                     )}
                </Card>
            </form>
        </div>
    );
}
