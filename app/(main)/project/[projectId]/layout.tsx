import React,{Suspense} from 'react'
import {BarLoader} from 'react-spinners'
const ProjectLayout = async ({children}: {children: React.ReactNode}) => {
  return (
    <div className='mx-auto'>
      <Suspense fallback={<BarLoader width={100} />}>{children}
      </Suspense>
      </div>
  )
}

export default ProjectLayout