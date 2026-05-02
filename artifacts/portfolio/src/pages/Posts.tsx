import { useListPosts } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function Posts() {
  const { data: posts = [], isLoading } = useListPosts();

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col max-w-screen-xl mx-auto w-full border-x border-border">
        {/* HEADER */}
        <div className="border-b border-border p-8 md:p-16">
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-primary">
            NOTES & THOUGHTS
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl">
            Observations on architecture, technology, and the built environment.
          </p>
        </div>

        {/* POSTS GRID */}
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No posts found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`} className="group flex flex-col border-b border-border md:border-b-0 hover:bg-accent/5 transition-colors">
                {post.coverImage && (
                  <div className="aspect-[4/3] border-b border-border overflow-hidden bg-muted relative">
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="mono text-xs text-muted-foreground mb-3 uppercase tracking-widest">
                    {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                  </div>
                  <h2 className="text-xl font-bold text-primary mb-3 leading-tight group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center text-primary group-hover:text-accent font-medium text-sm mono uppercase tracking-wider">
                    READ_POST
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
