import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Loader2, Wallet, ShieldCheck } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useAddGuestbookMessage } from "@/hooks/use-guestbook";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(50, "Name is too long"),
  message: z.string().min(5, "Please leave a slightly longer message").max(1000, "Message is too long"),
});

type FormValues = z.infer<typeof formSchema>;

export function GuestbookForm() {
  const [isFocused, setIsFocused] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signError, setSignError] = useState<string | null>(null);

  const { publicKey, connected, signMessage } = useWallet();
  const { setVisible } = useWalletModal();
  const { mutate: createMessage, isPending } = useAddGuestbookMessage();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", message: "" },
  });

  const onSubmit = async (data: FormValues) => {
    setSignError(null);

    if (!connected || !publicKey || !signMessage) {
      setVisible(true);
      return;
    }

    try {
      setIsSigning(true);
      const messageToSign = new TextEncoder().encode(
        `I'm signing this message to verify my entry in the Villa Guestbook.\n\nWallet: ${publicKey.toBase58()}\nTimestamp: ${new Date().toISOString()}`
      );
      await signMessage(messageToSign);
      setIsSigning(false);

      createMessage(
        { data: { name: data.name, message: data.message, walletAddress: publicKey.toBase58() } },
        { onSuccess: () => { reset(); setIsFocused(false); } }
      );
    } catch {
      setIsSigning(false);
      setSignError("Signature was cancelled. Please try again.");
    }
  };

  const isLoading = isSigning || isPending;

  const buttonLabel = () => {
    if (isSigning) return <><Loader2 className="w-4 h-4 animate-spin" /> Waiting for signature...</>;
    if (isPending) return <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>;
    if (!connected) return <><Wallet className="w-4 h-4" /> Connect Wallet to Submit</>;
    return <><ShieldCheck className="w-4 h-4" /> Sign &amp; Submit</>;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-2xl font-serif text-foreground text-center mb-1">Sign the Guestbook</h3>
        <p className="text-center text-muted-foreground text-sm font-light mb-2">
          We'd love to hear about your stay with us.
        </p>
        {!connected && (
          <p className="text-center text-xs text-muted-foreground/70 mb-4">
            A Solana wallet is required to leave a message — connecting and signing proves you're a real guest.
          </p>
        )}
        {connected && publicKey && (
          <p className="text-center text-xs text-emerald-600 font-medium mb-4 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Connected: {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </p>
        )}
      </div>

      <div className={cn(
        "transition-all duration-500 ease-out",
        isFocused ? "opacity-100 translate-y-0" : "opacity-90"
      )}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-1.5 ml-1">
              Your Name
            </label>
            <input
              id="name"
              {...register("name")}
              onFocus={() => setIsFocused(true)}
              className={cn(
                "w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border",
                "text-foreground placeholder:text-muted-foreground/70",
                "focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10",
                "transition-all duration-300",
                errors.name && "border-destructive/50 focus:ring-destructive/10"
              )}
              placeholder="e.g. Jane & John Doe"
            />
            {errors.name && (
              <p className="text-destructive text-xs mt-1.5 ml-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground/80 mb-1.5 ml-1">
              Your Message
            </label>
            <textarea
              id="message"
              {...register("message")}
              onFocus={() => setIsFocused(true)}
              rows={4}
              className={cn(
                "w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border resize-none",
                "text-foreground placeholder:text-muted-foreground/70",
                "focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10",
                "transition-all duration-300",
                errors.message && "border-destructive/50 focus:ring-destructive/10"
              )}
              placeholder="What was the highlight of your visit?"
            />
            {errors.message && (
              <p className="text-destructive text-xs mt-1.5 ml-1">{errors.message.message}</p>
            )}
          </div>
        </div>

        {signError && (
          <p className="text-destructive text-xs mt-3 text-center">{signError}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full mt-6 group relative overflow-hidden rounded-xl px-6 py-3.5",
            "font-medium tracking-wide transition-all duration-300 ease-out",
            "shadow-md hover:shadow-lg active:scale-[0.98]",
            "disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none",
            connected
              ? "bg-primary text-primary-foreground shadow-primary/20 hover:shadow-primary/30"
              : "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-purple-500/20 hover:shadow-purple-500/30"
          )}
        >
          <span className="relative flex items-center justify-center gap-2">
            {buttonLabel()}
          </span>
        </button>
      </div>
    </form>
  );
}
