import { AdminLayout } from "@/components/layout/AdminLayout";
import { Uploader } from "@/components/ui/uploader";

export default function AdminUploads() {
  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-bold uppercase tracking-tighter text-primary mb-6 border-b border-border pb-4">
          MEDIA_UPLOADS
        </h1>

        <div className="max-w-2xl border border-border p-8 bg-muted/5">
          <p className="text-muted-foreground mb-6">
            Upload images here to get a stable URL you can use in your projects, posts, or site settings.
          </p>
          <Uploader />
        </div>
      </div>
    </AdminLayout>
  );
}
