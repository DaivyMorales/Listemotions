import { HiSparkles } from "react-icons/hi";
import { BsArrowReturnLeft } from "react-icons/bs";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import { useOpenComponents } from "@/store/openComponentsStore";
import { useGlobalIds } from "@/store/globalIdsStore";
import { useSession } from "next-auth/react";
import axios from "axios";
import Playlist from "./Playlist";
import { useAnimate, stagger } from "framer-motion";
import { useEffect, useState } from "react";
import { MutatingDots } from "react-loader-spinner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function InputPrompt() {
  const [open, setOpen] = useState(false);
  const [scope, animate] = useAnimate();

  const staggerList = stagger(0.1, { startDelay: 0.25 });

  const { setOpenPlaylist } = useOpenComponents();

  const { data: session } = useSession();

  const { setResponseGpt, responseGpt } = useGlobalIds();

  const formik = useFormik({
    initialValues: {
      prompt: "",
    },
    onSubmit: async (values) => {
      console.log("send");
      setOpenPlaylist(true);
      setOpen(true);

      const body = {
        prompt: values.prompt,
        artists: [],
        accessToken: session?.accessToken,
      };
      const response = await axios.post("/api/gpt", body);
      setResponseGpt(response.data);
    },
  });

  useEffect(() => {
    if (responseGpt.length === 0) {
      animate(
        "ul",
        {
          width: open ? 700 : 0,
          height: open ? 500 : 0,
          opacity: open ? 1 : 0,
        },
        {
          type: "spring",
          bounce: 0,
          duration: 0.4,
        },
      );
    }
  }, [open]);

  return (
    <div className="input-prompt-container absolute z-50 flex h-screen w-screen flex-col">
      <div className="mt-20 flex flex-col items-center justify-start gap-2">
        <motion.form
          onSubmit={formik.handleSubmit}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            delay: 0.3,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className={`flex w-[700px] flex-col items-center justify-center rounded-xl bg-white ${open ? "py-2" : "py-1"}`}
        >
          <div className={`flex w-full items-center justify-center gap-3 px-4 py-2 ${open ? "border-b" : ""}`}>
            {/* <HiSparkles color="gray" size={20} /> */}
            <input
              type="text"
              name="prompt"
              className="w-full text-lg font-medium"
              placeholder="Describe us how do you want your playlist"
              onChange={formik.handleChange}
              autoComplete="off"
            />
            <motion.button
              whileTap={{ scale: 0.4 }}
              whileHover={{ scale: 1.1 }}
              type="submit"
              className="rounded-full bg-green-400 p-3"
            >
              <BsArrowReturnLeft color="black" />
            </motion.button>
          </div>
          <div
            style={{
              maxHeight: "500px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
            className=" w-full"
            ref={scope}
          >
            {responseGpt.length === 0 ? (
              <ul className="flex h-[500px] w-[500px] flex-col items-center justify-center bg-white">
                <MutatingDots
                  visible={true}
                  height="100"
                  width="100"
                  color="#22c55e"
                  secondaryColor="#22c55e"
                  radius="12"
                  ariaLabel="mutating-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
                <p className="text-xs font-bold text-black">Generating...</p>
              </ul>
            ) : (
              <Playlist />
            )}
          </div>
        </motion.form>
      </div>
    </div>
  );
}
