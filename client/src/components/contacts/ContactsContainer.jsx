import Title from "@/components/common/Title";
import ProfileInfo from "./ProfileInfo";
import NewDM from "./NewDM";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { GET_CONTACTS_FOR_DM_LIST_ROUTE, GET_USER_CHANNELS_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactsList from "../common/ContactsList";
import CreateChannel from "./CreateChannel";

const ContactsContainer = () => {

  const { token, directMessagesContacts, setDirectMessagesContacts, channels, setChannels } = useAppStore()

  // loading states
  const [contactLoading, setContactLoading] = useState(false)
  const [channelLoading, setChannelLoading] = useState(false)

  useEffect(() => {
    // get All Contacts
    try {
      const getAllContacts = async () => {
        setContactLoading(true)
        const res = await apiClient.post(GET_CONTACTS_FOR_DM_LIST_ROUTE,
          { token, },
          { withCredentials: true }
        )
        console.log("GET_CONTACTS_FOR_DM_LIST_ROUTE RESPONSE => ", res)
        if (res.data.success) {
          setDirectMessagesContacts(res.data.contacts)
        }
        setContactLoading(false)
      }
      getAllContacts()

    } catch (error) {
      console.log("GET_CONTACTS_FOR_DM_LIST_ROUTE ERROR 🔴🔴🔴 = ", error)
    }

    // get User Channels
    try {
      const getUserChannels = async () => {
        setChannelLoading(true)
        const res = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        console.log("GET_USER_CHANNELS_ROUTE RESPONSE => ", res)
        if (res.data.success) {
          setChannels(res.data.channels)
        }
        setChannelLoading(false)
      }
      getUserChannels()
    } catch (error) {
      console.log("GET_USER_CHANNELS_ROUTE ERROR 🔴🔴🔴 = ", error)
    }
  }, [token, setDirectMessagesContacts, setChannels])


  // Contact Loading Skeleton
  const ContactLoadingSkeleton = () => {
    return (
      <div className="flex flex-col gap-3 pl-10 py-2 mt-2 ">
        <div className="flex items-center gap-5 ">
          <div className='w-10 h-10 rounded-full skeleton'></div>
          <div className='w-2/3 h-7 rounded-md skeleton'></div>
        </div>
        <div className="flex items-center gap-5 ">
          <div className='w-10 h-10 rounded-full skeleton'></div>
          <div className='w-2/3 h-7 rounded-md skeleton'></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] ">
      <div className="">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex-between pr-10">
          <Title text='Direct Messages' />
          <NewDM />
        </div>
        <div className="overflow-y-auto max-h-[38vh] scrollbar-hidden">
          {
            contactLoading ? <ContactLoadingSkeleton />
              : <ContactsList contacts={directMessagesContacts} />
          }
        </div>
      </div>

      <div className="my-5">
        <div className="flex-between pr-10">
          <Title text='Channels' />
          <CreateChannel />
        </div>
        <div className="overflow-y-auto max-h-[38vh] scrollbar-hidden">
          {
            channelLoading ? <ContactLoadingSkeleton />
              : <ContactsList contacts={channels} isChannel={true} />
          }
        </div>
      </div>

      <ProfileInfo />
    </div>
  )
}

export default ContactsContainer

const Logo = () => {
  return (
    <div className="flex p-5 justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>{" "}
      </svg>
      <span className="text-3xl font-semibold text-white">Syncronus</span>
    </div>
  );
};

