'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import DOMPurify from 'isomorphic-dompurify';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import RichTextEditor from "../../_components/RichTextEditor";
import { cn } from "@/lib/utils";
import { revalidatePathsAction } from "../../actions";
import { Switch } from "@/components/ui/switch";

type SiteSetting = {
  id: string;
  key: string;
  value: string | null;
  description: string | null;
  type?: string | null; // e.g., 'textarea', 'rich-text', 'boolean'
};

interface SiteSettingsFormProps {
  settings: SiteSetting[];
  gridCols?: number;
  revalidatePaths?: string[];
}

// Create a dynamic Zod schema from the settings
const createFormSchema = (settings: SiteSetting[]) => {
  const schemaObject = settings.reduce((acc, setting) => {
    if (setting.type === 'boolean') {
      acc[setting.key] = z.boolean().optional();
    } else {
      acc[setting.key] = z.string().optional();
    }
    return acc;
  }, {} as Record<string, z.ZodOptional<z.ZodString | z.ZodBoolean>>);
  return z.object(schemaObject);
};

export default function SiteSettingsForm({ settings, gridCols = 2, revalidatePaths = [] }: SiteSettingsFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createSupabaseBrowserClient();

  const formSchema = createFormSchema(settings);
  type FormValues = z.infer<typeof formSchema>;

  const defaultValues = settings.reduce((acc, setting) => {
    if (setting.type === 'boolean') {
        acc[setting.key] = setting.value === 'true';
    } else {
        acc[setting.key] = setting.value ?? "";
    }
    return acc;
  }, {} as Record<string, string | boolean>);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const updates = Object.entries(data).map(([key, value]) => {
          let sanitizedValue: string;
          const settingType = settings.find(s => s.key === key)?.type;

          if (settingType === 'boolean') {
              sanitizedValue = String(value);
          } else {
              sanitizedValue = (value as string) ?? '';
               if (settingType === 'rich-text' || key.includes('story') || key.includes('description') || key.includes('desc')) {
                  sanitizedValue = DOMPurify.sanitize(sanitizedValue);
              }
          }
          
          return supabase
            .from("site_settings")
            .update({ value: sanitizedValue })
            .eq("key", key)
      });

      const results = await Promise.all(updates);
      const hasError = results.some(res => res.error);

      if (hasError) {
        throw new Error("An error occurred while updating settings.");
      }

      if (revalidatePaths.length > 0) {
        await revalidatePathsAction(revalidatePaths);
      }

      toast({
        title: "Success",
        description: "Site settings updated successfully.",
      });
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };
  
  const getFieldComponent = (setting: SiteSetting, field: any) => {
      const placeholder = `Enter value for ${setting.key.replace(/_/g, " ")}`;

      switch(setting.type) {
        case 'boolean':
          return (
             <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
          )
        case 'rich-text':
            return <RichTextEditor value={field.value ?? ''} onChange={field.onChange} placeholder={placeholder} />;
        case 'textarea':
            return <Textarea placeholder={placeholder} className="min-h-[100px]" {...field} value={field.value ?? ''} />;
        case 'image_url':
        case 'url':
            return <Input placeholder={`Enter URL for ${setting.key.replace(/_/g, " ")}`} {...field} value={field.value ?? ''} />;
        default:
             return <Input placeholder={placeholder} {...field} value={field.value ?? ''} />;
      }
  }

  const isFullWidth = (setting: SiteSetting) => setting.type === 'rich-text' || setting.type === 'textarea';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className={`grid grid-cols-1 md:grid-cols-${gridCols} gap-6`}>
            {settings.map((setting) => (
            <FormField
                key={setting.key}
                control={form.control}
                name={setting.key as keyof FormValues}
                render={({ field }) => (
                <FormItem className={cn(isFullWidth(setting) ? `md:col-span-full` : '', setting.type === 'boolean' ? 'flex flex-row items-center justify-between rounded-lg border p-4' : '')}>
                    <div className="space-y-0.5">
                        <FormLabel className="capitalize text-base">
                            {setting.key.replace(/_/g, " ")}
                        </FormLabel>
                        {setting.description && (
                            <FormDescription>{setting.description}</FormDescription>
                        )}
                    </div>
                    <FormControl>
                        {getFieldComponent(setting, field)}
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            ))}
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
