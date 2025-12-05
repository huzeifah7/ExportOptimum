
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  DialogFooter,
  DialogClose,
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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import {
  ChevronDown,
  Search,
  PlusCircle,
  Edit,
  Trash2,
  Image as ImageIcon,
  Loader2,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';

// Flexible type for Firestore documents
type FirestoreProduct = DocumentData & { id: string };

const ITEMS_PER_PAGE = 10;

// --- Main Page Component ---
export default function ManageProductsPage() {
  const firestore = useFirestore();
  const storage = getStorage();
  const { toast } = useToast();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const { data: allProducts, isLoading } = useCollection<FirestoreProduct>(productsQuery);

  const [filteredProducts, setFilteredProducts] = useState<FirestoreProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FirestoreProduct | null>(null);

  // --- Data Filtering and Sorting ---
  const categories = useMemo(() => {
    if (!allProducts) return [];
    const uniqueCategories = new Set(allProducts.map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(uniqueCategories)];
  }, [allProducts]);

  useEffect(() => {
    if (!allProducts) return;

    let products = [...allProducts];

    // Search
    if (searchTerm) {
      products = products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      products = products.filter(p => p.category === categoryFilter);
    }

    // Sort
    products.sort((a, b) => {
        const aDate = a.createdAt as Timestamp | undefined;
        const bDate = b.createdAt as Timestamp | undefined;

        switch (sortOption) {
            case 'newest':
            return (bDate?.toMillis() || 0) - (aDate?.toMillis() || 0);
            case 'oldest':
            return (aDate?.toMillis() || 0) - (bDate?.toMillis() || 0);
            case 'price-low-high':
            return (a.price || 0) - (b.price || 0);
            case 'price-high-low':
            return (b.price || 0) - (a.price || 0);
            default:
            return 0;
        }
    });

    setFilteredProducts(products);
    setCurrentPage(1); // Reset to first page on filter change
  }, [allProducts, searchTerm, categoryFilter, sortOption]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  // --- Handlers for Modals and Actions ---
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: FirestoreProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (product: FirestoreProduct) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct || !firestore || !storage) return;

    try {
      // Delete Firestore document
      await deleteDoc(doc(firestore, 'products', selectedProduct.id));

      // If there's an image, delete it from Storage
      if (selectedProduct.imageUrl) {
        try {
          const imageStorageRef = storageRef(storage, selectedProduct.imageUrl);
          await deleteObject(imageStorageRef);
        } catch (storageError: any) {
          // If file doesn't exist, we don't need to throw an error
          if (storageError.code !== 'storage/object-not-found') {
            console.warn("Could not delete product image from storage:", storageError);
          }
        }
      }

      toast({
        title: 'Product Deleted',
        description: `"${selectedProduct.name || selectedProduct.id}" has been removed.`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        variant: 'destructive',
        title: 'Error Deleting Product',
        description: 'An unexpected error occurred. Please try again.',
      });
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold font-headline">Manage Products</h1>
      </div>

      {/* Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
                placeholder="Search by name or SKU..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="price-low-high">Price: Low to High</SelectItem>
            <SelectItem value="price-high-low">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
        <div className="md:col-start-4 flex justify-end">
            <Button onClick={handleAddProduct}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Product
            </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="overflow-x-auto">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">SKU</TableHead>
                <TableHead className="hidden lg:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                    <TableCell><Skeleton className="h-12 w-12 rounded-md" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                    </TableRow>
                ))
                ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map(product => (
                    <TableRow key={product.id} className="hover:bg-muted/50">
                    <TableCell>
                        <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                        {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.name || 'Product'} width={48} height={48} className="object-cover h-full w-full" />
                        ) : (
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                        )}
                        </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name || product.id}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{product.sku || 'N/A'}</TableCell>
                    <TableCell className="hidden lg:table-cell capitalize text-muted-foreground">{product.category || 'Uncategorized'}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                        {product.price != null ? `$${Number(product.price).toFixed(2)}` : 'N/A'}
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(product)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                        </Button>
                        </div>
                    </TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No products found.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
        {totalPages > 1 && (
             <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
             </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        firestore={firestore}
        storage={storage}
        toast={toast}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              "{selectedProduct?.name || selectedProduct?.id}" and its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}

// --- Product Form Modal Component ---

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: FirestoreProduct | null;
  firestore: any;
  storage: any;
  toast: any;
}

function ProductFormModal({ isOpen, onClose, product, firestore, storage, toast }: ProductFormModalProps) {
  const isEditing = !!product;
  const [formData, setFormData] = useState<Partial<FirestoreProduct>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setFormData(product);
        setImagePreview(product.imageUrl || null);
      } else {
        setFormData({});
        setImagePreview(null);
      }
      setImageFile(null);
    }
  }, [isOpen, product, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !storage) return;

    if (!formData.name) {
        toast({ variant: 'destructive', title: 'Name is required' });
        return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = product?.imageUrl || '';
      const docId = isEditing ? product.id : doc(collection(firestore, 'products')).id;

      if (imageFile) {
        const imagePath = `products/${docId}/${imageFile.name}`;
        const imageStorageRef = storageRef(storage, imagePath);
        await uploadBytes(imageStorageRef, imageFile);
        imageUrl = await getDownloadURL(imageStorageRef);
      }

      const productData = {
        ...formData,
        price: Number(formData.price) || 0,
        imageUrl,
        updatedAt: serverTimestamp(),
      };

      const docRef = doc(firestore, 'products', docId);
      
      if (isEditing) {
        await updateDoc(docRef, productData);
      } else {
        await setDoc(docRef, {
            ...productData,
            id: docId,
            createdAt: serverTimestamp()
        });
      }

      toast({
        title: `Product ${isEditing ? 'Updated' : 'Added'}`,
        description: `"${productData.name}" has been saved.`,
      });
      onClose();

    } catch (error: any) {
      console.error('Failed to save product:', error);
      toast({
        variant: 'destructive',
        title: 'Error Saving Product',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] grid-rows-[auto_1fr_auto]">
         <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="product-form" className="grid md:grid-cols-2 gap-6 overflow-y-auto py-4 px-1">
            {/* Left Column */}
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="text-sm font-medium">Product Name</label>
                    <Input id="name" name="name" value={formData.name || ''} onChange={handleInputChange} required />
                </div>
                 <div>
                    <label htmlFor="sku" className="text-sm font-medium">SKU</label>
                    <Input id="sku" name="sku" value={formData.sku || ''} onChange={handleInputChange} />
                </div>
                 <div>
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
                    <Input id="category" name="category" value={formData.category || ''} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="price" className="text-sm font-medium">Price</label>
                    <Input id="price" name="price" type="number" value={formData.price || ''} onChange={handleInputChange} />
                </div>
            </div>
            {/* Right Column */}
            <div className="space-y-4">
                <label className="text-sm font-medium">Product Image</label>
                <div className="w-full aspect-square border-2 border-dashed rounded-lg flex items-center justify-center relative">
                    {imagePreview ? (
                        <>
                            <Image src={imagePreview} alt="Product preview" fill className="object-cover rounded-md" />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-7 w-7"
                                onClick={() => {
                                    setImageFile(null);
                                    setImagePreview(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <div
                            className="text-center cursor-pointer p-4"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-muted-foreground">Click to upload image</p>
                        </div>
                    )}
                    <Input
                        ref={fileInputRef}
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
            </div>
        </form>
         <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="product-form" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    