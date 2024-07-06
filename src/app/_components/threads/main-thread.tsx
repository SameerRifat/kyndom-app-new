'use client'

import React, { useRef, useState, FormEvent, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { getSession } from 'next-auth/react';
import { preprocessResponse } from '@/lib/utils';
import { AnimatePresence, motion } from "framer-motion";
import ScrollToBottom from '../dashboard/shared/ScrollToBottom';
import { Icon } from '@iconify/react'
import LoadingDots from '../dashboard/shared/loading-dots';
import { toast } from "react-toastify";

interface Message {
    message: string;
    response: string;
}

const MainThread = ({ setMobileNavExpanded, template, isDialogOpen, chatHistory, isChatHistoryLoading, runIds, setNewRunId, selectedRunId, setSelectedRunId, setNewChat, isThreadsLoading, setISThreadsLoading }) => {
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isScrollingDone, setIsScrollingDone] = useState<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const hasSentFirstMessageRef = useRef(false);

    useEffect(() => {
        // Convert chatHistory to the desired format
        if (chatHistory) {
            const initialMessages = chatHistory.map((chat) => ({
                message: chat.role === 'user' ? chat.content : '',
                response: chat.role === 'assistant' ? chat.content : '',
            }));
            setMessages(initialMessages);
        }
    }, [chatHistory]);

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };
    const removeTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'initial';
        }
    };
    useEffect(() => {
        if (!message) {
            removeTextareaHeight()
        }
    }, [message])

    useEffect(() => {
        if (!isThreadsLoading && runIds.length > 0) {
            const existedtempateChat = runIds.find((runId, ind) => runId.template_id === template.id)

            if (existedtempateChat) {
                setSelectedRunId(existedtempateChat.run_id)
            } else {
                if (isDialogOpen && messages.length === 0 && !hasSentFirstMessageRef.current) {
                    hasSentFirstMessageRef.current = true;
                    handleSubmit(template.content);
                }
            }
        }
        if (!isThreadsLoading && runIds.length === 0) {
            if (isDialogOpen && messages.length === 0 && !hasSentFirstMessageRef.current) {
                hasSentFirstMessageRef.current = true;
                handleSubmit(template.content);
            }
        }
    }, [isDialogOpen, runIds]);

    useEffect(() => {
        if (!isDialogOpen) {
            setMessage('')
            setMessages([])
            setNewRunId('')
            setSelectedRunId('')
            setNewChat(false)
            setISThreadsLoading(false)
        }
    }, [isDialogOpen])

    const handleSubmit = async (initialMessage?: string) => {
        try {
            const session = await getSession();
            const userId = session?.user?.id;
            const newMessageContent = initialMessage || message;
            const newMessage = { message: newMessageContent, response: '' };
            let newChat = false;

            setMessages(prevMessages => {
                newChat = prevMessages.length === 0;
                return [...prevMessages, newMessage];
            });

            setMessage('');
            setIsLoading(true);

            const promptMessage = newMessageContent === initialMessage
                ? `Please personalize/customize the template below based on my saved profile information and my provided data:
                    "${newMessageContent}"

                    Text Overlay:
                        Create a text overlay with the theme "${template.title}" based on the user's selected neighborhood.
                    Caption:
                        Write a caption that shares the user's personal connection to the neighborhood and what makes it special. 
                    Call-to-Action:
                        Include a call-to-action that encourages viewers to share their thoughts or ask questions about the neighborhood.`
                : newMessageContent;

            const requestBody = {
                message: promptMessage,
                stream: true,
                user_id: userId,
                new: !!initialMessage,
                template_type: template.category || "TODAYS_PLAN",
                template_id: template.id,
                template_title: template.title,
                ...(selectedRunId && { run_id: selectedRunId }) // Include run_id only if selectedRunId exists
            };

            const res = await fetch('https://kyndom-ai-api.onrender.com/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!res.ok) {
                throw new Error(`Server responded with ${res.status}`);
            }

            if (!res.body) {
                throw new Error('Response body is undefined');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let response = '';
            let runId = '';

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                if (value) {
                    const chunk = decoder.decode(value, { stream: true });

                    if (chunk.includes("[DONE]")) {
                        setIsLoading(false);
                        continue; // Skip processing [DONE] chunk further
                    }

                    // Check if this is the first chunk and contains the run_id
                    if (!runId && chunk.startsWith("run_id:")) {
                        const lines = chunk.split('\n');
                        if (lines[0]) {
                            const parts = lines[0].split(': ');
                            if (parts[1]) {
                                runId = parts[1].trim();
                            }
                        }
                        response += lines.slice(1).join('\n');
                    } else {
                        response += chunk;
                    }


                    setMessages(prevMessages => {
                        const newMessages = [...prevMessages];
                        const lastMessage = newMessages[newMessages.length - 1];
                        if (lastMessage) {
                            lastMessage.response = response;
                        }
                        return newMessages;
                    });
                }
            }

            if (runId) {
                setNewChat(true)
                setNewRunId({
                    run_id: runId,
                    template_id: template.id,
                    template_title: template.title,
                    last_response: response
                })
            }
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

    return (
        <div className='grow flex flex-col text-lg pt-8 custom_thumb2 relative h-full max-h-[96.5vh] sm:max-h-[94.5vh]'>
            <div className='h-5 absolute top-8 left-0 lg:inset-x-10 z-40 bg-[#f5f5f5]/70 backdrop-blur-[1px]' />
            <button className='absolute top-6 left-4 sm:left-6 md:left-10 z-50 w-9 h-9 min-w-9 min-h-9 rounded-full bg-gray-200 flex lg:hidden justify-center items-center shadow-sm'
                onClick={() => setMobileNavExpanded((prevState) => !prevState)}
            >
                <Icon icon="mdi:newspaper-variant-multiple-outline" fontSize={26} />
            </button>
            {isChatHistoryLoading ? (
                <div className='w-full h-full flex justify-center items-center'>
                    <div className="spinner center">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((_, ind) => (
                            <div key={ind} className="spinner-blade"></div>
                        ))}
                    </div>
                </div>
            ) : (
                <ScrollToBottom message={messages[messages.length - 1]?.message} setIsScrollingDone={setIsScrollingDone}>
                    {!chatHistory && (
                        <div className='w-full max-w-[38.5rem] 2xl:max-w-[47rem] ml-auto mr-auto sm:px-5'>
                            <p className='pt-10'>
                                Hey there, great to meet you. I’m Pi, your personal AI.
                                My goal is to be useful, friendly and fun. Ask me for advice, for answers, or let’s talk about whatever’s on your mind.
                                How's your day going?
                            </p>
                            <div className='flex items-center gap-2 mt-10'>
                                <div className='h-[1px] bg-gray-300 w-full' />
                                <span className='text-sm'>Today</span>
                                <div className='h-[1px] bg-gray-300 w-full' />
                            </div>
                        </div>
                    )}
                    <div className='flex flex-col w-full max-w-[38.5rem] 2xl:max-w-[47rem] ml-auto mr-auto sm:px-5 '>
                        {messages.slice(0, messages.length - 1).map((msg, index) => (
                            <div key={index}>
                                {msg.message && (
                                    <motion.p
                                        key={index}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.3, delay: 0.3 }}
                                        className='p-3 text-xl bg-gray-300/30 rounded-[10px] w-fit max-w-[90%] md:max-w-[80%] ml-auto my-7 whitespace-pre-line'
                                    >
                                        {msg.message}
                                    </motion.p>
                                )}
                                {msg.response}
                                <AnimatePresence>
                                    <motion.div
                                        key={index + 'response'}
                                        initial={{ x: -1, y: -1, opacity: 0 }}
                                        animate={{ x: 0, y: 0, opacity: 1 }}
                                        transition={{ duration: 0.3, delay: 0.3 }}
                                        className='w-fit max-w-full text-xl leading-8 mr-auto whitespace-pre-wrap styled_ai_response'
                                    >
                                        {msg.response.split('\n').map((line, lineIndex) => (
                                            <motion.div
                                                key={lineIndex}
                                                initial={{ x: -1, y: -1, opacity: 0 }}
                                                animate={{ x: 0, y: 0, opacity: 1 }}
                                                transition={{ duration: 0.2, delay: lineIndex * 0.1 }}
                                            >
                                                <div dangerouslySetInnerHTML={{ __html: preprocessResponse(line) }} />
                                            </motion.div>
                                        ))}
                                        {isLoading && <LoadingDots />}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    {messages[messages.length - 1] && (
                        <div
                            className={`flex flex-col w-full max-w-[38.5rem] 2xl:max-w-[47rem] ml-auto mr-auto sm:px-5
                                        ${messages[messages.length - 1]?.message && 'h-full'}
                                        `}
                        >
                            <div>
                                {isScrollingDone && messages[messages.length - 1]?.message && (
                                    <motion.p
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.4, delay: 0.5 }}
                                        className='p-3 bg-gray-300/30 text-xl rounded-[10px] w-fit max-w-[90%] md:max-w-[80%] ml-auto my-7 whitespace-pre-line'
                                    >
                                        {messages[messages.length - 1]?.message}
                                    </motion.p>
                                )}
                                <AnimatePresence>
                                    {messages[messages.length - 1]?.response ? (
                                        <motion.div
                                            initial={{ x: -1, y: -0.5, opacity: 0 }}
                                            animate={{ x: 0, y: 0, opacity: 1 }}
                                            transition={{ duration: 0.7, delay: 0.3 }}
                                            className='w-fit max-w-full text-xl leading-8 mr-auto whitespace-pre-wrap pb-7 styled_ai_response'
                                        >
                                            {messages[messages.length - 1]?.response.split('\n').map((line, lineIndex) => (
                                                <motion.div
                                                    key={lineIndex}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 1.4, delay: lineIndex * 0.1 }}
                                                >
                                                    <div dangerouslySetInnerHTML={{ __html: preprocessResponse(line) }} />
                                                </motion.div>
                                            ))}
                                            {isLoading && <LoadingDots />}
                                        </motion.div>
                                    ) : (
                                        isScrollingDone && isLoading && (
                                            <motion.div
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ duration: 0.3, delay: 1 }}
                                                className='mb-10'
                                            >
                                                <LoadingDots />
                                            </motion.div>
                                        )
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </ScrollToBottom>
            )
            }
            <div className='px-5 sm:px-6'>
                <div
                    className={`w-full max-w-[38.5rem] 2xl:max-w-[47rem] min-h-[54px] rounded-[30px] outline-none flex items-center justify-between shadow-lg border border-transparent focus-within:border-[#c3c3c3] focus-within:shadow-none hover:border-[#c3c3c3] hover:shadow-none ml-auto mr-auto transition-all
                                ${isChatHistoryLoading || isLoading || isThreadsLoading ? 'bg-white bg-opacity-20 pointer-events-none' : 'bg-white'}
                            `}
                >
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            adjustTextareaHeight();
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && message.length >= 1 && !isLoading && !isChatHistoryLoading) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                        placeholder='Talk with AI'
                        className='border-none p-2 w-full resize-none h-auto max-h-[160px] pt-2.5 pl-5 outline-none rounded-md bg-transparent overflow-y-auto'
                        disabled={isChatHistoryLoading || isLoading}
                    />
                    <button
                        className='w-9 h-9 min-w-9 min-h-9 m-2 rounded-full flex justify-center items-center disabled:cursor-auto disabled:bg-[#e2e2e2] disabled:text-gray-500 bg-green-900 text-white transition-all'
                        onClick={() => handleSubmit()}
                        disabled={message.length < 1 || isLoading || isChatHistoryLoading}
                    >
                        <ArrowUp />
                    </button>
                </div>

                <div className='px-6 py-4 ml-auto mr-auto text-center'>
                    <p className='text-sm'>
                        Pi may make mistakes, please don't rely on its information.
                    </p>
                </div>
            </div>
        </div >
    );
};

export default MainThread;