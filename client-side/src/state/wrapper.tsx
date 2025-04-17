"use client"
import React from 'react'

const StateWrapper:React.FC<{children:React.ReactNode}> = ({children}) => {
  return (
    <div>
        {children}
    </div>
  )
}

export default StateWrapper