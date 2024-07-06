import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const ProgressBar = ({ currentStep, totalSteps }) => {
    const progressPercentage = ((currentStep - 1) / totalSteps) * 100; // Adjust calculation if needed

    return (
        <div className="h-full w-full">
            <div className='w-[100%] h-[5px] bg-green-600/20 rounded-md relative'>
                <motion.div
                    style={{ width: `${progressPercentage}%` }}
                    className={`absolute w-[100%] h-[100%] bg-green-600 rounded-md transition-all`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{
                        duration: 0.3,
                        ease: 'easeOut'
                    }}
                ></motion.div>
            </div>
            {/* <div className="w-full sm:w-[500px] max-w-[500px] mx-auto">
                <div className="bg-gray-200 h-1 flex items-center justify-between relative">
                    <div className="absolute top-0 left-0 bg-indigo-700 h-1 transition-all" style={{ width: `${progressPercentage > 100 ? 100 : progressPercentage}%` }}></div>
                    {[...Array(totalSteps)].map((_, index) => (
                        <div key={index} className={`flex items-center ${index < totalSteps - 1 ? 'w-full' : ''}`}>
                            <div className={`h-6 w-6 rounded-full shadow flex items-center justify-center transition-all ${index < currentStep ? 'bg-indigo-700 text-white' : 'bg-white text-gray-500'} ${index === currentStep - 1 ? 'border-2 border-indigo-700' : ''}`}>
                                {index < currentStep - 1 && (
                                    <Check className='text-white z-50 w-4 h-4' />
                                )}
                                {index === currentStep - 1 && (
                                    <div className="h-3 w-3 bg-white rounded-full z-50"></div>
                                )}
                            </div>
                            {index < totalSteps - 1 && <div className="flex-1 h-1 bg-gray-200"></div>}
                        </div>
                    ))}
                </div>
            </div> */}
        </div>
    );
};

export default ProgressBar;


// import React from 'react';
// import { Check } from 'lucide-react';

// const ProgressBar = ({ currentStep, totalSteps }) => {
//     const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100; // Adjust calculation if needed

//     return (
//         <div className="h-full w-full pt-20">
//             {/* <div className="container mx-auto"> */}
//                 <div className="w-full sm:w-[500px] max-w-[500px] mx-auto">
//                     <div className="bg-gray-200 h-1 flex items-center justify-between relative">
//                         <div className="absolute top-0 left-0 bg-indigo-700 h-1 transition-all" style={{ width: `${progressPercentage > 100 ? 100 : progressPercentage}%` }}></div>
//                         {[...Array(totalSteps)].map((_, index) => (
//                             <div key={index} className={`flex items-center ${index < totalSteps - 1 ? 'w-full' : ''}`}>
//                                 <div className={`h-6 w-6 rounded-full shadow flex items-center justify-center transition-all ${index < currentStep ? 'bg-indigo-700 text-white' : 'bg-white text-gray-500'} ${index === currentStep - 1 ? 'border-2 border-indigo-700' : ''}`}>
//                                     {index < currentStep - 1 && (
//                                         <Check className='text-white z-50 w-4 h-4' />
//                                     )}
//                                     {index === currentStep - 1 && (
//                                         <div className="h-3 w-3 bg-white rounded-full z-50"></div>
//                                     )}
//                                 </div>
//                                 {index < totalSteps - 1 && <div className="flex-1 h-1 bg-gray-200"></div>}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             {/* </div> */}
//         </div>
//     );
// };

// export default ProgressBar;