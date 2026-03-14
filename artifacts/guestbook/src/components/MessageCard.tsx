import { format } from "date-fns";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import type { Message } from "@workspace/api-client-react";

interface MessageCardProps {
  message: Message;
  index: number;
}

export function MessageCard({ message, index }: MessageCardProps) {
  let formattedDate = "";
  try {
    formattedDate = format(new Date(message.createdAt), "MMMM do, yyyy");
  } catch {
    formattedDate = "Recently";
  }

  const tintClasses = [
    "bg-blue-50/70 border-blue-200/50 hover:border-blue-300",
    "bg-orange-50/70 border-orange-200/50 hover:border-orange-300",
    "bg-purple-50/70 border-purple-200/50 hover:border-purple-300",
    "bg-emerald-50/70 border-emerald-200/50 hover:border-emerald-300",
  ];
  const cardStyle = tintClasses[index % tintClasses.length];

  const shortWallet = message.walletAddress
    ? `${message.walletAddress.slice(0, 4)}...${message.walletAddress.slice(-4)}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: index * 0.1 }}
      className={`group relative rounded-2xl p-6 sm:p-8 border shadow-sm hover:shadow-md transition-all duration-500 ${cardStyle}`}
    >
      <div className="absolute top-6 left-6 text-primary/10 font-serif text-6xl leading-none select-none pointer-events-none">
        "
      </div>

      <div className="relative z-10 pl-4 sm:pl-6">
        <p className="text-foreground/90 text-lg sm:text-xl font-serif italic leading-relaxed mb-6">
          {message.message}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-4 pt-4 border-t border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-primary/40" />
            <span className="font-medium text-foreground tracking-wide">
              {message.name}
            </span>
            {shortWallet && (
              <span
                className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full px-2 py-0.5"
                title={`Verified Solana wallet: ${message.walletAddress}`}
              >
                <ShieldCheck className="w-3 h-3" />
                {shortWallet}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
            {formattedDate}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function MessageCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/60 shadow-sm animate-pulse">
      <div className="pl-6 space-y-4">
        <div className="h-6 bg-secondary rounded-md w-3/4" />
        <div className="h-6 bg-secondary rounded-md w-5/6" />
        <div className="h-6 bg-secondary rounded-md w-1/2" />
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-border/40">
          <div className="flex items-center gap-3 w-1/2">
            <div className="h-px w-6 bg-border" />
            <div className="h-5 bg-secondary rounded-md w-24" />
          </div>
          <div className="h-4 bg-secondary rounded-md w-20" />
        </div>
      </div>
    </div>
  );
}
