"use client";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { SocialStrategy } from "@prisma/client";
import ColView from "../general/col-view";
import ContentPageLoading from "../general/content-page-loading";
import CardLoading from "../general/card-loading";
import { Icon } from '@iconify/react'
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import * as Tooltip from '@radix-ui/react-tooltip';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useStore from "store/useStore";
import SharedDialogContent from "../shared/SharedDialogContent";

const TodaysPlan = () => {
  const socialStrategies = api.socialStrategy.getStrategies.useQuery();

  return (
    <div className="w-full md:col-span-3">
      <div className="flex w-full items-center justify-between mb-4 md:mb-8">
        <h1 className="font-elmessiri text-2xl leading-6">Today's Plan</h1>
      </div>
      {socialStrategies.data ? (
        <ColView
          elements={socialStrategies.data.map((strategy, i) => (
            <PlanStrategy strategy={strategy} key={i} />
          ))}
          columns={3}
          wThird={true}
        />
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5 2xl:gap-8">
          {Array.from(Array(3).keys()).map((_, index) => (
            <CardLoading key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

const PlanStrategy = ({ strategy }: { strategy: SocialStrategy }) => {
  const [isParentDialogOpen, setIsParentDialogOpen] = useState(false);
  const user = useStore((state) => state.user);

  // const generatePrompt = () => `
  //   You are my real estate assistant. Please personalize/customize the template below based on my saved profile information:
  //   "Title: ${strategy.title}.
    
  //   content: ${strategy.content}."

  //   Note: only add bullets if necessary otherwise not.
  // `;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={`relative max-h-[450px] overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-lg hover:cursor-pointer`}
          style={{
            paddingBottom: `calc(100% * 5 / 4 + 96px)`,
            height: 0,
          }}
        >
          <div className="absolute top-[50%] left-0 -translate-y-1/2 w-full h-[90%] px-5 font-plusjakartasans overflow-hidden">
            <div className="flex w-full items-center justify-between">
              <Badge className="py-1 font-bold" variant="secondary">
                {strategy.type}
              </Badge>
            </div>
            <h1 className="text-[20px] font-semibold capitalize text-dark-gray min-h-fit my-3 line-clamp-2">
              {strategy.title}
            </h1>
            <div
              className="overflow-hidden text-sm text-light-gray line-clamp"
              dangerouslySetInnerHTML={{
                __html: strategy.content ? strategy.content.replace(/\n/g, '<br/>') : '',
              }}
            />
          </div>
        </div>
      </DialogTrigger>
      <SharedDialogContent
        template={strategy}
        user={user} 
        setIsParentDialogOpen={setIsParentDialogOpen}
      />
      {/* <SharedDialogContent
        title={strategy.title} 
        content={strategy.content} 
        generatePrompt={generatePrompt} 
        user={user} 
      /> */}
    </Dialog>
  );
};
// const PlanStrategy = ({ strategy }: { strategy: SocialStrategy }) => {
//   const [response, setResponse] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isPersonalized, setIsPersonalized] = useState(false);
//   const [loadingDots, setLoadingDots] = useState('.');

//   useEffect(() => {
//     let interval;
//     if (isLoading) {
//       interval = setInterval(() => {
//         setLoadingDots((prev) => (prev.length < 3 ? prev + '.' : '.'));
//       }, 500);
//     } else {
//       setLoadingDots('');
//     }

//     return () => clearInterval(interval);
//   }, [isLoading]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // console.log('Prompt: ', generatePrompt(strategy))
//     const session = await getSession();
//     const userId = session?.user?.id;
//     setResponse(''); // Clear previous response
//     setIsLoading(true);
//     setIsPersonalized(true)

//     const fetchStream = async () => {
//       const response = await fetch('https://kyndom-ai-api.onrender.com/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message: generatePrompt(strategy.content), stream: true, user_id: userId }),
//       });

//       if (!response.body) {
//         console.error('Response body is undefined');
//         setIsLoading(false);
//         return;
//       }

//       const reader = response.body.getReader();
//       if (!reader) {
//         console.error('Reader is undefined');
//         setIsLoading(false);
//         return;
//       }

//       console.log('reader: ', reader);
//       const decoder = new TextDecoder();
//       let done = false;

//       while (!done) {
//         const { value, done: doneReading } = await reader.read();
//         done = doneReading;
//         if (value) {
//           const chunk = decoder.decode(value, { stream: true });
//           console.log('chunk: ', chunk);
//           setResponse((prev) => prev + chunk);
//         }
//       }

//       setIsLoading(false);
//     };

//     fetchStream();
//   };

//   const generatePrompt = (strategy) => {
//     return `
//         You are my real estate assistant. Please personalize/customize the strategy below based on my saved profile information:
//         "Title: ${strategy.title}.

//         content: ${strategy.content}."
//         Note: please focus on the template text don't change the whole text. Also, remember that the Template Category is "Today's Plan".
//     `;
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <div
//           className={`relative max-h-[450px] overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-lg hover:cursor-pointer`}
//           style={{
//             paddingBottom: `calc(100% * 5 / 4 + 96px)`,
//             height: 0,
//           }}
//         >
//           <div className="absolute top-[50%] left-0 -translate-y-1/2 w-full h-[90%] px-5 font-plusjakartasans overflow-hidden">
//             <div className="flex w-full items-center justify-between">
//               <Badge className="py-1 font-bold" variant="secondary">
//                 {strategy.type}
//               </Badge>
//             </div>
//             <h1 className="text-[20px] font-semibold capitalize text-dark-gray min-h-fit my-3 line-clamp-2">
//               {strategy.title}
//             </h1>
//             <div
//               className="overflow-hidden text-sm text-light-gray line-clamp"
//               dangerouslySetInnerHTML={{
//                 __html: strategy.content ? strategy.content.replace(/\n/g, '<br/>') : ''
//               }}
//             />
//             {/* <div className="overflow-hidden text-sm text-light-gray">
//               {strategy.content}
//             </div> */}
//           </div>
//         </div>
//       </DialogTrigger>
//       <DialogContent small={true} onOpenAutoFocus={(e) => e.preventDefault()}>
//         <DialogHeader>
//           <DialogTitle>
//             <h1 className="font-elmessiri text-2xl font-bold capitalize">
//               {strategy.title}
//             </h1>
//           </DialogTitle>
//         </DialogHeader>
//         <DialogDescription>
//           <div className="overflow-y-auto">
//             {isPersonalized && response ? (
//               <pre className='w-full max-w-full whitespace-pre-wrap font-pjs text-[1rem] leading-6 text-light-gray h-[65vh]'>
//                 {response}
//                 {isLoading && <span className='text-lg font-medium'>{loadingDots}</span>}
//               </pre>
//             ) : (
//               <div
//                 className="font-pjs text-[1rem] leading-6 text-light-gray h-[65vh]"
//                 dangerouslySetInnerHTML={{
//                   __html: strategy.content ? strategy.content.replace(/\n/g, '<br/>') : ''
//                 }}
//               />
//             )}
//           </div>
//           {/* <span className="font-pjs text-[1rem] leading-6 text-light-gray">
//             {strategy.content}
//           </span> */}
//         </DialogDescription>
//         <div className="flex items-center justify-end mt-2">
//           <button
//             className="border-none outline-none bg-gradient-to-br from-[#ff05f5] to-[#0cba83] rounded-full w-[140px] h-10 text-white flex items-center justify-center disabled:opacity-45 transition-all"
//             disabled={isLoading}
//             onClick={handleSubmit}
//           >
//             {isLoading && !response ? (
//               <div className="flex items-center justify-center">
//                 <div className="animate-spin">
//                   <Loader2Icon className="text-primary text-white" size={20} />
//                 </div>
//               </div>
//             ) : (
//               <span className="flex items-center gap-1.5 text-sm">
//                 <Icon icon="mage:stars-c-fill" fontSize={24} />
//                 Personalize
//               </span>
//             )}
//           </button>
//           {/* <button className="border-none outline-none text-green-950 flex items-center gap-0.5 text-base font-medium">
//             <Icon icon="gg:undo" fontSize={20} />
//             Undo
//           </button> */}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

export default TodaysPlan;
