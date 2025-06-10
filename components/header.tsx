import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { PenBox } from 'lucide-react'
import UserMenu from './user-menu'
import { SparklesText } from './ui/sparkles-text'
import { ModeToggle } from './ui/mode-toggle'

function Header() {
  return (
    <header className='flex justify-between items-center p-4'>
      <nav className='flex items-center gap-4'>
        <Link href="/" >
          <SparklesText text="zira" />
        </Link>
      </nav>

      <div className='flex items-center gap-4'>
        <Link href="/onboarding">
          <Button variant="destructive"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          
          >  <PenBox size={18} />
            Create project
          </Button>
        </Link>

        <ModeToggle />

        <SignedOut>
          <SignInButton forceRedirectUrl="/onboarding">
            <Button variant="outline">Login</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserMenu />
        </SignedIn>
      </div>
    </header>
  )
}

export default Header