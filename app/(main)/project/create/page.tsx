"use client"
import { useState, useEffect } from 'react'
import {useOrganization, useUser} from "@clerk/nextjs";
import OrgSwitcher from '@/components/org-switcher';


function CreateProjectPage() {
  const { isLoaded: isOrgLoaded, membership } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);


  

  useEffect(() => {
    if (isOrgLoaded && isUserLoaded && membership) {
    
      setIsAdmin(membership.role === "org:admin");
      
    }
  }, [isOrgLoaded, isUserLoaded, membership]);

  if (!isOrgLoaded || !isUserLoaded) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="max-w-lg space-y-6 text-center">
          <span
            className="my-4 animate-pulse bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-2xl font-extrabold tracking-tighter text-transparent select-none md:text-4xl"
            style={{
              fontFamily: "'Geist', 'Inter', sans-serif",
              letterSpacing: "-0.03em",
            }}
          >
            Oops! Only Admins can create projects
          </span>
          <div className="space-y-2">
            <p className="text-lg">
              You are not authorized to create a project in this organization.
            </p>
            <p className="text-sm text-muted-foreground">
              Please switch to an organization where you have admin privileges.
            </p>
          </div>
          <OrgSwitcher />
        </div>
      </div>
    );
  }

  return (
    <div>
     <span
            className="my-4 hover:animate-pulse bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-6xl font-extrabold tracking-tighter text-transparent select-none md:text-6xl text-center"
            style={{
              fontFamily: "'Geist', 'Inter', sans-serif",
              letterSpacing: "-0.03em",
            }}
          >
           create new project
          </span>

      <form>
        
      </form>
    </div>
  );
}

export default CreateProjectPage;