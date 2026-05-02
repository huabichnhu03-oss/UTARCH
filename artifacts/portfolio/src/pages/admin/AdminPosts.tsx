import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListAllPosts, useUpdatePost, useDeletePost, getListAllPostsQueryKey, getListPostsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

export default function AdminPosts() {
  const { data: posts = [], isLoading } = useListAllPosts();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const togglePublish = (id: number, currentStatus: boolean) => {
    updatePost.mutate(
      { id, data: { published: !currentStatus } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListAllPostsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
          toast({ title: `Post ${!currentStatus ? 'published' : 'unpublished'}` });
        }
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePost.mutate(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListAllPostsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
            toast({ title: "Post deleted" });
          }
        }
      );
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-center border-b border-border pb-4 mb-6">
          <h1 className="text-2xl font-bold uppercase tracking-tighter text-primary">
            POSTS_MANAGER
          </h1>
          <Link href="/admin/posts/new">
            <Button className="bg-primary hover:bg-accent text-white rounded-none mono text-xs uppercase tracking-wider">
              <Plus className="w-4 h-4 mr-2" />
              NEW_POST
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground border border-dashed border-border p-8">
            No posts found. Create one to get started.
          </div>
        ) : (
          <div className="border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border mono text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-normal">Title</th>
                  <th className="p-4 font-normal hidden lg:table-cell">Created</th>
                  <th className="p-4 font-normal">Status</th>
                  <th className="p-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/20">
                    <td className="p-4 font-medium text-primary">
                      {post.title}
                      <div className="text-xs text-muted-foreground mt-1 font-normal mono">{post.slug}</div>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-muted-foreground">{format(new Date(post.createdAt), 'MMM dd, yyyy')}</td>
                    <td className="p-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`h-7 text-xs rounded-none ${post.published ? 'text-green-600 hover:text-green-700' : 'text-muted-foreground hover:text-primary'}`}
                        onClick={() => togglePublish(post.id, post.published)}
                      >
                        {post.published ? <Eye className="w-3 h-3 mr-2" /> : <EyeOff className="w-3 h-3 mr-2" />}
                        {post.published ? 'PUBLISHED' : 'DRAFT'}
                      </Button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <Button variant="outline" size="sm" className="h-8 px-2 rounded-none">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2 rounded-none text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
