import { useAppStore } from "@/store"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { colors, getColor } from "@/lib/utils"

// icons
import { IoArrowBack } from 'react-icons/io5'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { UPDATE_PROFILE_ROUTE } from "@/utils/constants"
import { toast } from "sonner"

const Profile = () => {

  const { userInfo, setUserInfo, token } = useAppStore()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState(userInfo.firstName ? userInfo.firstName : '')
  const [lastName, setLastName] = useState(userInfo.lastName ? userInfo.lastName : '')
  const [image, setImage] = useState('')
  const [selectedColor, setSelectedColor] = useState(userInfo.color ? userInfo.color : 0)
  const [hovered, setHovered] = useState(false)
  const [updateProfileLoading, setUpdateProfileLoading] = useState(false)



  // validate inputs
  const validateProfile = () => {
    if (!firstName) {
      toast.error("First name is required..!")
      return false
    }
    if (!lastName) {
      toast.error("Last name is required..!")
      return false
    }
    return true
  }

  // update profile in database
  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        setUpdateProfileLoading(true)
        const response = await apiClient.post(UPDATE_PROFILE_ROUTE,
          { token, firstName, lastName, image, color: selectedColor },
          { withCredentials: true }
        )
        setUpdateProfileLoading(false)
        console.log("UPDATE_PROFILE_ROUTE RESPONSE => ", response)
        if (response.data.success && response.data.user) {
          toast.success("Profile updated successfully")
          setUserInfo({ ...response.data.user })
          localStorage.setItem("userInfo", JSON.stringify(response.data?.user));  // set user details to local storage
          navigate("/chat")
        }
      } catch (error) {
        console.log("UPDATE_PROFILE_ROUTE ERROR => ", error)
      }
    }
  }


  const handleProfileBackNavigation = () => {
    if (userInfo.profileSetup) {
      navigate("/chat")
    } else {
      toast.error("Please setup profile")
    }
  }

  // console.log("userInfo from 'profile-page' => ", userInfo)

  return (
    <div className="bg-[#1b1c24] h-screen flex-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-[500px] 2xl:w-[700px] ">
        <div onClick={handleProfileBackNavigation} className="w-fit">
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer hover:scale-110 duration-300" />
        </div>
        <div className="grid  grid-cols-1 gap-10 md:gap-0 md:grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? <AvatarImage
                src={image}
                className="bg-black w-full h-full object-cover"
                alt='profile' />
                : <div
                  className={`w-32 h-32 md:w-48 md:h-48 text-5xl flex-center uppercase font-bold border-[1px] rounded-full 
                       ${getColor(selectedColor)}`}
                >
                  {
                    firstName ? firstName.split("").shift()
                      : userInfo.email.split("").shift()
                  }
                </div>
              }
            </Avatar>

            {hovered && <div className="absolute inset-0 flex-center bg-black/50 rounded-full cursor-pointer transition-all ">
              {image ? <FaTrash className="text-3xl text-white " /> : <FaPlus className="text-3xl text-white " />}
            </div>
            }

          </div>

          <div className="min-w-52 flex-center flex-col gap-5 text-white  ">
            {/* email */}
            <div className="w-full">
              <Input
                placeholder='Email'
                type='email'
                disabled
                value={userInfo.email}
                className="p-6 bg-[#2c2e3b] rounded-lg border-none w-full"
              />
            </div>
            {/* firstName */}
            <div className="w-full">
              <Input
                placeholder='First Name'
                type='text'
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="p-6 bg-[#2c2e3b] rounded-lg border-none "
              />
            </div>
            <div className="w-full">
              <Input
                placeholder='Last Name'
                type='text'
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="p-6 bg-[#2c2e3b] rounded-lg border-none "
              />
            </div>


            {/* choose profile color  */}
            <div className='w-full flex gap-5 justify-between'>
              {colors.map((color, ind) => (
                <div
                  key={color}
                  onClick={() => setSelectedColor(ind)}
                  className={`${color} ${selectedColor === ind && 'outline outline-2 outline-white/80'}
                                   w-8 h-8 rounded-full cursor-pointer transition-all duration-300 `}
                >
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full">
          <Button
            disabled={updateProfileLoading}
            onClick={saveChanges}
            className="h-16 w-full bg-green-700 hover:bg-green-900 rounded-2xl transition-all duration-300 disabled:cursor-wait"
          >
            {updateProfileLoading ? 'Saving...!' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Profile