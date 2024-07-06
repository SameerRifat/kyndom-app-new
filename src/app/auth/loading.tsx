import { Loader2Icon } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="flex h-full w-full min-w-full min-h-full items-center justify-center">
      <div className="animate-spin">
        <Loader2Icon className="text-primary" size={32} />
      </div>
    </div>
  );
};

export default LoadingPage;
