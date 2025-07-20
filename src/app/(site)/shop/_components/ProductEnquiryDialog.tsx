
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { type Product } from "@/lib/types";
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';


const enquiryFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  is_whatsapp_same: z.boolean().default(true),
  whatsapp_number: z.string().optional(),
  quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1."}).optional(),
  delivery_date: z.date().optional(),
  occasion: z.string().optional(),
  instructions: z.string().optional(),
}).refine(data => data.is_whatsapp_same || !!data.whatsapp_number, {
    message: "WhatsApp number is required if it's different.",
    path: ['whatsapp_number'],
});

type EnquiryFormValues = z.infer<typeof enquiryFormSchema>;

export default function ProductEnquiryDialog({ product }: { product: Product }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      is_whatsapp_same: true,
      whatsapp_number: '',
      quantity: 1,
      occasion: '',
      instructions: '',
    },
  });

  const isWhatsappSame = form.watch('is_whatsapp_same');

  const onSubmit = async (values: EnquiryFormValues) => {
    const supabase = createSupabaseBrowserClient();
    const submissionData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        whatsapp_number: values.is_whatsapp_same ? values.phone : values.whatsapp_number,
        source: `Product: ${product.title} (ID: ${product.id})`,
        quantity: values.quantity,
        delivery_date: values.delivery_date,
        occasion: values.occasion,
        instructions: values.instructions,
    };

    const { error } = await supabase.from('contact_submissions').insert([submissionData]);

    if (error) {
        toast({
            variant: "destructive",
            title: "Error submitting enquiry",
            description: "There was a problem. Please try again.",
        });
    } else {
        toast({
            title: "Enquiry Sent!",
            description: "Thank you! We will get back to you shortly.",
        });
        form.reset();
        setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="font-body text-sm rounded-button">Enquire Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Enquire about: {product.title}</DialogTitle>
          <DialogDescription className="font-body">
            Fill out the form below and we'll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Your Email" {...field} />
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
                                    <Input type="tel" placeholder="Your Phone Number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="is_whatsapp_same"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    My WhatsApp number is the same as my phone number.
                                </FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
                {!isWhatsappSame && (
                     <FormField
                        control={form.control}
                        name="whatsapp_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>WhatsApp Number</FormLabel>
                                <FormControl>
                                    <Input type="tel" placeholder="Your WhatsApp Number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                    <Input type="number" min="1" placeholder="1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="occasion"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Occasion</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Birthday" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="delivery_date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Preferred Delivery Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date < new Date(new Date().setDate(new Date().getDate() - 1))
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Special Instructions</FormLabel>
                            <FormControl>
                                <Textarea placeholder="e.g., Happy Birthday message, gift wrap" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Submitting..." : "Submit Enquiry"}
                </Button>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
