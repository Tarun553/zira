// create issue action
"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "../lib/prisma";
import { IssueStatus, IssuePriority } from '@prisma/client';
import { Prisma } from "@prisma/client";

export async function getIssuesForSprint(sprintId: string) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const issues = await db.issue.findMany({
    where: { sprintId: sprintId },
    orderBy: [{ status: "asc" }, { order: "asc" }],
    include: {
      assignee: true,
      reporter: true,
    },
  });

  return issues;
}

export async function createIssue(projectId: string, data: { title: string, description: string, status: string, priority: string, sprintId: string, assigneeId?: string }) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  const lastIssue = await db.issue.findFirst({
    where: { projectId, status: data.status as IssueStatus },
    orderBy: { order: "desc" },
  });

  const newOrder = lastIssue ? lastIssue.order + 1 : 0;

  const issue = await db.issue.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status as IssueStatus,
      priority: data.priority as IssuePriority,
      projectId: projectId,
      sprintId: data.sprintId,
      reporterId: user.id,
      assigneeId: data.assigneeId || null,
      order: newOrder,
    },
    include: {
      assignee: true,
      reporter: true,
    },
  });

  return issue;
}

export async function updateIssueOrder(updatedIssues: { id: string, status: string, order: number }[]) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // Start a transaction
  await db.$transaction(async (prisma) => {
    // Update each issue
    for (const issue of updatedIssues) {
      await prisma.issue.update({
        where: { id: issue.id },
        data: {
          status: issue.status as IssueStatus,
          order: issue.order,
        },
      });
    }
  });

  return { success: true };
}

export async function deleteIssue(issueId: string) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const issue = await db.issue.findUnique({
    where: { id: issueId },
    include: {
      project: true,
    },
  });

  if (!issue) {
    throw new Error("Issue not found");
  }

  if (issue.reporterId !== user.id) {
    const orgId = issue.project.organizationId;
    const memberships = await (await clerkClient()).organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

    const currentUserMembership = memberships.data.find(m => m.publicUserData?.userId === userId);

    if (!currentUserMembership || currentUserMembership.role !== 'org:admin') {
      throw new Error("You don't have permission to delete this issue");
    }
  }

  await db.issue.delete({ where: { id: issueId } });

  return { success: true };
}

export async function updateIssue(issueId: string, data: { status: string, priority: string }) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  try {
    const issue = await db.issue.findUnique({
      where: { id: issueId },
      include: { project: true },
    });

    if (!issue) {
      throw new Error("Issue not found");
    }

    if (issue.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }

    const updatedIssue = await db.issue.update({
      where: { id: issueId },
      data: {
        status: data.status as IssueStatus,
        priority: data.priority as IssuePriority,
      },
      include: {
        assignee: true,
        reporter: true,
      },
    });

    return updatedIssue;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error updating issue: " + error.message);
    }
    throw new Error("An unknown error occurred while updating issue");
  }
}

export async function getIssuesByUser({
  organizationId,
  assigneeId,
  reporterId,
}: {
  organizationId: string;
  assigneeId?: string;
  reporterId?: string;
}) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  try {
    // Filter issues by the organization via the related Project model.
    let where: Prisma.IssueWhereInput = {
      project: {
        is: {
          organizationId,
        },
      },
    };

    if (assigneeId) {
      where = { ...where, assigneeId };
    }

    if (reporterId) {
      where = { ...where, reporterId };
    }

    const issues = await db.issue.findMany({
      where,
      include: {
        assignee: true,
        reporter: true,
        project: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return issues;
  } catch (error) {
    console.error('Error fetching user issues:', error);
    throw new Error('Failed to fetch issues');
  }
}