import { useGetProject, getGetProjectQueryKey } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link, useParams } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function ProjectDetail() {
  const { id } = useParams();
  const projectId = parseInt(id || "0", 10);
  
  const { data: project, isLoading } = useGetProject(projectId, {
    query: { enabled: !!projectId, queryKey: getGetProjectQueryKey(projectId) }
  });

  const p = project as any;

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
        <motion.div
          className="border-b border-border flex"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/" className="px-6 py-4 border-r border-border hover:bg-accent hover:text-white transition-colors flex items-center shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="p-4 px-6 flex flex-col justify-center flex-1">
            <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-tighter text-primary break-words">
              {project.title}
            </h1>
            <p className="text-muted-foreground mt-1">{project.subtitle}</p>
          </div>
        </motion.div>

        {/* METADATA BAR */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 divide-y-0 divide-x divide-border border-b border-border bg-muted/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {[
            { label: "CLIENT", value: project.client },
            { label: "ROLE", value: project.role },
            { label: "FOCUS", value: project.focus },
            { label: "TOOLS", value: project.tools },
          ].map((item, i) => (
            <div key={item.label} className="p-4 border-b md:border-b-0 border-border">
              <span className="mono text-[10px] text-muted-foreground uppercase block mb-1">{item.label}</span>
              <span className="mono text-sm font-bold">{item.value}</span>
            </div>
          ))}
        </motion.div>

        {/* HIGHLIGHT STATS */}
        {p?.highlightStats && p.highlightStats.length > 0 && (
          <motion.div
            className="grid border-b border-border bg-primary text-white"
            style={{ gridTemplateColumns: `repeat(${Math.min(p.highlightStats.length, 4)}, 1fr)` }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            {p.highlightStats.map((stat: { label: string; value: string }, i: number) => (
              <div key={i} className="p-5 border-r border-white/20 last:border-r-0 text-center">
                <div className="text-2xl md:text-3xl font-bold mono">{stat.value}</div>
                <div className="mono text-[10px] uppercase tracking-widest mt-1 opacity-75">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* HERO IMAGE */}
        {(project.heroImage || project.coverImage) && (
          <motion.div
            className="aspect-[21/9] md:aspect-[3/1] bg-muted border-b border-border relative overflow-hidden"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={project.heroImage || project.coverImage || ""}
              alt={project.title}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
        )}

        {/* CONTENT & METHODOLOGY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border border-b border-border">
          <motion.div
            className="lg:col-span-2 p-8 lg:p-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <h2 className="mono text-sm text-muted-foreground uppercase mb-6 tracking-widest">PROJECT_BRIEF</h2>
            <div className="prose prose-blue max-w-none">
              {project.description ? (
                <p className="whitespace-pre-wrap">{project.description}</p>
              ) : (
                <p className="italic text-muted-foreground">No detailed description available.</p>
              )}
            </div>
          </motion.div>
          
          <motion.div
            className="p-8 lg:p-12 bg-muted/10"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={1}
            viewport={{ once: true, margin: "-80px" }}
          >
            <h2 className="mono text-sm text-muted-foreground uppercase mb-6 tracking-widest">METHODOLOGY</h2>
            {project.methodologySteps && project.methodologySteps.length > 0 ? (
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[11px] before:h-full before:w-0.5 before:bg-border">
                {project.methodologySteps.map((step, i) => (
                  <motion.div
                    key={i}
                    className="relative flex items-start"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    custom={i * 0.5}
                    viewport={{ once: true }}
                  >
                    <div className="absolute left-0 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center mono text-[10px] z-10 font-bold text-primary">
                      {i + 1}
                    </div>
                    <div className="pl-10">
                      <h3 className="font-bold text-primary uppercase text-sm mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No methodology steps documented.</p>
            )}
          </motion.div>
        </div>

        {/* OUTCOMES */}
        {p?.outcomes && (
          <motion.div
            className="border-b border-border"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-3">
              <h2 className="mono text-sm text-primary uppercase font-bold tracking-widest">OUTCOMES_&_RESULTS</h2>
            </div>
            <div className="p-8 lg:p-12 max-w-3xl">
              <p className="whitespace-pre-wrap text-foreground leading-relaxed">{p.outcomes}</p>
            </div>
          </motion.div>
        )}

        {/* GALLERY */}
        {project.galleryImages && project.galleryImages.length > 0 && (
          <motion.div
            className="flex-1"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="p-4 border-b border-border bg-muted/30">
              <h2 className="mono text-sm text-primary uppercase font-bold tracking-widest">VISUAL_DOCUMENTS</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
              {project.galleryImages.map((img, i) => (
                <motion.div
                  key={i}
                  className="aspect-[4/3] bg-muted relative border-b border-border overflow-hidden group"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  custom={i * 0.3}
                  viewport={{ once: true }}
                >
                  <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute bottom-4 right-4 bg-background px-3 py-1 border border-border mono text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    FIG_{String(i + 1).padStart(2, '0')}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
