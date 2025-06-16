import React from 'react'
import { getProjects } from '@/actions/project';
import { notFound } from 'next/navigation';
import SprintCreationForm from '../_components/create-sprint';
import SprintBoard from '../_components/sprint-board';

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
      sprintKey={`${(project.sprints?.length ?? 0) + 1}`}
      />

      {/* sprint Board */}
      {project.sprints.length > 0 ? (
        <SprintBoard
        sprints={project.sprints}
        projectId={projectId}
        orgId={project.organizationId}
        />
      ) : (
        <div> create a sprint from button </div>
      )}

    </div>
  )
}

export default ProjectPage