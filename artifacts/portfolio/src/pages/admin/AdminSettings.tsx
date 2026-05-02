import { useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { siteSettingsSchema } from "@/lib/schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Uploader } from "@/components/ui/uploader";

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useGetSettings();
  const updateSettings = useUpdateSettings();

  const form = useForm({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      ownerName: "",
      title: "",
      subtitle: "",
      heroImage: "",
      aboutHeading: "",
      aboutBody: "",
      infoItems: [""],
      location: "",
      email: "",
      phone: "",
      linkedin: "",
      archiveDateRange: "",
      adminPassword: ""
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "infoItems" as never
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        ownerName: settings.ownerName,
        title: settings.title,
        subtitle: settings.subtitle,
        heroImage: settings.heroImage || "",
        aboutHeading: settings.aboutHeading,
        aboutBody: settings.aboutBody,
        infoItems: settings.infoItems,
        location: settings.location,
        email: settings.email,
        phone: settings.phone,
        linkedin: settings.linkedin,
        archiveDateRange: settings.archiveDateRange,
        adminPassword: "" // Never show password, only submit if changed
      });
    }
  }, [settings, form]);

  const onSubmit = (values: any) => {
    // Only include password if it was entered
    const submitData = { ...values };
    if (!submitData.adminPassword) {
      delete submitData.adminPassword;
    }

    // Filter empty info items
    submitData.infoItems = submitData.infoItems.filter((i: string) => i.trim() !== "");

    updateSettings.mutate(
      { data: submitData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
          toast({ title: "Settings updated" });
          form.setValue("adminPassword", "");
        }
      }
    );
  };

  if (isLoading) {
    return <AdminLayout><div className="p-8 text-center"><Loader2 className="animate-spin w-8 h-8 mx-auto" /></div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-bold uppercase tracking-tighter text-primary mb-6 border-b border-border pb-4">
          SITE_CONFIGURATION
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="space-y-4 p-6 border border-border bg-muted/10">
                  <h2 className="mono text-sm font-bold uppercase tracking-widest text-primary border-b border-border pb-2">BRANDING</h2>
                  <FormField control={form.control} name="ownerName" render={({ field }) => (
                    <FormItem><FormLabel>Owner Name (Nav Logo)</FormLabel><FormControl><Input className="rounded-none" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Hero Title</FormLabel><FormControl><Input className="rounded-none uppercase font-bold" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="subtitle" render={({ field }) => (
                    <FormItem><FormLabel>Hero Subtitle</FormLabel><FormControl><Input className="rounded-none" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="heroImage" render={({ field }) => (
                    <FormItem><FormLabel>Hero Background Image URL</FormLabel><FormControl><Input className="rounded-none" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <div className="space-y-4 p-6 border border-border bg-muted/10">
                  <h2 className="mono text-sm font-bold uppercase tracking-widest text-primary border-b border-border pb-2">ABOUT SECTION</h2>
                  <FormField control={form.control} name="aboutHeading" render={({ field }) => (
                    <FormItem><FormLabel>About Heading</FormLabel><FormControl><Input className="rounded-none uppercase mono text-sm" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="aboutBody" render={({ field }) => (
                    <FormItem><FormLabel>About Body</FormLabel><FormControl><Textarea className="rounded-none h-32" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <div className="space-y-4 p-6 border border-border bg-muted/10">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <h2 className="mono text-sm font-bold uppercase tracking-widest text-primary">INFO BAR (TICKER)</h2>
                    <Button type="button" variant="outline" size="sm" onClick={() => append("")} className="h-7 text-xs rounded-none">
                      <Plus className="w-3 h-3 mr-1" /> Add Item
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <FormField control={form.control} name={`infoItems.${index}`} render={({ field }) => (
                          <FormItem className="flex-1"><FormControl><Input className="rounded-none uppercase mono text-xs" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="button" variant="outline" onClick={() => remove(index)} className="rounded-none text-destructive shrink-0 h-9 w-9 p-0">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 p-6 border border-border bg-muted/10">
                  <h2 className="mono text-sm font-bold uppercase tracking-widest text-primary border-b border-border pb-2">CONTACT & FOOTER</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="location" render={({ field }) => (
                      <FormItem><FormLabel>Location</FormLabel><FormControl><Input className="rounded-none" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input className="rounded-none" type="email" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone</FormLabel><FormControl><Input className="rounded-none" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="linkedin" render={({ field }) => (
                      <FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input className="rounded-none" type="url" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="archiveDateRange" render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel>Projects Archive Date Range (e.g. 2020-PRESENT)</FormLabel><FormControl><Input className="rounded-none uppercase mono text-sm" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </div>

                <div className="space-y-4 p-6 border border-destructive/20 bg-destructive/5">
                  <h2 className="mono text-sm font-bold uppercase tracking-widest text-destructive border-b border-destructive/20 pb-2">SECURITY</h2>
                  <FormField control={form.control} name="adminPassword" render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Admin Password</FormLabel>
                      <FormControl><Input className="rounded-none" type="password" placeholder="Leave blank to keep current password" {...field} value={field.value || ""} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="pt-4 flex gap-4">
                  <Button type="submit" disabled={updateSettings.isPending} className="w-full rounded-none bg-primary hover:bg-accent mono font-bold uppercase tracking-widest text-white">
                    {updateSettings.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    SAVE_CONFIGURATION
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          
          <div className="xl:col-span-1">
            <div className="sticky top-4">
              <h3 className="font-bold text-sm uppercase mono mb-4 text-primary">IMAGE_UPLOADER</h3>
              <Uploader />
              <p className="text-xs text-muted-foreground mt-4">
                Use this to upload a new Hero image and copy the URL.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
