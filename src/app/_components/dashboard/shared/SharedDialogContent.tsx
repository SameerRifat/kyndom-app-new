"use client";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Loader2Icon } from "lucide-react";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { Icon } from '@iconify/react'
import * as Tooltip from '@radix-ui/react-tooltip';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useLoadingDots } from "./useLoadingDots";
import { useRouter } from "next/navigation";
import ChatDialog from "../ai-chat/chat-dialog";
// import * as Dialog from '@radix-ui/react-dialog';

const SharedDialogContent = ({ template, user, setIsParentDialogOpen }) => {
    const router = useRouter()
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPersonalized, setIsPersonalized] = useState(false);
    // const [isParentDialogOpen, setIsParentDialogOpen] = useState(true); // New state for parent dialog
    const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
    const loadingDots = useLoadingDots(isLoading);

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const session = await getSession();
    //     const userId = session?.user?.id;
    //     setResponse('');
    //     setIsLoading(true);
    //     setIsPersonalized(true);

    //     try {
    //         const res = await fetch('https://kyndom-ai-api.onrender.com/chat', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ message: generatePrompt(), stream: true, user_id: userId }),
    //         });

    //         if (!res.body) throw new Error('Response body is undefined');

    //         const reader = res.body.getReader();
    //         if (!reader) throw new Error('Reader is undefined');

    //         const decoder = new TextDecoder();
    //         let done = false;

    //         while (!done) {
    //             const { value, done: doneReading } = await reader.read();
    //             done = doneReading;
    //             if (value) {
    //                 const chunk = decoder.decode(value, { stream: true });
    //                 setResponse((prev) => prev + chunk);
    //             }
    //         }
    //     } catch (error) {
    //         if (error instanceof Error) {
    //             console.error(error.message);
    //         } else {
    //             console.error('Unknown error', error);
    //         }
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const preprocessResponse = (text) => {
        // Replace **word** with <strong>word</strong>
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Replace - bullet points with <li>bullet points</li>
        text = text.replace(/^- (.*)/gm, '<li>$1</li>');

        // Wrap the entire text in <ul> if it contains bullet points
        if (text.includes('<li>')) {
            text = `<ul>${text}</ul>`;
        }

        return text;
    };

    const handlePersonalizeClick = () => {
        setIsParentDialogOpen(false);
        setIsChatDialogOpen(true);
    };

    return (
        <>
            {/* <Dialog> */}
                <DialogContent small={true} onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>
                            <h1 className="font-elmessiri text-2xl font-bold capitalize">
                                {template?.title}
                            </h1>
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        <div className="overflow-y-auto">
                            {isPersonalized && response ? (
                                <div className='w-full max-w-full whitespace-pre-wrap font-pjs text-[1rem] leading-6 text-light-gray h-[65vh] xl:h-[60vh] styled_ai_response pr-1'>
                                    <div dangerouslySetInnerHTML={{ __html: preprocessResponse(response) }} />
                                    {isLoading && <span className='text-lg font-medium'>{loadingDots}</span>}
                                </div>
                            ) : (
                                <div
                                    className="font-pjs text-[1rem] leading-6 text-light-gray h-[65vh] xl:h-[60vh]"
                                    dangerouslySetInnerHTML={{
                                        __html: template?.content ? template?.content.replace(/\n/g, '<br/>') : '',
                                    }}
                                />
                            )}
                        </div>
                    </DialogDescription>
                    <div className="flex items-center justify-end mt-2">
                        {user && user.subscription_status === "ACTIVE" ? (
                            !response ? (
                                <button
                                    className="border-none outline-none bg-gradient-to-br from-[#ff05f5] to-[#0cba83] rounded-full w-[140px] xl:w-[150px] h-10 text-white flex items-center justify-center disabled:opacity-45 transition-all"
                                    disabled={isLoading}
                                    // onClick={handleSubmit}
                                    onClick={handlePersonalizeClick}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin">
                                                <Loader2Icon className="text-primary text-white" size={20} />
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-sm xl:text-sm">
                                            <Icon icon="mage:stars-c-fill" fontSize={20} />
                                            Personalize
                                        </span>
                                    )}
                                </button>
                            ) : (
                                <button
                                    className="border-none outline-none text-green-900 flex items-center gap-0.5 text-sm font-medium"
                                    onClick={() => {
                                        setResponse('');
                                        setIsPersonalized(false);
                                    }}
                                >
                                    <Icon icon="gg:undo" fontSize={18} />
                                    Undo
                                </button>
                            )
                        ) : (
                            <Tooltip.Provider>
                                <Tooltip.Root>
                                    <Tooltip.Trigger asChild>
                                        <Button
                                            size={"lg"}
                                            className="border-none outline-none bg-gradient-to-br from-[#ff05f5] to-[#0cba83] rounded-full px-5 h-10 text-white text-sm flex items-center disabled:opacity-45 transition-all"
                                            onClick={() => router.push("/dashboard/settings/billing")}
                                        >
                                            <Icon icon="mage:stars-c-fill" fontSize={20} />
                                            Personalize
                                            <Image
                                                src={"/img/svg/sidebar-crown.svg"}
                                                alt={"Sidebar Crown"}
                                                width={20}
                                                height={20}
                                            />
                                        </Button>
                                    </Tooltip.Trigger>
                                    <Tooltip.Portal>
                                        <Tooltip.Content className="z-50 border border-gray-50 shadow-sm p-1 px-2 rounded-md bg-white" sideOffset={5}>
                                            Unlock premium access to personalize
                                            <Tooltip.Arrow className="fill-white" />
                                        </Tooltip.Content>
                                    </Tooltip.Portal>
                                </Tooltip.Root>
                            </Tooltip.Provider>
                        )}
                    </div>
                </DialogContent>
            {/* </Dialog> */}
            <ChatDialog isOpen={isChatDialogOpen} setIsOpen={setIsChatDialogOpen} template={template}/>
        </>
    );
};

export default SharedDialogContent;
