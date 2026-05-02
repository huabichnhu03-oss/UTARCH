import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListAllProjects, useListAllPosts, useListSkills } from "@workspace/api-client-react";
import { Link } from "wouter";
import { FolderKanban, FileText, Wrench } from "lucide-react";

export default function AdminDashboard() {
  const { data: projects = [] } = useListAllProjects();
  const { data: posts = [] } = useListAllPosts();
  const { data: skills = [] } = useListSkills();

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-bold uppercase tracking-tighter text-primary mb-8 border-b border-border pb-4">
          DASHBOARD_OVERVIEW
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/projects" className="border border-border p-6 hover:border-primary hover:bg-muted/5 transition-colors group flex flex-col">
            <FolderKanban className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-lg font-bold text-primary">Projects</h2>
            <div className="text-3xl font-bold mt-2">{projects.length}</div>
            <p className="text-sm text-muted-foreground mt-1">{projects.filter(p => p.published).length} published</p>
          </Link>
          
          <Link href="/admin/posts" className="border border-border p-6 hover:border-primary hover:bg-muted/5 transition-colors group flex flex-col">
            <FileText className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-lg font-bold text-primary">Posts</h2>
            <div className="text-3xl font-bold mt-2">{posts.length}</div>
            <p className="text-sm text-muted-foreground mt-1">{posts.filter(p => p.published).length} published</p>
          </Link>
          
          <Link href="/admin/skills" className="border border-border p-6 hover:border-primary hover:bg-muted/5 transition-colors group flex flex-col">
            <Wrench className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-lg font-bold text-primary">Skills</h2>
            <div className="text-3xl font-bold mt-2">{skills.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Listed skills</p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
