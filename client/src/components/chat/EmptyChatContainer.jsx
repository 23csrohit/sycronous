import { animationDefaultOptions } from "@/lib/utils"
import Lottie from "react-lottie"

const EmptyChatContainer = () => {
  return (
    <div className="hidden md:flex-center bg-[#1c1d25] flex-1 flex-col transition-all duration-1000">
      <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationDefaultOptions}
      />

      <div className="flex flex-col text-white text-opacity-90 gap-5 items-center mt-10 text-3xl lg:text-4xl text-center transition-all duration-300 ">
        <h3 className="poppins-medium">
          Hi <span className="text-purple-500">! <br />
          </span>Welcome to
          <span className="text-purple-500"> Syncronus</span> Chat App
          <span className="text-purple-500">.</span>
        </h3>
      </div>
    </div>
  )
}

export default EmptyChatContainer