
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import {
  collection,
  query,
  orderBy,
  doc,
  deleteDoc,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Mail, Search, Trash2, ChevronDown, ChevronUp, User, Globe, Info, Calendar } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Message = DocumentData & {
  id: string;
  fullName?: string;
  email?: string;
  country?: string;
  subject?: string;
  message?: string;
  createdAt?: Timestamp;
};

// --- Helper Functions ---
const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'Unknown date';
    return timestamp.toDate().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
};


// --- Main Page Component ---
export default function MessagesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    // When the user visits this page, update the timestamp in localStorage
    localStorage.setItem('lastMessagesView', new Date().toISOString());
  }, []);

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'messages'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: allMessages, isLoading } = useCollection<Message>(messagesQuery);

  const countries = useMemo(() => {
    if (!allMessages) return [];
    const uniqueCountries = [...new Set(allMessages.map(m => m.country).filter(Boolean))];
    uniqueCountries.sort();
    return ['all', ...uniqueCountries];
  }, [allMessages]);

  const filteredMessages = useMemo(() => {
    if (!allMessages) return [];
    return allMessages.filter(message => {
      const searchMatch =
        !searchTerm ||
        message.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject?.toLowerCase().includes(searchTerm.toLowerCase());

      const countryMatch = countryFilter === 'all' || message.country === countryFilter;

      return searchMatch && countryMatch;
    });
  }, [allMessages, searchTerm, countryFilter]);
  
  const openDeleteDialog = (message: Message) => {
    setMessageToDelete(message);
    setIsDeleteDialogOpen(true);
  };
  
  const openDetailModal = (message: Message) => {
    setSelectedMessage(message);
    setIsDetailModalOpen(true);
  };

  const handleDeleteMessage = async () => {
    if (!messageToDelete || !firestore) return;
    try {
        await deleteDoc(doc(firestore, 'messages', messageToDelete.id));
        toast({
            title: "Message Deleted",
            description: "The message has been successfully removed."
        });
    } catch(error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete the message."
        });
        console.error("Error deleting message:", error);
    } finally {
        setIsDeleteDialogOpen(false);
        setMessageToDelete(null);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold font-headline">Latest Messages</h1>
        <p className="text-sm text-muted-foreground">
            <Link href="/admin/dashboard" className="hover:underline">Admin Dashboard</Link> / Latest Messages
        </p>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    placeholder="Search by name, email, or subject..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by country" />
                </SelectTrigger>
                <SelectContent>
                    {countries.map(country => (
                        <SelectItem key={country} value={country} className="capitalize">{country}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </CardContent>
      </Card>
      
      {/* Messages List */}
      <AnimatePresence>
        <motion.div
          layout
          className="grid grid-cols-1 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 },
            },
          }}
        >
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <MessageCardSkeleton key={i} />)
          ) : filteredMessages.length > 0 ? (
            filteredMessages.map(message => (
                <motion.div key={message.id} layout variants={{hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}>
                    <MessageCard 
                        message={message} 
                        onDelete={() => openDeleteDialog(message)}
                        onClick={() => openDetailModal(message)}
                    />
                </motion.div>
            ))
          ) : (
            <motion.div className="text-center py-16 text-muted-foreground col-span-full">
                <p>No messages found.</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the message from "{messageToDelete?.fullName}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMessage}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <MessageDetailModal 
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            message={selectedMessage}
        />
      )}

    </motion.div>
  );
}


// --- Message Card Component ---

const MessageCard: React.FC<{ message: Message; onDelete: (e: React.MouseEvent) => void; onClick: () => void }> = ({ message, onDelete, onClick }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <motion.div whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}>
            <Card 
                className="shadow-sm hover:shadow-md transition-shadow duration-300 relative cursor-pointer"
                onClick={onClick}
            >
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive z-10" onClick={onDelete}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete message</span>
                </Button>
                <CardHeader>
                    <CardTitle className="font-headline text-xl">{message.fullName || 'No Name'}</CardTitle>
                    <CardDescription className="flex items-center gap-2 pt-1">
                        <Mail className="h-4 w-4"/>
                        <a href={`mailto:${message.email}`} className="hover:underline" onClick={stopPropagation}>{message.email || 'No Email'}</a>
                        <span className='text-muted-foreground'>&bull;</span>
                        <span className="capitalize">{message.country || 'No Country'}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold text-foreground">{message.subject || 'No Subject'}</p>
                    <p className={cn(
                        "text-muted-foreground mt-2 whitespace-pre-wrap",
                        !isExpanded && 'line-clamp-3'
                    )}>
                        {message.message || 'No message content.'}
                    </p>
                    {(message.message?.split('\\n').length > 3 || message.message?.length > 200) && (
                        <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-primary" onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}>
                           {isExpanded ? (
                               <>View less <ChevronUp className="ml-1 h-4 w-4"/></>
                           ) : (
                               <>View more <ChevronDown className="ml-1 h-4 w-4" /></>
                           )}
                        </Button>
                    )}
                    <p className="text-xs text-muted-foreground mt-4 border-t pt-2">{formatDate(message.createdAt)}</p>
                </CardContent>
            </Card>
        </motion.div>
    );
};


// --- Message Detail Modal ---
interface MessageDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: Message;
}

const MessageDetailModal: React.FC<MessageDetailModalProps> = ({ isOpen, onClose, message }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{message.subject || "Message Details"}</DialogTitle>
                    <DialogDescription>
                        Full message received on {formatDate(message.createdAt)}
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                           <User className="h-5 w-5 text-muted-foreground" />
                           <span className="font-medium">{message.fullName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Mail className="h-5 w-5 text-muted-foreground" />
                           <a href={`mailto:${message.email}`} className="text-primary hover:underline">{message.email}</a>
                        </div>
                         <div className="flex items-center gap-2">
                           <Globe className="h-5 w-5 text-muted-foreground" />
                           <span className="capitalize">{message.country}</span>
                        </div>
                         <div className="flex items-center gap-2">
                           <Calendar className="h-5 w-5 text-muted-foreground" />
                           <span>{formatDate(message.createdAt)}</span>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2"><Info className="h-5 w-5 text-muted-foreground" />Subject</h3>
                        <p className="text-muted-foreground">{message.subject}</p>
                     </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold">Message</h3>
                        <div className="p-4 bg-secondary/50 rounded-md text-muted-foreground whitespace-pre-wrap max-h-96 overflow-y-auto">
                            {message.message}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// --- Skeleton Component ---

const MessageCardSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3 mt-4 pt-2 border-t" />
        </CardContent>
    </Card>
);
