import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Sparkles,
  Palette,
  PenTool,
  Heart,
  Star,
  Compass,
  MessageSquare,
  X,
} from "lucide-react";

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface TourStep {
  title: string;
  content: string;
  emoji: string;
  icon: React.ReactNode;
  color: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome, Elise!",
    content:
      "As your uncle I created this site to give you an outlet to share the things you love to do -- read, write, and draw! This is YOUR special place on the internet. Let me show you around so you can make the most of it.",
    emoji: "💜",
    icon: <Sparkles className="w-8 h-8" />,
    color: "from-primary-500 to-accent-500",
  },
  {
    title: "Your Bookshelf",
    content:
      "Keep track of every book you read! You can mark books as \"Currently Reading,\" \"Finished,\" or add them to your Wishlist. Rate them with stars, write reviews, and even note who gave you a book as a gift.",
    emoji: "📚",
    icon: <BookOpen className="w-8 h-8" />,
    color: "from-primary-500 to-primary-600",
  },
  {
    title: "Your Writing Corner",
    content:
      "This is where your words come alive! Write poetry, stories, or journal entries. You can save drafts privately or publish them for everyone to see. Express yourself however you want.",
    emoji: "✍️",
    icon: <PenTool className="w-8 h-8" />,
    color: "from-violet-500 to-purple-600",
  },
  {
    title: "Your Art Gallery",
    content:
      "Show off your amazing artwork! Upload your drawings, paintings, or any art you create. You can organize them into series and share them with everyone who visits your site.",
    emoji: "🎨",
    icon: <Palette className="w-8 h-8" />,
    color: "from-accent-500 to-accent-600",
  },
  {
    title: "Reviews & Reactions",
    content:
      "Write reviews to share what you think about books. Visitors can leave emoji reactions on your books and reviews -- hearts, stars, fire, and more! It is fun to see what people think.",
    emoji: "⭐",
    icon: <Star className="w-8 h-8" />,
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "Discover New Books",
    content:
      "Swipe through book recommendations to find your next great read! Like a book? Add it straight to your wishlist. Pass on ones that are not your style. It is like a fun game for finding books.",
    emoji: "🧭",
    icon: <Compass className="w-8 h-8" />,
    color: "from-teal-500 to-emerald-500",
  },
  {
    title: "Wishlist & Suggestions",
    content:
      "Your wishlist is public, so family and friends know exactly what books to get you! They can also suggest books they think you would love. You get to approve or decline each suggestion.",
    emoji: "🎁",
    icon: <Heart className="w-8 h-8" />,
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Book Suggestions",
    content:
      "Visitors can suggest books for you! Check the Suggestions page to see what people think you should read next. Approve the ones you like and they will be added to your collection.",
    emoji: "💬",
    icon: <MessageSquare className="w-8 h-8" />,
    color: "from-blue-500 to-indigo-500",
  },
  {
    title: "You are All Set!",
    content:
      "That is everything! Remember, this is YOUR space. Read books, write stories, create art, and have fun. I am so proud of you and excited to see what you share. Now go explore!",
    emoji: "🚀",
    icon: <Sparkles className="w-8 h-8" />,
    color: "from-primary-500 to-accent-500",
  },
];

const FLOATING_EMOJIS = [
  "📚",
  "✨",
  "🎨",
  "✍️",
  "💜",
  "⭐",
  "🦋",
  "🌸",
  "💫",
  "📖",
];

const OnboardingTour: React.FC<OnboardingTourProps> = ({
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState(0);

  const currentStep = TOUR_STEPS[step];
  const isLastStep = step === TOUR_STEPS.length - 1;
  const isFirstStep = step === 0;

  const handleNext = useCallback(() => {
    if (isLastStep) {
      onComplete();
    } else {
      setStep((prev) => prev + 1);
    }
  }, [isLastStep, onComplete]);

  const handleBack = useCallback(() => {
    if (!isFirstStep) {
      setStep((prev) => prev - 1);
    }
  }, [isFirstStep]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      {/* Floating decorations */}
      <motion.div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {FLOATING_EMOJIS.map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-3xl opacity-15"
            style={{
              left: `${10 + (i * 8.5) % 80}%`,
              top: `${5 + (i * 11) % 85}%`,
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 8, -8, 0],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </motion.div>

      <motion.div
        className="relative max-w-lg w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        {/* Skip button */}
        {!isLastStep && (
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 z-10 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Skip tour"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Progress bar */}
        <div className="h-1.5 bg-slate-100">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
            initial={{ width: 0 }}
            animate={{
              width: `${((step + 1) / TOUR_STEPS.length) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content */}
        <div className="p-8 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="text-center"
            >
              {/* Icon */}
              <motion.div
                className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${currentStep.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                {currentStep.icon}
              </motion.div>

              {/* Emoji accent */}
              <motion.span
                className="text-4xl block mb-3"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                {currentStep.emoji}
              </motion.span>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                {currentStep.title}
              </h2>

              {/* Description */}
              <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-md mx-auto">
                {currentStep.content}
              </p>

              {/* Celebration confetti on last step */}
              {isLastStep && (
                <div className="mt-6 flex justify-center gap-3">
                  {["📚", "🎨", "✍️", "⭐", "💜"].map((emoji, i) => (
                    <motion.span
                      key={i}
                      className="text-2xl"
                      animate={{ y: [0, -12, 0] }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 1.5,
                      }}
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="px-8 pb-8 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={isFirstStep}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
              isFirstStep
                ? "opacity-0 pointer-events-none"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          {/* Step dots */}
          <div className="flex gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step
                    ? "bg-primary-500 w-5"
                    : i < step
                      ? "bg-primary-300 w-2"
                      : "bg-slate-200 w-2"
                }`}
              />
            ))}
          </div>

          <motion.button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600 transition-all shadow-md"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isLastStep ? "Let's Go!" : "Next"}
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingTour;
