import React from 'react';
import { Icon } from '@iconify/react';
import { preprocessResponse } from '@/lib/utils';

const SidebarContent = ({ setMobileNavExpanded, isLoading, runIds, selectedRunId, setSelectedRunId, setNewChat }) => {

    return (
        <>
            <div className='flex items-center justify-between gap-2 pb-6'>
                <h1 className='text-xl xxs:text-2xl xs:text-3xl sm:text-4xl font-alpina'>
                    Threads
                </h1>
                <button className='flex items-center gap-1 bg-gray-200 py-1 sm:py-0.5 px-2 rounded-sm shadow-sm'>
                    <span className='py-1 text-xs sm:text-sm'>New thread</span>
                    <Icon icon="octicon:feed-plus-16" />
                </button>
            </div>
            {isLoading ? (
                <div className='h-[73vh] max-h-[73vh] 2xl:max-h-[75vh] flex items-center justify-center'>
                    <div className="spinner center">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((_, ind) => (
                            <div key={ind} className="spinner-blade"></div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='pb-3 overflow-y-auto'>
                    <div className='space-y-3 pr-1 max-h-[73vh] 2xl:max-h-[75vh]'>
                        {/* <button type='button'
                            className={`font-poppins text-sm rounded-[10px] px-[18px] py-[15px] text-start hover:bg-gray-300/60 transition-all
                            ${selectedRunId === '' ? 'bg-gray-300/60' : 'bg-gray-200/40'}
                            `}
                        >
                            <Icon icon="majesticons:home-line" fontSize={20} />
                            <span className='line-clamp-1 mt-1'>
                                Hey there, great to meet you. I’m Pi, your personal AI. My goal is to be useful, friendly and fun. Ask me for advice, for answers, or let’s talk about whatever’s on your mind. How's your day going?
                            </span>
                        </button> */}
                        {runIds && runIds.length > 0 ? (
                            runIds.map((runId, ind) => (
                                <button type='button'
                                    className={`font-poppins text-sm rounded-[10px] px-[18px] py-[15px] text-start hover:bg-gray-300/60 transition-all w-full
                                        ${selectedRunId === runId.run_id ? 'bg-gray-300/60' : 'bg-gray-200/40'}
                                        `}
                                    key={runId.run_id}
                                    onClick={() => {
                                        setSelectedRunId(runId.run_id);
                                        setNewChat(false)
                                        setMobileNavExpanded(false)
                                    }}
                                >
                                    <span className='font-medium'>{runId.template_title}</span>
                                    <br />
                                    <span
                                        className='line-clamp-1 mt-1 styled_ai_response'
                                        dangerouslySetInnerHTML={{ __html: preprocessResponse(runId.last_response) }}
                                    />
                                </button>
                            ))
                        ) : (
                            <div>No Thread Found</div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default SidebarContent;