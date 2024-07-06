'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowUp, Check, Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from "framer-motion"
import ProgressBar from '../_components/onboarding/progress-bar';
import { api } from '@/trpc/react';
import { useRouter } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react';
import { toast } from "react-toastify";

const OnboardingPage = () => {
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        livesIn: '',
        buyerOrSellerAgent: '',
        teamOrSoloAgent: '',
        brokerageName: '',
        goal: '',
        usingSocialMediaToGenerateLeads: '',
    });

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Focus the input field when the currentQuestion changes
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [currentQuestion]);

    const addOnboarding = api.auth.addOnboarding.useMutation();
    // const addOnboarding = api.auth.addOnboarding.useMutation({
    //     onSuccess: async () => {
    //         await refreshSession();
    //     },
    // });

    const handleChange = (field, value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [field]: value
        }));
    };

    const handleNextStep = async (field, value) => {
        handleChange(field, value);
    
        setTimeout(async () => {
            if (currentQuestion === 7) {
                setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    
                const transformedData = {
                    ...formData,
                    [field]: value,
                    onboardedName: formData.name,
                    name: undefined,
                };
                delete transformedData.name;
    
                try {
                    const session = await getSession(); // Retrieve the session data
                    const userId = session?.user?.id;
    
                    try {
                        await addOnboarding.mutateAsync(transformedData);
                    } catch (error) {
                        console.error('Failed to mutate onboarding data', error);
                        toast.error('Failed to save onboarding data. Please try again.');
                        return;
                    }
    
                    try {
                        const response = await fetch('https://kyndom-ai-api.onrender.com/chat', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ message: generatePrompt(transformedData), stream: false, user_id: userId, new: true, template_title: "Onboarding" }),
                        });
    
                        if (!response.ok) {
                            throw new Error(`Server responded with ${response.status}`);
                        }
                    } catch (error) {
                        console.error('Failed to submit onboarding data', error);
                        toast.error('Failed to submit onboarding data. Please try again.');
                    }
    
                } catch (error) {
                    console.error('Failed to retrieve session data', error);
                    toast.error('Failed to retrieve session data. Please log in again.');
                }
            } else {
                setCurrentQuestion((prevQuestion) => prevQuestion + 1);
            }
        }, 1000);
    };    

    // const handleNextStep = async (field, value) => {
    //     handleChange(field, value);

    //     setTimeout(async () => {
    //         if (currentQuestion === 7) {
    //             setCurrentQuestion((prevQuestion) => prevQuestion + 1);

    //             const transformedData = {
    //                 ...formData,
    //                 [field]: value,
    //                 onboardedName: formData.name,
    //                 name: undefined,
    //             };
    //             delete transformedData.name;

    //             try {
    //                 const session = await getSession(); // Retrieve the session data
    //                 const userId = session?.user?.id;
    //                 await addOnboarding.mutateAsync(transformedData);
    //                 const response = await fetch('https://kyndom-ai-api.onrender.com/chat', {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                     body: JSON.stringify({ message: generatePrompt(transformedData), stream: false, user_id: userId }),
    //                 });
    //             } catch (error) {
    //                 console.error('Failed to submit onboarding data', error);
    //             }
    //         } else {
    //             setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    //         }
    //     }, 1000);
    // };


    const QuestionHeader = ({ questionText }) => (
        <h2 className="font-elmessiri text-2xl sm:text-3xl font-medium">
            {currentQuestion === 1 && (
                <>
                    Hello! I’m AI Agent.
                    <Image
                        src='/high-five.svg'
                        alt='icon'
                        width={40}
                        height={40}
                        className='inline-block ml-1'
                    />
                    <br />
                </>
            )}
            <span className='text-3xl sm:text-4xl'>{questionText}</span>
        </h2>
    );

    const renderQuestion = (questionText, fieldName, placeholder) => (
        <>
            <AnimatePresence>
                <motion.div
                    key={currentQuestion}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    exit={{ y: -100, opacity: 0 }}
                >
                    <QuestionHeader questionText={questionText} />
                    <div className='w-full h-[54px] rounded-[30px] bg-[#f3f5f8] border border-[#c3c3c3] outline-none mt-12 flex items-center justify-between shadow-sm'>
                        <div className='py-2.5 px-4 pl-5 w-full h-full'>
                            <input
                                ref={inputRef}
                                type="text"
                                className='w-full h-full outline-none border-none bg-transparent'
                                placeholder={placeholder}
                                value={formData[fieldName]}
                                onChange={(e) => handleChange(fieldName, e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && formData[fieldName].length >= 3) {
                                        setCurrentQuestion((prevQuestion) => prevQuestion + 1)
                                    }
                                }}
                            />
                        </div>
                        <button
                            className='w-9 h-9 min-w-9 min-h-9 m-2 rounded-full flex justify-center items-center disabled:cursor-auto disabled:bg-[#e2e2e2] disabled:text-gray-500 bg-green-900 text-white transition-all'
                            onClick={() => setCurrentQuestion((prevQuestion) => prevQuestion + 1)}
                            disabled={formData[fieldName].length < 3}
                        >
                            <ArrowUp />
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </>
    );

    const Option = ({ fieldName, optionValue, labelText, index }) => (
        <li
            className={` ${formData[fieldName] === optionValue ? 'bg-[#e3e6e9]' : 'bg-[#f2f4f7]'}
                    border border-[#c3c3c3] w-full h-[54px] rounded-[30px] flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all
                  `}
            onClick={() => handleNextStep(fieldName, optionValue)}
        >
            <div className='flex items-center gap-2'>
                <span className='w-9 h-9 min-w-9 min-h-9 m-2 rounded-full flex justify-center items-center border border-[#c3c3c3] text-[#ababab]'>
                    {index === 0 ? 'A' : 'B'}
                </span>
                {labelText}
            </div>
            <span
                className={`text-green-900 w-8 h-8 min-w-8 min-h-8 m-2 rounded-full justify-center items-center border border-green-900 ${formData[fieldName] === optionValue ? 'flex' : 'hidden'} transition-all`}
            >
                <Check />
            </span>
        </li>
    );

    const renderOptions = (questionText, fieldName, options) => (
        <>
            <AnimatePresence>
                <motion.div
                    key={currentQuestion}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    exit={{ y: -100, opacity: 0 }}
                >
                    <QuestionHeader questionText={questionText} />
                    <ul className='mt-12 flex flex-col gap-4 w-full'>
                        {options.map((option, index) => (
                            <Option key={index} fieldName={fieldName} optionValue={option.value} labelText={option.label} index={index} />
                        ))}
                    </ul>
                </motion.div>
            </AnimatePresence>
        </>
    );

    const generatePrompt = (formData) => {
        let agentType;
        if (formData.teamOrSoloAgent === 'Working with a team' && formData.buyerOrSellerAgent === 'Buyer Agent') {
            agentType = 'with a team as a buyer agent';
        } else if (formData.teamOrSoloAgent === 'Working as a Solo Agent' && formData.buyerOrSellerAgent === 'Buyer Agent') {
            agentType = 'as a solo buyer agent';
        } else if (formData.teamOrSoloAgent === 'Working as a Solo Agent' && formData.buyerOrSellerAgent === 'Seller Agent') {
            agentType = 'as a solo seller agent';
        } else if (formData.teamOrSoloAgent === 'Working with a team' && formData.buyerOrSellerAgent === 'Seller Agent') {
            agentType = 'with a team as a seller agent';
        }

        const socialMediaUsage = formData.usingSocialMediaToGenerateLeads === 'Yes' ? 'using social media to generate leads' : 'not using social media to generate leads';

        return `
            I am sharing important details about my profile. Please store this information:
            My name is ${formData.onboardedName}. I live in ${formData.livesIn}. I work ${agentType}. My brokerage is named ${formData.brokerageName}. My goal for this year is to ${formData.goal}. I am ${socialMediaUsage}.
        `;
        // return `
        //     I am providing important information about myself. Please save this information in your memory:
        //     My name is ${formData.onboardedName}. I live in ${formData.livesIn}. I work ${agentType}. My brokerage is named ${formData.brokerageName}. My goal for this year is to ${formData.goal}. I am ${socialMediaUsage}.
        // `;
    };

    return (
        <>
            {currentQuestion > 0 && <ProgressBar currentStep={currentQuestion} totalSteps={7} />}
            <div className='w-[90%] ml-auto mr-auto'>
                {currentQuestion > 1 && currentQuestion !== 8 ? (
                    <div className='mb-10 mt-12 w-full sm:w-[500px] max-w-[500px] ml-auto mr-auto'>
                        <button
                            className='w-9 h-9 min-w-9 min-h-9 rounded-full flex justify-center items-center bg-slate-200/55 shadow-sm hover:shadow-md transition-all'
                            onClick={() => setCurrentQuestion((prevQuestion) => prevQuestion - 1)}
                        >
                            <ArrowLeft />
                        </button>
                    </div>
                ) : (
                    currentQuestion !== 0 && (
                        <div className='mb-10 mt-12'>
                            <div className='w-9 h-9 min-w-9 min-h-9' />
                        </div>
                    )
                )}
                {currentQuestion === 0 && (
                    <div className='min-h-screen flex justify-center items-center'>
                        <div className='flex flex-col items-center'>
                            <h1 className="font-elmessiri text-5xl sm:text-6xl font-semibold text-green-900 text-center">Start <span className='italic'>talking</span> to AI Agent</h1>
                            <p className='text-center mt-4 mb-14 max-w-[450px]'>
                                The more we get to know each other, the more I can
                                <br className='hidden sm:block' />
                                personally assist you.
                            </p>
                            <Button
                                size={"sm"}
                                className="rounded-full w-full xxs:w-64 py-6 shadow-sm hover:shadow-lg hover:scale-[1.05] transition-all"
                                onClick={() => setCurrentQuestion(1)}
                            // onClick={refreshSession}
                            >
                                Talk to Agent
                            </Button>
                        </div>
                    </div>
                )}
                {/* <ProgressBar /> */}
                <div className='flex justify-center'>
                    <div className='w-full sm:w-[500px] max-w-[500px]'>
                        {currentQuestion === 1 && renderQuestion("What’s your name?", "name", "Your first name")}
                        {currentQuestion === 2 && renderQuestion("Where you live?", "livesIn", "Where you live")}
                        {currentQuestion === 3 && renderOptions("Are you Buyer agent or Seller Agent?", "buyerOrSellerAgent", [
                            { value: 'Buyer Agent', label: 'Buyer Agent' },
                            { value: 'Seller Agent', label: 'Seller Agent' },
                        ])}
                        {currentQuestion === 4 && renderOptions("Are you working with a Team or Solo Agent?", "teamOrSoloAgent", [
                            { value: 'Working with a team', label: 'Working with a team' },
                            { value: 'Working as a Solo Agent', label: 'Working as a Solo Agent' },
                        ])}
                        {currentQuestion === 5 && renderQuestion("What's your Brokerage name?", "brokerageName", "Brokerage name")}
                        {currentQuestion === 6 && renderQuestion("What's your goal for this year?", "goal", "Goal for this year")}
                        {currentQuestion === 7 && renderOptions("Are you using Social Media to generate leads?", "usingSocialMediaToGenerateLeads", [
                            { value: 'Yes', label: 'Yes' },
                            { value: 'No', label: 'No' },
                        ])}
                        {currentQuestion === 8 && (
                            <AnimatePresence>
                                <motion.div
                                    key={currentQuestion}
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                    exit={{ y: -100, opacity: 0 }}
                                >
                                    <h1 className="font-elmessiri text-3xl xxs:text-4xl sm:text-6xl font-semibold text-green-900 uppercase text-center">Thanks for <span className='text-4xl xxs:text-5xl sm:text-7xl'>submission</span></h1>
                                    <Button
                                        size={"sm"}
                                        className="rounded-full w-full xxs:w-64 py-6 shadow-sm hover:shadow-lg hover:scale-[1.05] transition-all ml-auto mr-auto mt-10"
                                        disabled={!addOnboarding.isSuccess}
                                        onClick={() => router.push('/dashboard/home')}
                                    >
                                        Go To Home Page
                                    </Button>
                                    {addOnboarding.isLoading && (
                                        <div className='flex items-center justify-center gap-2 mt-6'>
                                            <div className="animate-spin">
                                                <Loader2Icon className="text-primary" size={25} />
                                            </div>
                                            Saving you data...
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default OnboardingPage;



// 'use client'

// import { Button } from '@/components/ui/button'
// import { ArrowLeft, ArrowUp, Check, MoveUp } from 'lucide-react';
// import Image from 'next/image';
// import React, { useState } from 'react'

// const OnboardingPage = () => {
//     const [currentQuestion, setCurrentQuestion] = useState(0);
//     const [formData, setFormData] = useState({
//         name: '',
//         livesIn: '',
//         buyerOrSellerAgent: '',
//         teamOrSoloAgent: '',
//         brokerageName: '',
//         goal: '',
//         usingSocialMediaToGenerateLeads: ''
//     });

//     const handleChange = (field, value) => {
//         setFormData(prevFormData => ({
//             ...prevFormData,
//             [field]: value
//         }));
//     };

//     const handleNextStep = (field, value) => {
//         handleChange(field, value);
//         setTimeout(() => {
//             setCurrentQuestion((prevQuestion) => prevQuestion + 1);
//         }, 1000); // 1000 ms delay (1 second)
//     };

//     return (
//         <>
//             {currentQuestion > 1 && (
//                 <div className='absolute left-[3%] top-10'>
//                     <button
//                         className='w-9 h-9 min-w-9 min-h-9 m-2 rounded-full flex justify-center items-center bg-slate-200/55 shadow-sm hover:shadow-md transition-all'
//                         onClick={() => setCurrentQuestion((prevQuestion) => prevQuestion - 1)}
//                     >
//                         <ArrowLeft />
//                     </button>
//                 </div>
//             )}
//             {currentQuestion === 0 && (
//                 <div className='min-h-screen flex justify-center items-center'>
//                     <div className='flex flex-col items-center'>
//                         <h1 className="font-elmessiri text-6xl font-semibold text-green-900">Start <span className='italic'>talking</span> to AI Agent</h1>
//                         <p className='text-center mt-4 mb-14'>
//                             The more we get to know each other, the more I can
//                             <br />
//                             personally assist you.
//                         </p>

//                         <Button
//                             size={"sm"}
//                             className="rounded-full w-64 py-6 shadow-sm hover:shadow-lg hover:scale-[1.05] transition-all"
//                             onClick={() => setCurrentQuestion(1)}
//                         >
//                             Talk to Agent
//                         </Button>
//                     </div>
//                 </div>
//             )}
//             <div className='flex justify-center pt-20'>
//                 <div className='w-[500px] max-w-[500px]'>
//                     {currentQuestion === 1 && (
//                         <>
//                             <h2 className="font-elmessiri text-3xl font-medium">
//                                 Hello!
//                                 I’m AI Agent.
//                                 <Image
//                                     src='/high-five.svg'
//                                     alt='icon'
//                                     width={40}
//                                     height={40}
//                                     className='inline-block ml-1'
//                                 />
//                                 <br />
//                                 <span className='text-4xl'>What’s your name?</span>
//                             </h2>
//                             <div className='w-full h-[54px] rounded-[30px] bg-white border-none outline-none mt-12 flex items-center justify-between shadow-sm'>
//                                 <div className='py-2.5 px-4 pl-5 w-full h-full'>
//                                     <input
//                                         type="text"
//                                         className='w-full h-full outline-none'
//                                         placeholder='Your first name'
//                                         value={formData.name}
//                                         onChange={(e) => handleChange('name', e.target.value)}
//                                     />
//                                 </div>
//                                 <button
//                                     className='w-9 h-9 min-w-9 min-h-9 m-2 rounded-full flex justify-center items-center disabled:cursor-auto disabled:bg-[#f5f5f5] disabled:text-gray-500 bg-green-900 text-white transition-all'
//                                     onClick={() => setCurrentQuestion((prevQuestion) => prevQuestion + 1)}
//                                     disabled={formData.name.length < 3}
//                                 >
//                                     <ArrowUp />
//                                 </button>
//                             </div>
//                         </>
//                     )}
//                     {currentQuestion === 2 && (
//                         <>
//                             <h2 className="font-elmessiri text-3xl font-medium">
//                                 Hello!
//                                 I’m AI Agent.
//                                 <Image
//                                     src='/high-five.svg'
//                                     alt='icon'
//                                     width={40}
//                                     height={40}
//                                     className='inline-block ml-1'
//                                 />
//                                 <br />
//                                 <span className='text-4xl'>Where you live?</span>
//                             </h2>
//                             <div className='w-full h-[54px] rounded-[30px] bg-white border border-[#e8e8e8] outline-none mt-12 flex items-center justify-between shadow-md shadow-[#dbdbdb]'>
//                                 <div className='py-2.5 px-4 pl-5 w-full h-full'>
//                                     <input
//                                         type="text"
//                                         className='w-full h-full outline-none'
//                                         placeholder='Where you live'
//                                         value={formData.livesIn}
//                                         onChange={(e) => handleChange('livesIn', e.target.value)}
//                                     />
//                                 </div>
//                                 <button
//                                     className='w-9 h-9 min-w-9 min-h-9 m-2 rounded-full flex justify-center items-center disabled:cursor-auto disabled:bg-[#f5f5f5] disabled:text-gray-500 bg-green-900 text-white transition-all'
//                                     onClick={() => setCurrentQuestion((prevQuestion) => prevQuestion + 1)}
//                                     disabled={formData.livesIn.length < 3}
//                                 >
//                                     <ArrowUp />
//                                 </button>
//                             </div>
//                         </>
//                     )}
//                     {currentQuestion === 3 && (
//                         <>
//                             <h2 className="font-elmessiri text-3xl font-medium">
//                                 Hello!
//                                 I’m AI Agent.
//                                 <Image
//                                     src='/high-five.svg'
//                                     alt='icon'
//                                     width={40}
//                                     height={40}
//                                     className='inline-block ml-1'
//                                 />
//                                 <br />
//                                 <span className='text-4xl'>Are you Buyer agent or Seller Agent</span>
//                             </h2>

//                             <ul className='mt-12 flex flex-col gap-4 w-full'>
//                                 <li
//                                     // className='border border-[#c3c3c3] bg-[#e3e6e9] w-[500px] h-[54px] rounded-[30px] flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all'
//                                     className={` ${formData.buyerOrSellerAgent === 'Buyer Agent' ? 'bg-[#e3e6e9]' : 'bg-[#f2f4f7]'}
//                                             border border-[#c3c3c3] bg-[#f2f4f7] w-full h-[54px] rounded-[30px] flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all
//                                           `}
//                                     onClick={() => handleNextStep('buyerOrSellerAgent', 'Buyer Agent')}
//                                 >
//                                     <div className='flex items-center gap-2'>
//                                         <span className='w-9 h-9 min-w-9 min-h-9 m-2 rounded-full flex justify-center items-center border border-[#c3c3c3] text-[#ababab]'>
//                                             A
//                                         </span>
//                                         Buyer Agent
//                                     </div>
//                                     <span
//                                         className={`text-green-900 w-8 h-8 min-w-8 min-h-8 m-2 rounded-full justify-center items-center border border-green-900 ${formData.buyerOrSellerAgent === 'Buyer Agent' ? 'flex animate-fade-in' : 'hidden'} transition-all`}
//                                     >
//                                         <Check />
//                                     </span>
//                                 </li>
//                                 <li
//                                     // className='border border-[#c3c3c3] bg-[#e3e6e9] w-[500px] h-[54px] rounded-[30px] flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all'
//                                     className={`${formData.buyerOrSellerAgent === 'Seller Agent' ? 'bg-[#e3e6e9]' : 'bg-[#f2f4f7]'}
//                                             border border-[#c3c3c3] bg-[#f2f4f7] w-full h-[54px] rounded-[30px] flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all
//                                           `}
//                                     onClick={() => handleNextStep('buyerOrSellerAgent', 'Seller Agent')}
//                                 >
//                                     <div className='flex items-center gap-2'>
//                                         <span className='w-9 h-9 min-w-9 min-h-9 m-2 rounded-full flex justify-center items-center border border-[#c3c3c3] text-[#ababab]'>
//                                             A
//                                         </span>
//                                         Seller Agent
//                                     </div>
//                                     <span
//                                         className={`text-green-900 w-8 h-8 min-w-8 min-h-8 m-2 rounded-full justify-center items-center border border-green-900 ${formData.buyerOrSellerAgent === 'Seller Agent' ? 'flex animate-fade-in' : 'hidden'} transition-all`}
//                                     >
//                                         <Check />
//                                     </span>
//                                 </li>
//                             </ul>
//                         </>
//                     )}
//                     {currentQuestion === 4 && (
//                         <>
//                             <h2 className="font-elmessiri text-3xl font-medium">
//                                 Hello!
//                                 I’m AI Agent.
//                                 <Image
//                                     src='/high-five.svg'
//                                     alt='icon'
//                                     width={40}
//                                     height={40}
//                                     className='inline-block ml-1'
//                                 />
//                                 <br />
//                                 <span className='text-4xl'>Are you working with a Team or Solo Agent</span>
//                             </h2>

//                             <ul className='mt-12 flex flex-col gap-4 w-full'>
//                                 <li
//                                     // className='border border-[#c3c3c3] bg-[#e3e6e9] w-full h-[54px] rounded-[30px] flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all'
//                                     className={` ${formData.teamOrSoloAgent === 'Working with a team' ? 'bg-[#e3e6e9]' : 'bg-[#f2f4f7]'}
//                                             border border-[#c3c3c3] bg-[#f2f4f7] w-full h-[54px] rounded-[30px] flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all
//                                           `}
//                                     onClick={() => handleNextStep('teamOrSoloAgent', 'Working with a team')}
//                                 >
//                                     <div className='flex items-center gap-2'>
//                                         <span className='w-9 h-9 min-w-9 min-h-9 m-2 rounded-full flex justify-center items-center border border-[#c3c3c3] text-[#ababab]'>
//                                             A
//                                         </span>
//                                         Working with a team
//                                     </div>
//                                     <span
//                                         className={`text-green-900 w-8 h-8 min-w-8 min-h-8 m-2 rounded-full justify-center items-center border border-green-900 ${formData.teamOrSoloAgent === 'Working with a team' ? 'flex' : 'hidden'} transition-all`}
//                                     >
//                                         <Check />
//                                     </span>
//                                 </li>
//                                 <li
//                                     className={` ${formData.teamOrSoloAgent === 'Working with a Solo team' ? 'bg-[#e3e6e9]' : 'bg-[#f2f4f7]'}
//                                             border border-[#c3c3c3] bg-[#f2f4f7] w-full h-[54px] rounded-[30px] flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all
//                                           `}
//                                     onClick={() => handleNextStep('teamOrSoloAgent', 'Working with a Solo Agent')}
//                                 >
//                                     <div className='flex items-center gap-2'>
//                                         <span className='w-9 h-9 min-w-9 min-h-9 m-2 rounded-full flex justify-center items-center border border-[#c3c3c3] text-[#ababab]'>
//                                             A
//                                         </span>
//                                         Solo Agent
//                                     </div>
//                                     <span
//                                         className={`text-green-900 w-8 h-8 min-w-8 min-h-8 m-2 rounded-full justify-center items-center border border-green-900 ${formData.teamOrSoloAgent === 'Working with a Solo Agent' ? 'flex' : 'hidden'} transition-all`}
//                                     >
//                                         <Check />
//                                     </span>
//                                 </li>
//                             </ul>
//                         </>
//                     )}
//                     {currentQuestion === 5 && (
//                         <>
//                             <h2 className="font-elmessiri text-3xl font-medium">
//                                 Hello!
//                                 I’m AI Agent.
//                                 <Image
//                                     src='/high-five.svg'
//                                     alt='icon'
//                                     width={40}
//                                     height={40}
//                                     className='inline-block ml-1'
//                                 />
//                                 <br />
//                                 <span className='text-4xl'>Whats your Brokerage name?</span>
//                             </h2>
//                             <div className='w-full h-[54px] rounded-[30px] bg-white border border-[#e8e8e8] outline-none mt-12 flex items-center justify-between shadow-md shadow-[#dbdbdb]'>
//                                 <div className='py-2.5 px-4 pl-5 w-full h-full'>
//                                     <input
//                                         type="text"
//                                         className='w-full h-full outline-none'
//                                         placeholder='Brokerage name'
//                                         value={formData.brokerageName}
//                                         onChange={(e) => handleChange('brokerageName', e.target.value)}
//                                     />
//                                 </div>
//                                 <button
//                                     className='w-9 h-9 min-w-9 min-h-9 m-2 rounded-full flex justify-center items-center disabled:cursor-auto disabled:bg-[#f5f5f5] disabled:text-gray-500 bg-green-900 text-white transition-all'
//                                     onClick={() => setCurrentQuestion((prevQuestion) => prevQuestion + 1)}
//                                     disabled={formData.brokerageName.length < 3}
//                                 >
//                                     <ArrowUp />
//                                 </button>
//                             </div>
//                         </>
//                     )}
//                     {currentQuestion === 6 && (
//                         <>
//                             <h2 className="font-elmessiri text-3xl font-medium">
//                                 Hello!
//                                 I’m AI Agent.
//                                 <Image
//                                     src='/high-five.svg'
//                                     alt='icon'
//                                     width={40}
//                                     height={40}
//                                     className='inline-block ml-1'
//                                 />
//                                 <br />
//                                 <span className='text-4xl'>What's your goal for this year?</span>
//                             </h2>
//                             <div className='w-full h-[54px] rounded-[30px] bg-white border border-[#e8e8e8] outline-none mt-12 flex items-center justify-between shadow-md shadow-[#dbdbdb]'>
//                                 <div className='py-2.5 px-4 pl-5 w-full h-full'>
//                                     <input
//                                         type="text"
//                                         className='w-full h-full outline-none'
//                                         placeholder='Goal for this year'
//                                         value={formData.goal}
//                                         onChange={(e) => handleChange('goal', e.target.value)}
//                                     />
//                                 </div>
//                                 <button
//                                     className='w-9 h-9 min-w-9 min-h-9 m-2 rounded-full flex justify-center items-center disabled:cursor-auto disabled:bg-[#f5f5f5] disabled:text-gray-500 bg-green-900 text-white transition-all'
//                                     onClick={() => setCurrentQuestion((prevQuestion) => prevQuestion + 1)}
//                                     disabled={formData.goal.length < 3}
//                                 >
//                                     <ArrowUp />
//                                 </button>
//                             </div>
//                         </>
//                     )}
//                     {currentQuestion === 7 && (
//                         <>
//                             <h2 className="font-elmessiri text-3xl font-medium">
//                                 Hello!
//                                 I’m AI Agent.
//                                 <Image
//                                     src='/high-five.svg'
//                                     alt='icon'
//                                     width={40}
//                                     height={40}
//                                     className='inline-block ml-1'
//                                 />
//                                 <br />
//                                 <span className='text-4xl'>Are you using Social Media to generate leads?</span>
//                             </h2>

//                             <ul className='mt-12 flex flex-col gap-4 w-full'>
//                                 <li
//                                     className={` ${formData.usingSocialMediaToGenerateLeads === 'Buyer Agent' ? 'bg-[#e3e6e9]' : 'bg-[#f2f4f7]'}
//                                             border border-[#c3c3c3] bg-[#f2f4f7] w-full h-[54px] rounded-[30px] flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all
//                                           `}
//                                     onClick={() => handleNextStep('usingSocialMediaToGenerateLeads', 'Yes')}
//                                 >
//                                     <div className='flex items-center gap-2'>
//                                         <span className='w-9 h-9 min-w-9 min-h-9 m-2 rounded-full flex justify-center items-center border border-[#c3c3c3] text-[#ababab]'>
//                                             A
//                                         </span>
//                                         Yes
//                                     </div>
//                                     <span
//                                         className={`text-green-900 w-8 h-8 min-w-8 min-h-8 m-2 rounded-full justify-center items-center border border-green-900 ${formData.usingSocialMediaToGenerateLeads === 'Yes' ? 'flex animate-fade-in' : 'hidden'} transition-all`}
//                                     >
//                                         <Check />
//                                     </span>
//                                 </li>
//                                 <li
//                                     className={`${formData.usingSocialMediaToGenerateLeads === 'Seller Agent' ? 'bg-[#e3e6e9]' : 'bg-[#f2f4f7]'}
//                                             border border-[#c3c3c3] bg-[#f2f4f7] w-full h-[54px] rounded-[30px] flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all
//                                           `}
//                                     onClick={() => handleNextStep('usingSocialMediaToGenerateLeads', 'No')}
//                                 >
//                                     <div className='flex items-center gap-2'>
//                                         <span className='w-9 h-9 min-w-9 min-h-9 m-2 rounded-full flex justify-center items-center border border-[#c3c3c3] text-[#ababab]'>
//                                             A
//                                         </span>
//                                         No
//                                     </div>
//                                     <span
//                                         className={`text-green-900 w-8 h-8 min-w-8 min-h-8 m-2 rounded-full justify-center items-center border border-green-900 ${formData.usingSocialMediaToGenerateLeads === 'No' ? 'flex animate-fade-in' : 'hidden'} transition-all`}
//                                     >
//                                         <Check />
//                                     </span>
//                                 </li>
//                             </ul>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </>
//     )
// }

// export default OnboardingPage