export const PageError = ({ message }: { message: string }) => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-full">
            <div className="flex flex-col gap-y-1">
                <div className="text-3xl font-pjs">An error occurred!</div>
                <div className="text-xl">{message}</div>
            </div>
        </div>
    )
};