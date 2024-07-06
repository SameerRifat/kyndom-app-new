import Image from "next/image"

export default () => {
    return (
        <div className="flex items-center justify-center w-full min-h-screen">
            <div className="flex flex-col items-center text-center gap-y-3">
                <Image src={"/img/svg/white-logo.svg"} alt={"White Logo"} width={123} height={35} />
                <div className="text-sm">Editor Loading...</div>
            </div>
        </div>
    )
}