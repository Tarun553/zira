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


export async function getOrganizationUsers(orgId: string) {
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

  if (!orgId) {
    throw new Error("Organization Id is required");
  }

  const organizationMemberships =
    await (await clerkClient()).organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  if (!organizationMemberships || !organizationMemberships.data) {
    throw new Error("Organization Memberships not found");
  }

  const userIds = organizationMemberships.data
    .map((membership) => membership.publicUserData?.userId)
    .filter((id): id is string => !!id);

  if (!userIds.length) {
    throw new Error("Users not found");
  }

  const users = await db.user.findMany({
    where: {
      clerkUserId: {
        in: userIds,
      },
    },
  });

  return users;
}
