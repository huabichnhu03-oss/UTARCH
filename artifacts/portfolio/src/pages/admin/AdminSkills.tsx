import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListSkills, useCreateSkill, useDeleteSkill, getListSkillsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function AdminSkills() {
  const { data: skills = [], isLoading } = useListSkills();
  const createSkill = useCreateSkill();
  const deleteSkill = useDeleteSkill();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newSkillName, setNewSkillName] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    createSkill.mutate(
      { data: { name: newSkillName.trim(), sortOrder: skills.length } },
      {
        onSuccess: () => {
          setNewSkillName("");
          queryClient.invalidateQueries({ queryKey: getListSkillsQueryKey() });
          toast({ title: "Skill added" });
        }
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteSkill.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListSkillsQueryKey() });
          toast({ title: "Skill removed" });
        }
      }
    );
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold uppercase tracking-tighter text-primary mb-6 border-b border-border pb-4">
          SKILLS_MANAGER
        </h1>

        <form onSubmit={handleAdd} className="flex gap-4 mb-8">
          <Input 
            value={newSkillName} 
            onChange={(e) => setNewSkillName(e.target.value)} 
            placeholder="New skill name (e.g. AUTOCAD)" 
            className="rounded-none flex-1 mono uppercase"
          />
          <Button type="submit" disabled={createSkill.isPending || !newSkillName.trim()} className="rounded-none bg-primary hover:bg-accent text-white">
            {createSkill.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            ADD
          </Button>
        </form>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading...</div>
        ) : skills.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground border border-dashed border-border p-8">
            No skills added yet.
          </div>
        ) : (
          <div className="border border-border divide-y divide-border">
            {skills.map((skill) => (
              <div key={skill.id} className="flex justify-between items-center p-4 bg-background hover:bg-muted/20">
                <span className="mono uppercase font-bold tracking-widest">{skill.name}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0 rounded-none"
                  onClick={() => handleDelete(skill.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
