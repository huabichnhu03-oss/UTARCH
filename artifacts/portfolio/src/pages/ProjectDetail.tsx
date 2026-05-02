import { useGetProject, getGetProjectQueryKey } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link, useParams } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams();
  const projectId = parseInt(id || "0", 10);
  
  const { data: project, isLoading } = useGetProject(projectId, {
    query: { enabled: !!projectId, queryKey: getGetProjectQueryKey(projectId) }
  });

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[100dvh] flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Link href="/" className="text-accent hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Archive
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="border-b border-border flex">
          <Link href="/" className="px-6 py-4 border-r border-border hover:bg-accent hover:text-white transition-colors flex items-center shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="p-4 px-6 flex flex-col justify-center flex-1">
            <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-tighter text-primary break-words">
              {project.title}
            </h1>
            <p className="text-muted-foreground mt-1">{project.subtitle}</p>
          </div>
        </div>

        {/* METADATA BAR */}
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border bg-muted/20">
          <div className="p-4">
            <span className="mono text-[10px] text-muted-foreground uppercase block mb-1">CLIENT</span>
            <span className="mono text-sm font-bold">{project.client}</span>
          </div>
          <div className="p-4">
            <span className="mono text-[10px] text-muted-foreground uppercase block mb-1">ROLE</span>
            <span className="mono text-sm font-bold">{project.role}</span>
          </div>
          <div className="p-4">
            <span className="mono text-[10px] text-muted-foreground uppercase block mb-1">FOCUS</span>
            <span className="mono text-sm font-bold">{project.focus}</span>
          </div>
          <div className="p-4">
            <span className="mono text-[10px] text-muted-foreground uppercase block mb-1">TOOLS</span>
            <span className="mono text-sm font-bold">{project.tools}</span>
          </div>
        </div>

        {/* HERO IMAGE */}
        {(project.heroImage || project.coverImage) && (
          <div className="aspect-[21/9] md:aspect-[3/1] bg-muted border-b border-border relative overflow-hidden">
            <img 
              src={project.heroImage || project.coverImage || ""} 
              alt={project.title} 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        )}

        {/* CONTENT & METHODOLOGY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border border-b border-border">
          <div className="lg:col-span-2 p-8 lg:p-12">
            <h2 className="mono text-sm text-muted-foreground uppercase mb-6 tracking-widest">PROJECT_BRIEF</h2>
            <div className="prose prose-blue max-w-none">
              {project.description ? (
                <p className="whitespace-pre-wrap">{project.description}</p>
              ) : (
                <p className="italic text-muted-foreground">No detailed description available.</p>
              )}
            </div>
          </div>
          
          <div className="p-8 lg:p-12 bg-muted/10">
            <h2 className="mono text-sm text-muted-foreground uppercase mb-6 tracking-widest">METHODOLOGY</h2>
            {project.methodologySteps && project.methodologySteps.length > 0 ? (
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border">
                {project.methodologySteps.map((step, i) => (
                  <div key={i} className="relative flex items-start">
                    <div className="absolute left-0 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center mono text-[10px] z-10 font-bold text-primary">
                      {i + 1}
                    </div>
                    <div className="pl-10">
                      <h3 className="font-bold text-primary uppercase text-sm mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No methodology steps documented.</p>
            )}
          </div>
        </div>

        {/* GALLERY */}
        {project.galleryImages && project.galleryImages.length > 0 && (
          <div className="flex-1">
            <div className="p-4 border-b border-border bg-muted/30">
              <h2 className="mono text-sm text-primary uppercase font-bold tracking-widest">VISUAL_DOCUMENTS</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
              {project.galleryImages.map((img, i) => (
                <div key={i} className="aspect-[4/3] bg-muted relative border-b border-border md:border-b-0 overflow-hidden group">
                  <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute bottom-4 right-4 bg-background px-3 py-1 border border-border mono text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    FIG_{String(i + 1).padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
