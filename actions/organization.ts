"use server";
import { auth, clerkClient, OrganizationMembership } from "@clerk/nextjs/server";
import { db } from "../lib/prisma";

export async function getOrganization(slug: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get the organization details
  
  const organization = await (await clerkClient()).organizations.getOrganization({
    slug,
  });

  if (!organization) {
    return null;
  }

  // Check if user belongs to this organization
  const { data: membership } =
    await (await clerkClient()).organizations.getOrganizationMembershipList({
    organizationId: organization.id,
  });

  const userMembership = membership.find(
    (member: OrganizationMembership) => member.publicUserData?.userId === userId
  );

  // If user is not a member, return null
  if (!userMembership) {
    return null;
  }

  return organization;
}

export async function getProjects(orgId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const projects = await db.project.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });

  return projects;
}

export async function getOrganizationMembers(orgId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const members = await (await clerkClient()).organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });

  const userMemberships = members.data.filter((member: OrganizationMembership) => member.publicUserData?.userId === userId);  

  const users = await db.user.findMany({
    where: {
      clerkUserId: {
        in: userMemberships
          .map((member) => member.publicUserData?.userId)
          .filter((id): id is string => !!id),
      },
    },
  });
  return users;
}
