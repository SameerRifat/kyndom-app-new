'use client'

import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
} from "@/components/ui/dialog";
import { Icon } from '@iconify/react';
import SidebarContent from '../../threads/sidebar-content';
import MainThread from '../../threads/main-thread';
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { getSession } from 'next-auth/react';
import { toast } from "react-toastify";
import { fetchChatHistory, fetchThreadsData } from '@/lib/threads/fetchThreads';

type ChatEntry = {
    role: string;
    content: string;
};

type AssistantData = {
    template_id: string | null;
    template_title: string | null;
};

type RowData = {
    run_id: string;
    assistant_data: AssistantData;
    memory: string; 
};

type RunInfo = {
    run_id: string;
    template_id: string | null;
    template_title: string | null;
    last_response: string | null;
};

interface Message {
    role: "user" | "assistant";
    content: string;
    metrics: {};
}


const ChatDialog = ({ isOpen, setIsOpen, template }) => {
    const [mobileNavExpanded, setMobileNavExpanded] = useState(false)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [runIds, setRunIds] = useState<RunInfo[]>([]);
    const [selectedRunId, setSelectedRunId] = useState('')
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [isChatHistoryLoading, setIsChatHistoryLoading] = useState<boolean>(false);
    const [newRunId, setNewRunId] = useState<RunInfo>()
    const [newChat, setNewChat] = useState<boolean>(false);

    const fetchRunInfo = async () => {
        try {
            const session = await getSession();
            const userId = session?.user?.id;

            setIsLoading(true);

            const data: RowData[] = await fetchThreadsData(userId); 

            const runInfoList: RunInfo[] = data.map((row) => {
                const { run_id, assistant_data, memory } = row;

                // Parse the memory JSON string
                let chatHistory: ChatEntry[];
                try {
                    chatHistory = JSON.parse(memory);
                } catch (error) {
                    console.error(`Failed to parse memory for run_id ${run_id}:`, error);
                    chatHistory = [];
                }

                // Find the last response from the assistant in chatHistory
                const lastResponse = chatHistory
                    .slice() // Create a copy of the array
                    .reverse()
                    .find((entry) => entry.role === 'assistant')?.content || null;

                return {
                    run_id,
                    template_id: assistant_data?.template_id || null,
                    template_title: assistant_data?.template_title || null,
                    last_response: lastResponse
                };
            });

            setRunIds(runInfoList)


        } catch (error) {
            if (error instanceof Error) {
                console.error('Error:', error.message);
                toast.error(`An error occurred: ${error.message}`);
            } else {
                console.error('Unknown error:', error);
                toast.error('An unknown error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getChatHistory = async (run_id: string) => {
        setChatHistory([])
        try {
            const session = await getSession();
            const userId = session?.user?.id;

            setIsChatHistoryLoading(true);

            // http://localhost:8000/
            // https://kyndom-ai-api.onrender.com

            const data: Message[]  = await fetchChatHistory(userId, run_id); 
            console.log('data: ', data);
            setChatHistory(data);

        } catch (error) {
            if (error instanceof Error) {
                console.error('Error:', error.message);
                toast.error(`An error occurred: ${error.message}`);
            } else {
                console.error('Unknown error:', error);
                toast.error('An unknown error occurred. Please try again.');
            }
        } finally {
            setIsChatHistoryLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchRunInfo()
        }
    }, [isOpen]);

    useEffect(() => {
        if (selectedRunId && !newChat) {
            getChatHistory(selectedRunId)
        }
    }, [selectedRunId, newChat]);

    useEffect(() => {
        if (newRunId) {
            setRunIds(prevRunIds => [newRunId, ...prevRunIds.filter(id => id !== newRunId)]);
        }
    }, [newRunId]);

    console.log('chat_history: ', chatHistory)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent
                className='h-screen sm:h-[95vh] p-0 !w-full sm:!w-[90%] !max-w-[1500px] !rounded-none sm:!rounded-[8px] !outline-none'
            >
                <DialogDescription className='h-full max-h-full'>
                    <div className='flex w-full h-full max-h-full font-elmessiri'>
                        {!mobileNavExpanded && (
                            <div className='w-[375px] min-w-[375px] hidden lg:block border-r border-gray-300 pt-10 px-4 sm:px-6 relative custom_thumb h-full'>
                                <SidebarContent setMobileNavExpanded={setMobileNavExpanded} isLoading={isLoading} runIds={runIds} selectedRunId={selectedRunId} setSelectedRunId={setSelectedRunId} setNewChat={setNewChat} />
                            </div>
                        )}
                        <MainThread setMobileNavExpanded={setMobileNavExpanded} template={template} isDialogOpen={isOpen} chatHistory={chatHistory} isChatHistoryLoading={isChatHistoryLoading} runIds={runIds} setNewRunId={setNewRunId} selectedRunId={selectedRunId} setSelectedRunId={setSelectedRunId} setNewChat={setNewChat} isThreadsLoading={isLoading} setISThreadsLoading={setIsLoading} />
                    </div>
                    {mobileNavExpanded && (
                        <Sheet
                            open={mobileNavExpanded}
                            onOpenChange={setMobileNavExpanded}
                        >
                            <SheetContent
                                side="left"
                                className="border-r-0 bg-gray-50 px-0"
                                closePosition='left'
                            >
                                <button className='absolute left-4 sm:left-6 top-4 bg-slate-300/35 rounded-full p-1 flex justify-center items-center cursor-pointer z-50'
                                    onClick={() => setMobileNavExpanded((prevState) => !prevState)}
                                >
                                    <Icon icon="mingcute:close-fill" fontSize={18} />
                                </button>
                                <div className='w-full block lg:hidden pt-10 px-4 sm:px-6 relative custom_thumb'>
                                    <SidebarContent setMobileNavExpanded={setMobileNavExpanded} isLoading={isLoading} runIds={runIds} selectedRunId={selectedRunId} setSelectedRunId={setSelectedRunId} setNewChat={setNewChat} />
                                </div>
                            </SheetContent>
                        </Sheet>
                    )}
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
};

export default ChatDialog;


// 'use client'

// import React, { useEffect, useState } from 'react';
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
// } from "@/components/ui/dialog";
// import { Icon } from '@iconify/react';
// import SidebarContent from '../../threads/sidebar-content';
// import MainThread from '../../threads/main-thread';
// import { Sheet, SheetContent } from '@/components/ui/sheet'
// import { getSession } from 'next-auth/react';
// import { toast } from "react-toastify";

// const ChatDialog = ({ isOpen, setIsOpen, template }) => {
//     const [mobileNavExpanded, setMobileNavExpanded] = useState(false)
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//     const [runIds, setRunIds] = useState<string[]>([]);
//     const [selectedRunId, setSelectedRunId] = useState('')
//     const [chatHistory, setChatHistory] = useState([])
//     const [isChatHistoryLoading, setIsChatHistoryLoading] = useState<boolean>(false);
//     const [newRunId, setNewRunId] = useState('')
//     const [newChat, setNewChat] = useState<boolean>(false);

//     const getAllRunIds = async () => {
//         try {
//             const session = await getSession();
//             const userId = session?.user?.id;

//             setIsLoading(true);

//             // http://localhost:8000
//             // https://kyndom-ai-api.onrender.com

//             const res = await fetch('http://localhost:8000/get-all-ids', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ user_id: userId, }),
//             });

//             if (!res.ok) {
//                 throw new Error(`Server responded with ${res.status}`);
//             }

//             const data = await res.json();

//             setRunIds(data)

//         } catch (error) {
//             if (error instanceof Error) {
//                 console.error('Error:', error.message);
//                 toast.error(`An error occurred: ${error.message}`);
//             } else {
//                 console.error('Unknown error:', error);
//                 toast.error('An unknown error occurred. Please try again.');
//             }
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const getChatHistory = async (run_id) => {
//         setChatHistory([])
//         try {
//             const session = await getSession();
//             const userId = session?.user?.id;

//             setIsChatHistoryLoading(true);

//             // http://localhost:8000/
//             // https://kyndom-ai-api.onrender.com

//             const res = await fetch('https://kyndom-ai-api.onrender.com/history', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ user_id: userId, run_id }),
//             });

//             if (!res.ok) {
//                 throw new Error(`Server responded with ${res.status}`);
//             }

//             const data = await res.json();

//             setChatHistory(data)

//         } catch (error) {
//             if (error instanceof Error) {
//                 console.error('Error:', error.message);
//                 toast.error(`An error occurred: ${error.message}`);
//             } else {
//                 console.error('Unknown error:', error);
//                 toast.error('An unknown error occurred. Please try again.');
//             }
//         } finally {
//             setIsChatHistoryLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (isOpen) {
//             getAllRunIds()
//         }
//     }, [isOpen]);

//     useEffect(() => {
//         if (selectedRunId && !newChat) {
//             getChatHistory(selectedRunId)
//         }
//     }, [selectedRunId, newChat]);

//     useEffect(() => {
//         if (newRunId) {
//             setRunIds(prevRunIds => [newRunId, ...prevRunIds.filter(id => id !== newRunId)]);
//         }
//     }, [newRunId]);
//     console.log('selectedRunId: ', selectedRunId)

//     return (
//         <Dialog open={isOpen} onOpenChange={setIsOpen}>
//             <DialogContent
//                 className='h-screen sm:h-[95vh] p-0 !w-full sm:!w-[90%] !max-w-[1500px] !rounded-none sm:!rounded-[8px] !outline-none'
//             >
//                 <DialogDescription className='h-full max-h-full'>
//                     <div className='flex w-full h-full max-h-full font-elmessiri'>
//                         {!mobileNavExpanded && (
//                             <div className='w-[375px] min-w-[375px] hidden lg:block border-r border-gray-300 pt-10 px-4 sm:px-6 relative custom_thumb h-full'>
//                                 <SidebarContent setMobileNavExpanded={setMobileNavExpanded} isLoading={isLoading} runIds={runIds} selectedRunId={selectedRunId} setSelectedRunId={setSelectedRunId} setNewChat={setNewChat}/>
//                             </div>
//                         )}
//                         <MainThread setMobileNavExpanded={setMobileNavExpanded} template={template} isDialogOpen={isOpen} chatHistory={chatHistory} isChatHistoryLoading={isChatHistoryLoading} runIds={runIds} setNewRunId={setNewRunId} selectedRunId={selectedRunId} setSelectedRunId={setSelectedRunId} setNewChat={setNewChat} isThreadsLoading={isLoading} setISThreadsLoading={setIsLoading}/>
//                     </div>
//                     {mobileNavExpanded && (
//                         <Sheet
//                             open={mobileNavExpanded}
//                             onOpenChange={setMobileNavExpanded}
//                         >
//                             <SheetContent
//                                 side="left"
//                                 className="border-r-0 bg-gray-50 px-0"
//                                 closePosition='left'
//                             >
//                                 <button className='absolute left-4 sm:left-6 top-4 bg-slate-300/35 rounded-full p-1 flex justify-center items-center cursor-pointer z-50'
//                                     onClick={() => setMobileNavExpanded((prevState) => !prevState)}
//                                 >
//                                     <Icon icon="mingcute:close-fill" fontSize={18} />
//                                 </button>
//                                 <div className='w-full block lg:hidden pt-10 px-4 sm:px-6 relative custom_thumb'>
//                                     <SidebarContent setMobileNavExpanded={setMobileNavExpanded} isLoading={isLoading} runIds={runIds} selectedRunId={selectedRunId} setSelectedRunId={setSelectedRunId} setNewChat={setNewChat}/>
//                                 </div>
//                             </SheetContent>
//                         </Sheet>
//                     )}
//                 </DialogDescription>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default ChatDialog;