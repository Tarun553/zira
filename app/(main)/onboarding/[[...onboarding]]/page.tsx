"use client"
import { OrganizationList, useOrganization } from '@clerk/nextjs'
import React, { useEffect } from 'react'
import { useRouter } from "next/navigation"

const Onboarding = () => {
    const { organization } = useOrganization();
    const router = useRouter();
    useEffect(() => {
        if (organization) {
            router.push(`/organization/${organization.slug}`)
        }
    }, [organization, router])
    return (

        <div className="flex justify-center items-center mb-10">
            <OrganizationList hidePersonal
            afterCreateOrganizationUrl="/organization/:slug"
            afterSelectOrganizationUrl="/organization/:slug"
            />
        </div>

    )
}

export default Onboarding