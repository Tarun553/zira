"use client"
import React from 'react'
import { OrganizationSwitcher, SignedIn, useOrganization, useUser } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

function OrgSwitcher() {
    const {isLoaded} = useUser();
    const {isLoaded: isUserLoaded} = useOrganization();
    const pathname = usePathname();

    if(!isLoaded || !isUserLoaded){
        return null;
    }
    
  return (
    <div>
        <SignedIn>
            <OrganizationSwitcher
            hidePersonal
            afterCreateOrganizationUrl="/organization/:slug"
            afterSelectOrganizationUrl="/organization/:slug"
            createOrganizationMode={
                pathname === '/onboarding' ? "navigation" : undefined
            }
            createOrganizationUrl="/onboarding"
            appearance={{
                elements: {
                    organizationSwitcherTrigger:
                        "py-2 px-4 text-sm font-medium text-gray-700 bg-transparent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md",
                    organizationSwitcherTriggerIcon: "ml-2 text-gray-500",
                }
            }}
           />
        </SignedIn>
    </div>
  )
}

export default OrgSwitcher