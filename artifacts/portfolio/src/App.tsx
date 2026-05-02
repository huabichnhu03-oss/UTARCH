import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import ProjectDetail from "@/pages/ProjectDetail";
import Posts from "@/pages/Posts";
import PostDetail from "@/pages/PostDetail";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProjects from "@/pages/admin/AdminProjects";
import AdminProjectForm from "@/pages/admin/AdminProjectForm";
import AdminPosts from "@/pages/admin/AdminPosts";
import AdminPostForm from "@/pages/admin/AdminPostForm";
import AdminSkills from "@/pages/admin/AdminSkills";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminUploads from "@/pages/admin/AdminUploads";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route path="/posts" component={Posts} />
      <Route path="/posts/:id" component={PostDetail} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      
      <Route path="/admin/projects" component={AdminProjects} />
      <Route path="/admin/projects/new" component={AdminProjectForm} />
      <Route path="/admin/projects/:id/edit" component={AdminProjectForm} />
      
      <Route path="/admin/posts" component={AdminPosts} />
      <Route path="/admin/posts/new" component={AdminPostForm} />
      <Route path="/admin/posts/:id/edit" component={AdminPostForm} />
      
      <Route path="/admin/skills" component={AdminSkills} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/uploads" component={AdminUploads} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
