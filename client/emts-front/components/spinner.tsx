// // components/Spinner.js
// import { Loader2 } from "lucide-react";

// export default function Spinner() {
//     return (
//       <div className="flex items-center justify-center h-full w-full">
//       <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
//     </div>
//     );
//   }
  


// components/spinner.tsx
import { Loader2 } from "lucide-react";

interface SpinnerProps {
  className?: string;
}

export default function Spinner({ className }: SpinnerProps) {
  return <Loader2 className={`animate-spin text-gray-500 ${className}`} />;
}
