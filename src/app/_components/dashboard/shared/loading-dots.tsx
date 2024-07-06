import React from 'react'

const LoadingDots = () => {
    return (
        <div className='flex items-center gap-[5px] h-5 mb-2'>
            <div className='w-1 h-1 bg-black/70 rounded-full custom-bounce' style={{ animationDelay: '-0.3s' }}/>
            <div className='w-1 h-1 bg-black/70 rounded-full custom-bounce' style={{ animationDelay: '-0.15s' }}/>
            <div className='w-1 h-1 bg-black/70 rounded-full custom-bounce' />
            {/* <div className='h-1 w-1 bg-black/70 rounded-full custom-bounce' style={{ animationDelay: '-0.3s' }}></div>
            <div className='h-1 w-1 bg-black/70 rounded-full custom-bounce' style={{ animationDelay: '-0.15s' }}></div>
            <div className='h-1 w-1 bg-black/70 rounded-full custom-bounce'></div> */}
        </div>
    )
}

export default LoadingDots