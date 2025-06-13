"use server";

import React from 'react';
import { getOrganization } from '@/actions/organization';
import OrgSwitcher from '@/components/org-switcher';

const Organization = async ({ params }: { params: { orgId: string } }) => {
  const organization = await getOrganization(params.orgId);
  // console.log(organization);

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
      <OrgSwitcher/>
      </div>
    </div>
    <div className='mb-4'>show org projects</div>

    <div className='mt-8'>show user assigned and reported issues</div>
    
      
    </>
  );
};

export default Organization;
