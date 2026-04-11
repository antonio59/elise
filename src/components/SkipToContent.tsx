import { motion } from "framer-motion";

interface SkipToContentProps {
  targetId?: string;
  className?: string;
}

const SkipToContent: React.FC<SkipToContentProps> = ({
  targetId = "main-content",
  className = "",
}) => {
  const handleClick = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.a
      href={`#${targetId}`}
      onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}
      className={`
        fixed top-0 left-0 z-[100]
        bg-primary-600 text-white
        px-6 py-3 rounded-br-xl
        font-bold text-sm
        transform -translate-y-full focus:translate-y-0
        transition-transform duration-200
        focus:outline-none focus:ring-4 focus:ring-primary-300
        ${className}
      `}
      initial={{ y: "-100%" }}
      whileFocus={{ y: 0 }}
    >
      Skip to main content
    </motion.a>
  );
};

export default SkipToContent;
