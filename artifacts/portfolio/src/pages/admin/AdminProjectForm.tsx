import { useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useCreateProject, useGetProject, useUpdateProject, getGetProjectQueryKey, getListAllProjectsQueryKey } from "@workspace/api-client-react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "@/lib/schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { Uploader } from "@/components/ui/uploader";

export default function AdminProjectForm() {
  const { id } = useParams();
  const isEditing = id !== "new" && id !== undefined;
  const projectId = isEditing ? parseInt(id, 10) : 0;
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: project, isLoading: isLoadingProject } = useGetProject(projectId, {
    query: { enabled: isEditing, queryKey: getGetProjectQueryKey(projectId) }
  });
  
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      client: "",
      subtitle: "",
      role: "",
      focus: "",
      tools: "",
      coverImage: "",
      heroImage: "",
      description: "",
      methodologySteps: [],
      galleryImages: [""],
      sortOrder: 0,
      published: false
    }
  });

  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control: form.control,
    name: "methodologySteps"
  });

  const { fields: galleryFields, append: appendGallery, remove: removeGallery } = useFieldArray({
    control: form.control,
    name: "galleryImages" as never
  });

  useEffect(() => {
    if (project && isEditing) {
      form.reset({
        title: project.title,
        client: project.client,
        subtitle: project.subtitle,
        role: project.role,
        focus: project.focus,
        tools: project.tools,
        coverImage: project.coverImage || "",
        heroImage: project.heroImage || "",
        description: project.description || "",
        methodologySteps: project.methodologySteps || [],
        galleryImages: project.galleryImages.length > 0 ? project.galleryImages : [""],
        sortOrder: project.sortOrder,
        published: project.published
      });
    }
  }, [project, isEditing, form]);

  const onSubmit = (values: any) => {
    // Filter empty gallery images
    const cleanValues = {
      ...values,
      galleryImages: values.galleryImages.filter((img: string) => img.trim() !== "")
    };

    if (isEditing) {
      updateProject.mutate(
        { id: projectId, data: cleanValues },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetProjectQueryKey(projectId) });
            queryClient.invalidateQueries({ queryKey: getListAllProjectsQueryKey() });
            toast({ title: "Project updated" });
            setLocation("/admin/projects");
          }
        }
      );
    } else {
      createProject.mutate(
        { data: cleanValues },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListAllProjectsQueryKey() });
            toast({ title: "Project created" });
            setLocation("/admin/projects");
          }
        }
      );
    }
  };

  if (isEditing && isLoadingProject) {
    return <AdminLayout><div className="p-8 text-center"><Loader2 className="animate-spin w-8 h-8 mx-auto" /></div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-4 border-b border-border pb-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => setLocation("/admin/projects")} className="rounded-none">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <h1 className="text-2xl font-bold uppercase tracking-tighter text-primary">
            {isEditing ? "EDIT_PROJECT" : "NEW_PROJECT"}
          </h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="space-y-4 p-6 border border-border bg-muted/10">
                  <h2 className="mono text-sm font-bold uppercase tracking-widest text-primary border-b border-border pb-2">BASIC_INFO</h2>
                  
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input className="rounded-none" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="subtitle" render={({ field }) => (
                    <FormItem><FormLabel>Subtitle (Short description)</FormLabel><FormControl><Input className="rounded-none" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="client" render={({ field }) => (
                      <FormItem><FormLabel>Client</FormLabel><FormControl><Input className="rounded-none" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="role" render={({ field }) => (
                      <FormItem><FormLabel>Role</FormLabel><FormControl><Input className="rounded-none" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="focus" render={({ field }) => (
                      <FormItem><FormLabel>Focus</FormLabel><FormControl><Input className="rounded-none" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="tools" render={({ field }) => (
                      <FormItem><FormLabel>Tools</FormLabel><FormControl><Input className="rounded-none" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </div>

                <div className="space-y-4 p-6 border border-border bg-muted/10">
                  <h2 className="mono text-sm font-bold uppercase tracking-widest text-primary border-b border-border pb-2">MEDIA</h2>
                  <FormField control={form.control} name="coverImage" render={({ field }) => (
                    <FormItem><FormLabel>Cover Image URL (Grid thumbnail)</FormLabel><FormControl><Input className="rounded-none" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="heroImage" render={({ field }) => (
                    <FormItem><FormLabel>Hero Image URL (Project header)</FormLabel><FormControl><Input className="rounded-none" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <div className="space-y-4 p-6 border border-border bg-muted/10">
                  <h2 className="mono text-sm font-bold uppercase tracking-widest text-primary border-b border-border pb-2">CONTENT</h2>
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Full Description</FormLabel><FormControl><Textarea className="rounded-none min-h-[200px]" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <div className="space-y-4 p-6 border border-border bg-muted/10">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <h2 className="mono text-sm font-bold uppercase tracking-widest text-primary">METHODOLOGY</h2>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendStep({ title: "", description: "" })} className="h-7 text-xs rounded-none">
                      <Plus className="w-3 h-3 mr-1" /> Add Step
                    </Button>
                  </div>
                  
                  {stepFields.map((field, index) => (
                    <div key={field.id} className="relative p-4 border border-border bg-background space-y-3">
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeStep(index)} className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 h-6 w-6 p-0 rounded-none">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                      <FormField control={form.control} name={`methodologySteps.${index}.title`} render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Step {index + 1} Title</FormLabel><FormControl><Input className="rounded-none h-8" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name={`methodologySteps.${index}.description`} render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Description</FormLabel><FormControl><Textarea className="rounded-none text-sm" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  ))}
                  {stepFields.length === 0 && <p className="text-sm text-muted-foreground italic">No steps added.</p>}
                </div>

                <div className="space-y-4 p-6 border border-border bg-muted/10">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <h2 className="mono text-sm font-bold uppercase tracking-widest text-primary">GALLERY</h2>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendGallery("")} className="h-7 text-xs rounded-none">
                      <Plus className="w-3 h-3 mr-1" /> Add Image
                    </Button>
                  </div>
                  
                  {galleryFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                      <FormField control={form.control} name={`galleryImages.${index}`} render={({ field }) => (
                        <FormItem className="flex-1"><FormControl><Input placeholder="Image URL" className="rounded-none" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <Button type="button" variant="outline" onClick={() => removeGallery(index)} className="rounded-none text-destructive shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 p-6 border border-border bg-muted/10">
                  <h2 className="mono text-sm font-bold uppercase tracking-widest text-primary border-b border-border pb-2">SETTINGS</h2>
                  <div className="flex items-center space-x-2">
                    <FormField control={form.control} name="published" render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border border-border bg-background w-full">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Publish Project</FormLabel>
                          <p className="text-sm text-muted-foreground">Visible to public on the website</p>
                        </div>
                      </FormItem>
                    )} />
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <Button type="submit" disabled={createProject.isPending || updateProject.isPending} className="flex-1 rounded-none bg-primary hover:bg-accent mono font-bold uppercase tracking-widest text-white">
                    {createProject.isPending || updateProject.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    {isEditing ? "SAVE_CHANGES" : "CREATE_PROJECT"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          
          <div className="xl:col-span-1">
            <div className="sticky top-4">
              <h3 className="font-bold text-sm uppercase mono mb-4 text-primary">IMAGE_UPLOADER</h3>
              <Uploader onUploadComplete={(url) => {
                // User can copy it, don't auto-fill to a specific field since there are many image fields
              }} />
              <p className="text-xs text-muted-foreground mt-4">
                Upload images here to get URLs, then paste those URLs into the Cover, Hero, or Gallery fields.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
