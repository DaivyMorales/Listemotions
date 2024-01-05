import { HiSparkles } from "react-icons/hi";
import { BsArrowReturnLeft } from "react-icons/bs";
import { motion } from "framer-motion";

export default function InputPrompt() {
  return (
    <div className="input-prompt-container absolute z-50 flex h-full w-full items-start justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.3,
          delay: 0.3,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        className="mt-[150px] flex w-[700px] items-center justify-start gap-3 rounded-lg bg-white p-2 px-3"
      >
        <HiSparkles color="gray" />
        <input
          type="text"
          className="w-full text-lg"
          placeholder="Describe us how do you want your playlist"
        />
        <button className="rounded-full bg-green-400 p-3">
          <BsArrowReturnLeft color="black" />
        </button>
      </motion.div>
    </div>
  );
}
