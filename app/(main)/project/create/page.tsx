"use client"
import { useState, useEffect } from 'react'
import {useOrganization, useUser} from "@clerk/nextjs";
import OrgSwitcher from '@/components/org-switcher';
import {useForm} from 'react-hook-form'
import {projectSchema} from '@/lib/validators'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createProject } from '@/actions/project';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function CreateProjectPage() {
  const { isLoaded: isOrgLoaded, membership } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  
  useEffect(() => {
    if (isOrgLoaded && isUserLoaded && membership) {
    
      setIsAdmin(membership.role === "org:admin");
      
    }
  }, [isOrgLoaded, isUserLoaded, membership]);

  if (!isOrgLoaded || !isUserLoaded) {
    return null;
  }
  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    setLoading(true);
    try {
      const key = values.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();

      const project = await createProject({ ...values, description: values.description || "", key });
      toast.success("Project created successfully!");
      router.push(`/project/${project.id}`);
      form.reset();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="max-w-lg space-y-6 text-center">
          <span
            className="my-4 animate-pulse bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-2xl font-extrabold tracking-tighter text-transparent select-none md:text-4xl"
            style={{
              fontFamily: "'Geist', 'Inter', sans-serif",
              letterSpacing: "-0.03em",
            }}
          >
            Oops! Only Admins can create projects
          </span>
          <div className="space-y-2">
            <p className="text-lg">
              You are not authorized to create a project in this organization.
            </p>
            <p className="text-sm text-muted-foreground">
              Please switch to an organization where you have admin privileges.
            </p>
          </div>
          <OrgSwitcher />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10 space-y-6 ">
      <div className="mb-10 text-center"> 
     <span
            className="my-4 hover:animate-pulse bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-6xl font-extrabold tracking-tighter text-transparent select-none md:text-6xl text-center"
            style={{
              fontFamily: "'Geist', 'Inter', sans-serif",
              letterSpacing: "-0.03em",
            }}
            >
           create new project
          </span>

            </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">

       <Input id="name" placeholder="Project name" {...form.register("name")} />
       <Input id="key" placeholder="key" {...form.register("key")} />
              <Textarea
        id="description"
        {...form.register("description")}
        placeholder="Description"
        />
       <Button type="submit" disabled={loading}>
         {loading ? "Creating..." : "Create Project"}
       </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateProjectPage;