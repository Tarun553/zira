"use client"
import { OrganizationList, useOrganization } from '@clerk/nextjs'
import React, { useEffect } from 'react'
import { useRouter } from "next/navigation"
import Link from "next/link"

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
            <OrganizationList hidePersonal />
        </div>

    )
}

export default Onboarding