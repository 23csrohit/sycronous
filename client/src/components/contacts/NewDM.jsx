import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"
import { FaPlus } from "react-icons/fa"

// dialog
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import Lottie from "react-lottie"
import { animationDefaultOptions, getColor } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"
import { SEARCH_CONTACTS_ROUTE } from "@/utils/constants"
import { useAppStore } from "@/store"
import { ScrollArea } from "../ui/scroll-area"
import { Avatar, AvatarImage } from "../ui/avatar"


const NewDM = () => {

    const { token, setSelectedChatType, setSelectedChatData } = useAppStore()
    const [openNewContactModal, setOpenNewContactModal] = useState(false)
    const [searchedContacts, setsearchedContacts] = useState([])

    // handle Search Contacts
    const handleSearchContacts = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
                const response = await apiClient.post(SEARCH_CONTACTS_ROUTE, { token, searchTerm }, {})
                console.log("SEARCH_CONTACTS_ROUTE API RESPONSE => ", response)
                if (response.status && response.data.contacts) {
                    setsearchedContacts(response.data.contacts)
                }
                else {
                    setsearchedContacts([])
                }
            } else {
                setsearchedContacts([])
            }

        } catch (error) {
            console.log("SEARCH_CONTACTS_ROUTE API ERROR => ", error)

        }
    }

    // console.log("searchedContacts array value = ", searchedContacts)

    const selectNewContact = (contact) => {
        setOpenNewContactModal(false) // close modal
        setSelectedChatType('contact') // set chat type
        setSelectedChatData(contact) // set user details

        setsearchedContacts([]) // clear search contacts
    }

    return (
        < >
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            onClick={() => setOpenNewContactModal(true)}
                            className="text-neutral-400 hover:text-neutral-100 font-light text-sm text-start cursor-pointer text-opacity-90 transition-all duration-300 "
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] mb-2 p-3 border-none ">
                        Select New Contact
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>


            <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
                <DialogContent className="bg-[#181920] text-white flex flex-col w-[400px] h-[400px] border-none ">
                    <DialogHeader>
                        <DialogTitle>Please select a new contact</DialogTitle>
                        <DialogDescription></DialogDescription>
                        <div>
                            <input
                                type='text'
                                placeholder="Search contacts..."
                                onChange={(e) => handleSearchContacts(e.target.value)}
                                className="p-3 rounded-lg w-full bg-[#2c2e3b] border-none outline-none  "
                            />
                        </div>

                        {/* show searchd-contacts list  */}
                        {searchedContacts.length > 0 &&
                            <ScrollArea className="h-[250px]">
                                <div className="flex flex-col gap-2">
                                    {searchedContacts.map(contact => (
                                        <div key={contact._id}
                                            className='flex gap-3 items-center cursor-pointer'
                                            onClick={() => selectNewContact(contact)}
                                        >
                                            <div className="relative bg-neutral-800 hover:bg-neutral-700 p-2 rounded-md flex gap-5 w-full ">
                                                <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                                                    {contact.image ? <AvatarImage
                                                        src={contact.image}
                                                        className="bg-black w-full h-full object-cover"
                                                        alt='profile' />
                                                        : <div
                                                            className={`w-12 h-12 text-lg flex-center uppercase font-bold border-[1px] rounded-full 
                                                                  ${getColor(contact.selectedColor)}`}
                                                        >
                                                            {
                                                                contact.firstName ? contact.firstName.split("").shift()
                                                                    : contact.email.split("").shift()
                                                            }
                                                        </div>
                                                    }
                                                </Avatar>

                                                {/* user first/last name */}
                                                <div className="flex flex-col">
                                                    <p>
                                                        {contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : `${contact.email}`}
                                                    </p>
                                                    <p className="text-neutral-500 text-sm">{contact.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                        }

                        {/* if contacts not found */}
                        {
                            searchedContacts.length <= 0 && (
                                <div className="flex-center bg-[#1c1d25] mt-5 p-6 flex-1 flex flex-col transition-all duration-1000">
                                    <Lottie
                                        isClickToPauseDisabled={true}
                                        height={100}
                                        width={100}
                                        options={animationDefaultOptions}
                                    />

                                    <div className="flex flex-col text-white text-opacity-90 gap-5 items-center mt-5 text-xl lg:text-2xl text-center transition-all duration-300 ">
                                        <h3 className="poppins-medium">
                                            Hi<span className="text-purple-500">!</span> Search
                                            <span className="text-purple-500"> </span> New
                                            <span className="text-purple-500"> Contacts.</span>
                                        </h3>
                                    </div>
                                </div>
                            )
                        }
                    </DialogHeader>

                </DialogContent>
            </Dialog>

        </>
    )
}

export default NewDM
