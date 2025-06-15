"use client"
import React from 'react'
import { Trash } from 'lucide-react';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { deleteProject } from '@/actions/project';
import { Button } from '@/components/ui/button';

const DeleteProject = ({ projectId }: { projectId: string }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onDelete = () => {
    const confirmed = window.confirm('Are you sure you want to delete this project?');
    if (!confirmed) return;

    startTransition(async () => {
      try {
        await deleteProject(projectId);
        toast.success('Project deleted successfully');
        router.refresh();
      } catch (error) {
        toast.error('Failed to delete project');
        console.error(error);
      }
    });
  };
  return (
    <Button onClick={onDelete} disabled={isPending} size='icon' variant='ghost' className='hover:bg-red-500 hover:text-white'>
      <Trash className='w-4 h-4' />
    </Button>
  );
};

export default DeleteProject