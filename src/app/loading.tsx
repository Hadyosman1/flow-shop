import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <main>
      <div className="container py-10">
        <div className="grid min-h-[60svh] place-content-center">
          <Loader2 size={30} className="animate-spin text-primary" />
        </div>
      </div>
    </main>
  );
};

export default Loading;
