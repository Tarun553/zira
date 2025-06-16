"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "../lib/prisma";
import { SprintStatus } from "@prisma/client";

export async function createSprint(
  data: { projectId: string, name: string; description: string; startDate: Date; endDate: Date }
) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    throw new Error("unauthorized");
  }
  const project = await db.project.findUnique({
    where: { id: data.projectId },
  });
  if (!project) {
    throw new Error("project not found");
  }
  if (project.organizationId !== orgId) {
    throw new Error("unauthorized");
  }
  const sprint = await db.sprint.create({
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      projectId: data.projectId,
      status: "PLANNED",
    },
  });
  return sprint;
}

// update sprint server action

export async function updateSprintStatus(SprintId:string, newStatus:string) {
  const {userId, orgId, orgRole} = await auth();
  if (!userId || !orgId) {
    throw new Error("unauthorized");
  }
  try {
    const sprint = await db.sprint.findUnique({
      where: { id: SprintId },
      include:{
        project:{
          select:{
            organizationId: true,
          }
        }
      },
    });
    if (!sprint) {
      throw new Error("sprint not found");
    }
    if (sprint.project.organizationId !== orgId) {
      throw new Error("unauthorized");
    }
    if (orgRole !== "org:admin") {
      throw new Error("only organization admins can update sprint status");
    }

    const now = new Date();
    if (newStatus === "ACTIVE" && now < sprint.startDate) {
      throw new Error("sprint start date is in the future");
    }
    if (newStatus === "COMPLETED" && now > sprint.endDate) {
      throw new Error("sprint end date is in the past");
    }

    const updatedSprint = await db.sprint.update({
      where: { id: SprintId },
      data: {
        status: newStatus as SprintStatus,
      },
    });
    return {success: true, sprint: updatedSprint}
  } catch (error) {
    console.error("Failed to update sprint status:", error);
    return {success: false, error}
  }
}