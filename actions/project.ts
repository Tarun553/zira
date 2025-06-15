"use server";

import { db } from "../lib/prisma";
import { auth, clerkClient, OrganizationMembership } from "@clerk/nextjs/server";

export async function createProject(data: { name: string; key: string; description: string }) {
    const { userId, orgId } = await auth();
  
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }
  
    if (!orgId) {
      throw new Error("No Organization Selected");
    }
  
    // Check if the user is an admin of the organization
    const { data: membershipList } = 
      await (await clerkClient()).organizations.getOrganizationMembershipList({
        organizationId: orgId,
      });
  
    const userMembership = membershipList.find(
      (membership: OrganizationMembership) => membership.publicUserData?.userId === userId
    );
  
    if (!userMembership || userMembership.role !== "org:admin") {
      throw new Error("Only organization admins can create projects");
    }
  
    try {
      const project = await db.project.create({
        data: {
          name: data.name,
          key: data.key,
          description: data.description,
          organizationId: orgId,
        },
      });
  
      return project;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating project: ${error.message}`);
      }
      throw new Error("An unknown error occurred during project creation.");
    }
  }

  // getProject server acytion

  export async function getProject(orgId: string){
    const{ userId } = await auth();
    if(!userId){
      throw new Error("unauthorized")
    }
    const user = await db.user.findUnique({
      where:{clerkUserId: userId}
    })
    if(!user){
      throw new Error("user not found")
    }
    const projects = await db.project.findMany({
      where:{
        organizationId:orgId
      },
      orderBy:{createdAt: "desc"}
    })
    return projects;
  }

  // delete project server action
  export async function deleteProject(projectId: string){
    const {userId, orgId, orgRole} = await auth();

    if(!userId || !orgId){
      throw new Error("unauthorized")
    }
    if(orgRole !== "org:admin"){
      throw new Error("only organization admin can delete the projects ")
    }
    const project = await db.project.findUnique({
      where:{id:projectId}
    })
    if(!project){
      throw new Error("project not found")
    }
    await db.project.delete({
      where:{id:projectId}
    })
    return true;
  }

  // server action to fetch project
  export async function getProjects(projectId: string){
    const {userId, orgId} = await auth();
    if(!userId || !orgId){
      throw new Error("unauthorized")
    }
    const user = await db.user.findUnique({
      where:{ clerkUserId: userId},

    });
    if(!user){
      throw new Error("no user found")
    }

    const project = await db.project.findUnique({
      where:{ id: projectId },
      include:{
        sprints:{
          orderBy: {createdAt: "desc"}
        },
      },
    });

    if(!project){
      throw new Error ("project not found")
    }
    // verify project belongs to same org
    if(project.organizationId !== orgId){
      return null;
    }
    return project;

  } 