import { useGetSettings, useListProjects, useListSkills } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { MoveRight } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function Home() {
  const { data: settings } = useGetSettings();
  const { data: projects = [] } = useListProjects();
  const { data: skills = [] } = useListSkills();

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col">
        {/* HERO SECTION */}
        <section className="border-b border-border grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
          <div className="p-8 lg:p-16 flex flex-col justify-center">
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase tracking-tighter leading-[0.92] text-primary hyphens-none"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              {settings?.title || "ARCHITECTURAL TECHNOLOGIST"}
            </motion.h1>
            <motion.p
              className="mt-6 text-xl text-primary font-medium max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              {settings?.subtitle || "Bridging the gap between conceptual design and technical reality."}
            </motion.p>
          </div>
          <motion.div
            className="aspect-square lg:aspect-auto relative bg-muted flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            {settings?.heroImage ? (
              <img src={settings.heroImage} alt="Hero" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            ) : (
              <div className="text-muted-foreground mono opacity-50 absolute inset-0 flex items-center justify-center border-border">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <rect width="40" height="40" fill="none" className="stroke-border/20" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
                <span className="absolute bg-background px-4 py-2 border border-border">HERO_ELEVATION.DWG</span>
              </div>
            )}
          </motion.div>
        </section>

        {/* INFO BAR — scrolling marquee */}
        <motion.div
          className="bg-primary text-white border-b border-border py-3 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(3)].map((_, rep) =>
              (settings?.infoItems || ["BASED IN TORONTO", "AVAILABLE FOR HIRE", "OBC & LEED COMPLIANT", "PERMIT DRAWINGS", "3D MODELING", "CONSTRUCTION DOCS"]).map((item, i, arr) => (
                <span key={`${rep}-${i}`} className="mono text-xs uppercase tracking-wider mx-6 flex items-center gap-6">
                  {item}
                  <span className="opacity-40">+</span>
                </span>
              ))
            )}
          </div>
        </motion.div>

        {/* ABOUT & SKILLS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 border-b border-border divide-y lg:divide-y-0 lg:divide-x divide-border">
          <motion.div
            className="p-8 lg:p-12 lg:pr-24"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <h2 className="mono text-sm text-muted-foreground uppercase mb-6 tracking-widest">{settings?.aboutHeading || "ABOUT_ME"}</h2>
            <div className="prose prose-blue prose-p:text-foreground prose-p:leading-relaxed max-w-none">
              <p>{settings?.aboutBody || "I specialize in transforming architectural concepts into precise, actionable technical drawings."}</p>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 divide-x divide-y divide-border -mt-[1px] -ml-[1px]">
            {(skills.length > 0 ? skills : [{ id: -1, name: "AUTOCAD", sortOrder: 0 }, { id: -2, name: "REVIT", sortOrder: 1 }, { id: -3, name: "SKETCHUP", sortOrder: 2 }, { id: -4, name: "LUMION", sortOrder: 3 }]).map((skill, i) => (
              <motion.div
                key={skill.id}
                className="p-6 flex items-center justify-center text-center group hover:bg-accent hover:text-white transition-colors cursor-default border-t border-l border-border"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                custom={i * 0.5}
                viewport={{ once: true }}
              >
                <span className="mono uppercase font-bold tracking-widest group-hover:scale-105 transition-transform">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PROJECTS ARCHIVE */}
        <section className="flex-1 flex flex-col">
          <motion.div
            className="p-4 border-b border-border flex justify-between items-center bg-muted/30"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="mono text-sm text-primary uppercase font-bold tracking-widest">PROJECT_ARCHIVE</h2>
            <span className="mono text-xs text-muted-foreground">{settings?.archiveDateRange || "2020-PRESENT"}</span>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border flex-1">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                custom={i * 0.5}
                viewport={{ once: true, margin: "-40px" }}
              >
                <Link href={`/projects/${project.id}`} className="group block flex flex-col h-full border-b md:border-b-0 border-border md:border-transparent">
                  <div className="aspect-square relative overflow-hidden bg-muted border-b border-border">
                    {project.coverImage ? (
                      <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 mono text-xs">NO_IMG</div>
                    )}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col bg-background group-hover:bg-accent/5 transition-colors">
                    <div className="mono text-[10px] text-muted-foreground mb-2 flex justify-between">
                      <span>{project.role}</span>
                      <span>{new Date(project.createdAt).getFullYear()}</span>
                    </div>
                    <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-accent transition-colors">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.subtitle}</p>
                    <div className="mt-auto flex items-center text-primary group-hover:text-accent font-medium text-sm transition-colors">
                      <span className="mono uppercase tracking-wider text-[11px]">VIEW_DETAILS</span>
                      <MoveRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
