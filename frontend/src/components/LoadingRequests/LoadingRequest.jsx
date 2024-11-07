import React from 'react'

function LoadingRequest() {
  return (
    <div className='flex items-center w-full h-full min-h-[50px] justify-center'>
        <div className="flex gap-2">
          <div className="w-[1rem] h-[1rem] rounded-full animate-pulse bg-blue-600"></div>
          <div className="w-[1rem] h-[1rem] rounded-full animate-pulse bg-blue-600"></div>
          <div className="w-[2rem] h-[1rem] rounded-full animate-pulse bg-blue-600"></div>
        </div>
    </div>
  )
}

export default LoadingRequest
