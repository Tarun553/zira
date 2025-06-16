"use client"
import React, { useState } from 'react'
import SprintManager from './sprint-manager'
const SprintBoard = ({sprints, projectId, orgId}: {sprints: any, projectId: string, orgId: string}) => {
  const [currentSprint, setCurrentSprint] = useState(sprints.find((spr: any) => spr.status === "ACTIVE") || sprints[0]);
  return (
    <div>
      {/* sprint manager */}
      <SprintManager
      sprint={currentSprint}
      setSprint={setCurrentSprint}
      sprints={sprints}
      projectId={projectId}
      />

      {/* kanban board */}
    </div>
  )
}

export default SprintBoard