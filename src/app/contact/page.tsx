
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters.' }),
});

export default function ContactPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Message Sent!',
      description:
        'Thank you for contacting us. We will get back to you shortly.',
    });
    form.reset();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-headline font-bold">
                Get in Touch
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                We'd love to hear from you. Whether you have a question about our products, pricing, or anything else, our team is ready to answer all your questions.
              </p>
            </div>

            <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                        >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="name@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <FormControl>
                                <Input placeholder="Inquiry about Hass avocados" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Your Message</FormLabel>
                                <FormControl>
                                <Textarea
                                    placeholder="Leave your message here..."
                                    className="min-h-[150px]"
                                    {...field}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div className="text-right">
                            <Button type="submit" size="lg">
                            Send Message
                            </Button>
                        </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <div className="mt-20">
                <div className="text-center">
                    <h2 className="text-3xl font-headline font-bold">Our Contact Information</h2>
                    <p className="mt-2 text-muted-foreground">Find us at our office or drop us a line via email or phone.</p>
                </div>
                 <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <div className="p-4 bg-primary/10 text-primary rounded-full">
                            <Mail className="w-8 h-8" />
                        </div>
                        <h4 className="mt-4 text-xl font-bold">Email</h4>
                        <a href="mailto:contact@exportoptimum.com" className="mt-1 text-muted-foreground hover:text-primary transition-colors">contact@exportoptimum.com</a>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="p-4 bg-primary/10 text-primary rounded-full">
                            <Phone className="w-8 h-8" />
                        </div>
                        <h4 className="mt-4 text-xl font-bold">Phone</h4>
                        <a href="tel:+1234567890" className="mt-1 text-muted-foreground hover:text-primary transition-colors">+1 (234) 567-890</a>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="p-4 bg-primary/10 text-primary rounded-full">
                            <MapPin className="w-8 h-8" />
                        </div>
                        <h4 className="mt-4 text-xl font-bold">Address</h4>
                        <p className="mt-1 text-muted-foreground">123 Produce Lane, Fruit Valley, 90210</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
