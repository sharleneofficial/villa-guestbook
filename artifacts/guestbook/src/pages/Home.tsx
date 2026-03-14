import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import { GuestbookForm } from "@/components/GuestbookForm";
import { MessageCard, MessageCardSkeleton } from "@/components/MessageCard";
import { WalletButton } from "@/components/WalletButton";
import { useGuestbookMessages } from "@/hooks/use-guestbook";

const HERO_IMAGES = [
  "images/hero-villa.png",
  "images/slide-2.png",
  "images/slide-3.png",
  "images/slide-4.png",
  "images/slide-5.png",
];

export default function Home() {
  const { data: messages, isLoading, isError } = useGuestbookMessages();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary-foreground pb-24">
      <WalletButton />
      {/* Hero Section */}
      <section className="relative h-[65vh] min-h-[450px] w-full overflow-hidden flex items-center justify-center">
        {/* Background Image Slideshow */}
        <div className="absolute inset-0 bg-secondary/50">
          <AnimatePresence>
            <motion.img
              key={currentSlide}
              src={`${import.meta.env.BASE_URL}${HERO_IMAGES[currentSlide]}`}
              alt={`Villa view ${currentSlide + 1}`}
              className="absolute inset-0 w-full h-full object-cover object-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </AnimatePresence>
        </div>
        
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-black/30 bg-gradient-to-b from-black/40 via-transparent to-background/90 z-0" />

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center items-center gap-3">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? "w-2.5 h-2.5 bg-white opacity-100 shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
                  : "w-2 h-2 bg-white/50 hover:bg-white/80 hover:scale-110"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center px-4 sm:px-6 mt-10"
        >
          <span className="block text-white uppercase tracking-[0.4em] text-sm font-semibold mb-6 drop-shadow-lg">
            Welcome to
          </span>
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-white mb-6 drop-shadow-xl font-bold">
            The Villa Guestbook
          </h1>
          <p className="text-white text-xl md:text-2xl font-medium max-w-2xl mx-auto drop-shadow-lg">
            A collection of memories, stories, and moments shared by our wonderful guests in this Mediterranean paradise.
          </p>
        </motion.div>
      </section>

      {/* Main Content Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-24">
        
        {/* Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card backdrop-blur-md rounded-2xl shadow-2xl shadow-primary/10 border border-white p-6 sm:p-10 mb-20 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>
          <GuestbookForm />
        </motion.div>

        {/* Decorative Divider */}
        <div className="flex justify-center mb-16 opacity-60">
          <img 
            src={`${import.meta.env.BASE_URL}images/flourish.png`} 
            alt="Decorative flourish" 
            className="h-12 object-contain mix-blend-multiply dark:mix-blend-screen dark:invert"
          />
        </div>

        {/* Entries Section */}
        <section className="space-y-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">Past Entries</h2>
            <p className="text-muted-foreground font-light">Read about previous stays</p>
          </div>

          <div className="space-y-6">
            {isLoading && (
              <>
                <MessageCardSkeleton />
                <MessageCardSkeleton />
                <MessageCardSkeleton />
              </>
            )}

            {isError && (
              <div className="text-center py-12 px-6 bg-destructive/5 rounded-2xl border border-destructive/20">
                <p className="text-destructive font-medium mb-2">We couldn't load the messages.</p>
                <p className="text-muted-foreground text-sm">Please refresh the page to try again.</p>
              </div>
            )}

            {!isLoading && !isError && messages?.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 px-6 bg-card rounded-2xl border border-border/50 shadow-sm"
              >
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-primary/40">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl text-foreground mb-2">The book is empty</h3>
                <p className="text-muted-foreground">Be the first to leave a message in our guestbook.</p>
              </motion.div>
            )}

            {!isLoading && !isError && messages && messages.map((msg, idx) => (
              <MessageCard key={msg.id} message={msg} index={idx} />
            ))}
          </div>
        </section>
        
      </main>
    </div>
  );
}
