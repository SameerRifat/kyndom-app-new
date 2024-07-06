import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { animate } from 'framer-motion';

export default function ScrollToBottom({ children, message, setIsScrollingDone }) {
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     if (chatContainerRef.current) {
    //         chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    //     }
    // }, [message]);

    // useEffect(() => {
    //     const container = chatContainerRef.current;
    //     if (container) {
    //         const scrollHeight = container.scrollHeight;
    //         const scrollTo = () => {
    //             animate(container.scrollTop, scrollHeight, {
    //                 duration: 0.5, // Adjust duration as needed
    //                 onUpdate: (value) => {
    //                     if (container) {
    //                         container.scrollTop = value;
    //                     }
    //                 },
    //             });
    //         };
    //         scrollTo();
    //     }
    // }, [message]);

    useEffect(() => {
        setIsScrollingDone(false)
        const container = chatContainerRef.current;
        if (container) {
            const scrollHeight = container.scrollHeight;
            animate(0, scrollHeight, {
                duration: 0.6, // Adjust duration as needed
                ease: 'easeInOut',
                onUpdate: (value) => {
                    container.scrollTop = value;
                },
                onComplete: () => {
                    setIsScrollingDone(true);
                },
            });
        }
    }, [message]);

    return (
        <div
            ref={chatContainerRef}
            className="w-full h-full max-h-full overflow-y-auto px-5 pb-7"
            // style={{ height: 'calc(100vh - 160px)' }}
        >
            {children}
        </div>
    );
}

ScrollToBottom.propTypes = {
    children: PropTypes.node,
    message: PropTypes.string,
};



// import React, { useEffect, useRef } from 'react';
// import PropTypes from 'prop-types';

// export default function ScrollToBottom({ children, messages }) {
//     const chatContainerRef = useRef<HTMLDivElement>(null);
//     useEffect(() => {
//         if (chatContainerRef.current) {
//             chatContainerRef.current.scrollTo({
//                 top: chatContainerRef.current.scrollHeight,
//                 behavior: 'smooth',
//             });
//         }
//     }, [messages]);

//     return (
//         <div ref={chatContainerRef} className="h-full w-full max-h-full overflow-y-auto px-5 pb-7">
//             {children}
//         </div>
//     );
// }

// ScrollToBottom.propTypes = {
//     children: PropTypes.node,
//     messages: PropTypes.array.isRequired,
// };
