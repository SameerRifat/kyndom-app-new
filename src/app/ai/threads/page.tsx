import React from 'react'

const ThreadsPage = () => {
  return (
    <div>ThreadsPage</div>
  )
}

export default ThreadsPage

// 'use client'

// import React, { useState } from 'react'
// import { Icon } from '@iconify/react'
// import MainThread from '@/app/_components/threads/main-thread'
// import { Sheet, SheetContent } from '@/components/ui/sheet'
// import SidebarContent from '@/app/_components/threads/sidebar-content'

// const ThreadsPage = () => {
//     const [mobileNavExpanded, setMobileNavExpanded] = useState(false)
//     console.log('mobileNavExpanded: ', mobileNavExpanded)
//     return (
//         <>
//             <div className='flex w-full h-screen font-elmessiri'>
//                 {!mobileNavExpanded && (
//                     <div className='w-[375px] min-w-[375px] hidden lg:block border-r border-gray-300 pt-10 px-4 sm:px-6 relative custom_thumb'>
//                         <SidebarContent mobileNavExpanded={mobileNavExpanded}/>
//                     </div>
//                 )}
//                 <MainThread mobileNavExpanded={mobileNavExpanded} setMobileNavExpanded={setMobileNavExpanded} />
//             </div>
//             {mobileNavExpanded && (
//                 <Sheet
//                     open={mobileNavExpanded}
//                     onOpenChange={setMobileNavExpanded}
//                 >
//                     <SheetContent
//                         side="left"
//                         className="border-r-0 bg-gray-50 px-0"
//                         closePosition='left'
//                     >
//                         <button className='absolute left-4 sm:left-6 top-4 bg-slate-300/35 rounded-full p-1 flex justify-center items-center cursor-pointer z-50'
//                             onClick={() => setMobileNavExpanded((prevState) => !prevState)}
//                         >
//                             <Icon icon="mingcute:close-fill" fontSize={18} />
//                         </button>
//                         <div className='w-full block lg:hidden pt-10 px-4 sm:px-6 relative custom_thumb'>
//                             <SidebarContent mobileNavExpanded={mobileNavExpanded}/>
//                         </div>
//                     </SheetContent>
//                 </Sheet>
//             )}
//         </>
//     )
// }

// export default ThreadsPage
