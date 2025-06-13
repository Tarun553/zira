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