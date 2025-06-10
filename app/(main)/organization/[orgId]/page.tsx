"use client"
import React from 'react'

const Organization = ({params}: {params: {orgId: string}}) => {
   
  return (
    <div>{params.orgId}</div>
  )
}

export default Organization