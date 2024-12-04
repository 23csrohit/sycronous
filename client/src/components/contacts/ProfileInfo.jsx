import { getColor } from "@/lib/utils"
import { useAppStore } from "@/store"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

import { FiEdit2 } from 'react-icons/fi'
import { useNavigate } from "react-router-dom"
import { IoPowerSharp } from "react-icons/io5"
import { MdOutlineCancel } from "react-icons/md";
import { apiClient } from "@/lib/api-client"
import { LOGOUT_ROUTE } from "@/utils/constants"


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { toast } from "sonner"


const ProfileInfo = () => {

  const { userInfo, setUserInfo, token, setToken } = useAppStore()
  const navigate = useNavigate()
  const [openLogoutModal, setOpenLogoutModal] = useState(false)


  // handle Logout
  const handleLogout = async () => {
    try {
      const response = await apiClient.post(LOGOUT_ROUTE, { token },
        { withCredentials: true }
      )
      console.log("LOGOUT_ROUTE API RESPONSE => ", response)

      if (response.data.success) {
        // clear userinfo from store
        setUserInfo(null)
        setToken(null)

        // clear local storage
        localStorage.removeItem("userInfo")
        localStorage.removeItem("token")
        toast.success("Logout successfully")
      }

    } catch (error) {
      console.log("LOGOUT_ROUTE API ERROR", error)
    }
  }

  return (
    <div className="absolute bottom-0 h-16 flex-between px-2 w-full bg-[#2a2b33]">
      <div className="flex-center gap-2">
        <div className="w-12 h-12 relative">
          <Avatar className="w-12 h-12 rounded-full overflow-hidden">
            {userInfo.image ? <AvatarImage
              src={userInfo.image}
              className="bg-black w-full h-full object-cover"
              alt='profile' />
              : <div
                className={`w-12 h-12 text-lg flex-center uppercase font-bold border-[1px] rounded-full 
              ${getColor(userInfo.color)}`}
              >
                {
                  userInfo.firstName ? userInfo.firstName.split("").shift()
                    : userInfo.email.split("").shift()
                }
              </div>
            }
          </Avatar>
        </div>

        {/* user first/last name */}
        {/* <div>
          <p className='capitalize'>
            {userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ''}
          </p>
          <p className="text-neutral-500 text-xs">{userInfo.email}</p>
        </div> */}

        <div className="flex items-center justify-between p-2 w-full lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col">
            <p className="capitalize">
              {userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ''}
            </p>
            <p className="text-neutral-500 text-xs">{userInfo.email}</p>
          </div>

        </div>

      </div>

      <div className="flex gap-5 md:gap-3 md:flex-col 2xl:gap-5 2xl:flex-row  ">
        {/* edit profile button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger onClick={() => navigate('/profile')}>
              <FiEdit2 className="text-purple-500 text-2xl md:text-xl font-medium" />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white " >
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>




        <Dialog open={openLogoutModal} onOpenChange={setOpenLogoutModal}>
          {/* logout icon click */}
          <DialogTrigger>
            {/* logout button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <IoPowerSharp className="text-red-500 text-2xl md:text-xl font-medium" />
                </TooltipTrigger>
                <TooltipContent className="bg-[#1c1b1e] border-none text-white " >
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

          </DialogTrigger>
          <DialogContent className="bg-[#181920] text-white flex flex-col justify-evenly w-[300px] h-[250px] border-none ">
            <DialogHeader className="flex gap-2">
              <DialogTitle>Are you sure to Logout...?</DialogTitle>
              <DialogDescription >
                We have saved your data, You can sign in any time
              </DialogDescription>

            </DialogHeader>
            <DialogFooter>
              <div className=" flex gap-5">
                <button
                  onClick={handleLogout}
                  className="flex-center gap-3 font-semibold p-3 px-4 bg-red-950 hover:bg-red-900 rounded-md "
                >
                  <IoPowerSharp className="text-red-500 text-xl font-medium" />
                  <p>Logout</p>
                </button>
                <button
                  onClick={() => setOpenLogoutModal(false)}
                  className="flex-center gap-3 font-semibold p-3 px-4 bg-green-950 hover:bg-green-900  rounded-md "
                >
                  <MdOutlineCancel className="text-green-500 text-xl font-medium" />
                  <p>Cancel</p>
                </button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>


      </div>
    </div>
  )
}

export default ProfileInfo