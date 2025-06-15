import React from 'react'
import { getProjects } from '@/actions/project';
import { notFound } from 'next/navigation';
import SprintCreationForm from '../_components/create-sprint';

async function ProjectPage({params}: {params: {projectId: string}}) {
  const {projectId} = params;
  const project = await getProjects(projectId)
  if(!project){
    notFound();
  }
  return (
    <div className="container mx-auto">
      {/* sprint creation */}
      <SprintCreationForm
      projectTitle={project.name}
      projectId={projectId}
      projectKey={project.key}
      sprintKey={project.sprints?.length + 1 }
      />

    </div>
  )
}

export default ProjectPage