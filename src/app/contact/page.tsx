'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Mail, Phone, LifeBuoy } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export default function ContactPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Message Sent!',
      description: 'Thank you for contacting us. We will get back to you shortly.',
    });
    form.reset();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="relative py-20 lg:py-32 bg-secondary/50">
          <div className="absolute inset-0">
              <Image 
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxidXNpbmVzcyUyMGNvbnRhY3R8ZW58MHx8fHwxNzYzOTc0NjI3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Contact us background"
                  fill
                  className="object-cover"
                  data-ai-hint="business contact"
              />
              <div className="absolute inset-0 bg-black/70"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-headline font-bold text-white">Contact Us</h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-200 font-subtitle text-[36px] tracking-wide">
                We use an agile approach to test assumptions and connect with the needs of your audience early and often.
              </p>
            </div>

            <div className="max-w-4xl mx-auto bg-secondary p-8 rounded-lg shadow-lg">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Bonnie" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Green" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your email</FormLabel>
                          <FormControl>
                            <Input placeholder="name@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+12 345 6789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Leave a comment..." className="min-h-[150px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-4">
                      By submitting this form you agree to our{' '}
                      <Link href="#" className="text-primary hover:underline">
                        terms and conditions
                      </Link>{' '}
                      and our{' '}
                      <Link href="#" className="text-primary hover:underline">
                        privacy policy
                      </Link>
                      .
                    </p>
                    <Button type="submit" size="lg">Send message</Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="flex flex-col items-center">
                        <div className="bg-secondary p-4 rounded-full mb-4">
                            <Mail className="h-8 w-8 text-accent"/>
                        </div>
                        <h3 className="font-bold text-xl mb-2">Email us:</h3>
                        <p className="text-muted-foreground mb-2 max-w-xs">Email us for general queries, including marketing and partnership opportunities.</p>
                        <a href="mailto:hello@avocadohub.ma" className="font-semibold text-primary hover:underline">hello@avocadohub.ma</a>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-secondary p-4 rounded-full mb-4">
                            <Phone className="h-8 w-8 text-accent"/>
                        </div>
                        <h3 className="font-bold text-xl mb-2">Call us:</h3>
                        <p className="text-muted-foreground mb-2 max-w-xs">Call us to speak to a member of our team. We are always happy to help.</p>
                        <a href="tel:+212528000000" className="font-semibold text-primary hover:underline">+212 5 28 00 00 00</a>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-secondary p-4 rounded-full mb-4">
                            <LifeBuoy className="h-8 w-8 text-accent"/>
                        </div>
                        <h3 className="font-bold text-xl mb-2">Support:</h3>
                        <p className="text-muted-foreground mb-2 max-w-xs">Email us for general queries, including marketing and partnership opportunities.</p>
                        <Button variant="outline" asChild>
                            <Link href="#">Support Center</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
