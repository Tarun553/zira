"use server";

import React from 'react';
import { getOrganization } from '@/actions/organization';
import OrgSwitcher from '@/components/org-switcher';
import { ProjectList } from './_components/project-list';
import { redirect } from 'next/navigation';

const Organization = async ({ params }: { params: { orgId: string } }) => {
  let organization;
  try {
    organization = await getOrganization(params.orgId);
  } catch (error) {
    // Log the error for server-side debugging
    if (error instanceof Error) {
      console.error(`Error fetching organization ${params.orgId}:`, error.message);
      if (error.message === "Unauthorized") {
        redirect('/sign-in'); // Adjust '/sign-in' if your sign-in path is different
      }
    } else {
      console.error(`An unknown error occurred while fetching organization ${params.orgId}:`, error);
    }
    // For other errors (e.g., "User not found", DB issues), re-throw to be caught by Next.js error handling
    throw error;
  }

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <>
      <div className='container mx-auto'>
        <div className='flex justify-between items-center mb-10'>
          <h1>
            <span
              className="text-5xl font-extrabold tracking-tighter bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent select-none"
              style={{ fontFamily: "'Geist', 'Inter', sans-serif", letterSpacing: '-0.03em' }}
            >
              {organization.name}’s Projects
            </span>
          </h1>
          {/* org switcher */}
          <OrgSwitcher />
        </div>
      </div>
      <div className='mb-4'>
        <ProjectList orgId={organization.id} />
      </div>

      <div className='mt-8'>show user assigned and reported issues</div>


    </>
  );
};

export default Organization;
