"use client"
import { UserButton } from '@clerk/nextjs'
import { ChartNoAxesGantt } from 'lucide-react'
import React from 'react'

function UserMenu() {
  return (
    <UserButton appearance={{
      elements: {
        userButtonPopover: {
          backgroundColor: '#111827',
        },
        avatarBox: 'w-14 h-14',
      },
    }}>
      <UserButton.MenuItems>
        <UserButton.Link label="my Organisation"
        labelIcon={<ChartNoAxesGantt/>}
        href="/onboarding"
        />
       
      </UserButton.MenuItems>
    </UserButton>
  );
}

export default UserMenu