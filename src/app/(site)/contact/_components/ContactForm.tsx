'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const contactFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z.string().optional(),
    message: z.string().optional(),
});

export default function ContactForm() {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
        name: "",
        email: "",
        phone: "",
        message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof contactFormSchema>) => {
    const supabase = createSupabaseBrowserClient();
    const submissionData = {
        ...values,
        source: 'Contact Page Form',
    };
    const { error } = await supabase.from('contact_submissions').insert([submissionData]);

    if (error) {
        toast({
            variant: "destructive",
            title: "Error submitting message",
            description: "There was a problem with your request. Please try again.",
        });
    } else {
        toast({
            title: "Message Sent!",
            description: "Thank you for contacting us. We will get back to you shortly.",
        });
        form.reset();
    }
  };

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <Label htmlFor="name">Name</Label>
                        <FormControl>
                            <Input id="name" placeholder="Your Name" {...field} />
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
                        <Label htmlFor="email">Email</Label>
                        <FormControl>
                            <Input id="email" type="email" placeholder="Your Email" {...field} />
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
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <FormControl>
                            <Input id="phone" type="tel" placeholder="Your Phone Number" {...field} />
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
                        <Label htmlFor="message">Message</Label>
                        <FormControl>
                            <Textarea id="message" placeholder="Your Message" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Sending..." : "Send Message"}
            </Button>
        </form>
    </Form>
  );
}
