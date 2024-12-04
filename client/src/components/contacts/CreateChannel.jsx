import { useEffect, useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"
import MultipleSelector from '@/components/ui/multipleselect';
import { FaPlus } from "react-icons/fa"

// dialog
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { apiClient } from "@/lib/api-client"
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTE, } from "@/utils/constants"
import { useAppStore } from "@/store"
import { Button } from "../ui/button"
import { toast } from "sonner";


const CreateChannel = () => {

    const { token, addChannel, channels } = useAppStore()
    const [openNewChannelModal, setOpenNewChannelModal] = useState(false)
    const [allContacts, setAllContacts] = useState([])
    const [selectedContacts, setSelectedContacts] = useState([])
    const [channelName, setChannelName] = useState('')


    // console.log("selected-Contacts array = ", selectedContacts)
    // console.log("allContacts array value = ", allContacts)

    const validateCreateChannel = () => {
        if (!channelName) {
            toast.error("Channel name is required")
            return false
        }
        if (selectedContacts.length === 0) {
            toast.error("Channel members are required")
            return false
        }
        return true;
    }

    // create new channel
    const createChannel = async () => {
        try {
            if (validateCreateChannel()) {
                const response = await apiClient.post(CREATE_CHANNEL_ROUTE,
                    {
                        token,
                        channelName,
                        members: selectedContacts.map(contact => contact.value)
                    },
                    { withCredentials: true }
                )
                console.log('CREATE_CHANNEL_ROUTE RESPONSE => ', response)
                if (response.data.success) {
                    setOpenNewChannelModal(false)
                    setChannelName("")
                    setSelectedContacts([])
                    addChannel(response.data.channel)
                }
            }
        } catch (error) {
            console.log('CREATE_CHANNEL_ROUTE ERROR => ', error)
        }
    }

    // console.log('channels from store = ', channels)


    useEffect(() => {
        try {
            const getAllContacts = async () => {
                const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                // const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE,
                //     { token },
                //     { withCredentials: true, }
                // );
                console.log("GET_ALL_CONTACTS_ROUTE RESPONSE => ", response)
                if (response.status && response.data.contacts) {
                    setAllContacts(response.data.contacts)
                }
            }

            getAllContacts()
        } catch (error) {
            console.log("GET_ALL_CONTACTS_ROUTE ERROR => ", error)
        }
    }, [token])

    return (
        < >
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            onClick={() => setOpenNewChannelModal(true)}
                            className="text-neutral-400 hover:text-neutral-100 font-light text-sm text-start cursor-pointer text-opacity-90 transition-all duration-300 "
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] mb-2 p-3 border-none ">
                        Select New Channel
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>


            <Dialog open={openNewChannelModal} onOpenChange={setOpenNewChannelModal}>
                <DialogContent className="bg-[#181920] text-white flex flex-col w-[400px] h-[400px] border-none ">
                    <DialogHeader>
                        <DialogTitle>Please fill up the details for new channel</DialogTitle>
                        <DialogDescription></DialogDescription>
                        <div>
                            <input
                                type='text'
                                value={channelName}
                                placeholder="Enter a Channel Name"
                                onChange={(e) => setChannelName(e.target.value)}
                                className="p-3 rounded-lg w-full bg-[#2c2e3b] border-none outline-none  "
                            />
                        </div>
                        <div>
                            <MultipleSelector
                                className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white focus:outline-none"
                                defaultOptions={allContacts}
                                placeholder="Search Contacts"
                                value={selectedContacts}

                                onChange={setSelectedContacts}
                                emptyIndicator={
                                    <p className="text-center text-lg leading-10 text-gray-600">
                                        No results found.
                                    </p>
                                }

                            />
                        </div>

                        <div>
                            <Button
                                onClick={createChannel}
                                className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 active:scale-95"
                            >
                                Create Channel
                            </Button>
                        </div>


                    </DialogHeader>

                </DialogContent>
            </Dialog>

        </>
    )
}

export default CreateChannel
