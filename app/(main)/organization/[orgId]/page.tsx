"use server";

import React from 'react';
import { getOrganization } from '@/actions/organization';

import { getIssuesByUser } from '@/actions/issues';
import OrgSwitcher from '@/components/org-switcher';
import { ProjectList } from './_components/project-list';
import {UserIssues} from '../_components/user-issues';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';  

const Organization = async ({ params }: { params: { orgId: string } }) => {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  let organization;
  let assignedIssues = [];
  let reportedIssues = [];

  try {
    organization = await getOrganization(params.orgId);
    
    // Fetch user's assigned and reported issues in parallel
    const [assigned, reported] = await Promise.all([
      getIssuesByUser({
        organizationId: params.orgId,
        assigneeId: userId,
      }),
      getIssuesByUser({
        organizationId: params.orgId,
        reporterId: userId,
      })
    ]);
    
    assignedIssues = assigned || [];
    reportedIssues = reported || [];
  } catch (error) {
    console.error('Error in organization page:', error);
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect('/sign-in');
    }
    throw error;
  }

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className='flex justify-between items-center mb-10'>
        <h1>
          <span
            className="text-5xl font-extrabold tracking-tighter bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent select-none"
            style={{ fontFamily: "'Geist', 'Inter', sans-serif", letterSpacing: '-0.03em' }}
          >
            {organization.name}&apos;s Projects
          </span>
        </h1>
        <OrgSwitcher />
      </div>
      
      <div className='mb-12'>
        <ProjectList orgId={organization.id} />
      </div>

      <div className='mt-12'>
        <UserIssues 
          assignedIssues={assignedIssues} 
          reportedIssues={reportedIssues}
          
        />
      </div>
    </div>
  );
};

export default Organization;
