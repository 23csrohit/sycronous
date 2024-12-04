import { useAppStore } from "@/store"
import { Avatar, AvatarImage } from "../ui/avatar"
import { getColor } from "@/lib/utils"

const ContactsList = ({ contacts, isChannel = false }) => {

    const { selectedChatType, setSelectedChatType, selectedChatData, setSelectedChatData, setselectedChatMessages } = useAppStore()

    const handleClickContact = (contact) => {
        if (isChannel) {
            setSelectedChatType('channel')
        } else {
            setSelectedChatType('contact')
        }
        if (selectedChatData && selectedChatData._id !== contact._id) {
            setselectedChatMessages([])
        }
        setSelectedChatData(contact)
    }

    // console.log("DM contacts = ", contacts)
    // console.log("selectedChatData = ", selectedChatData)

    if (!contacts) {
        return <div className="text-2xl text-center text-red-500">Loading...</div>
    }

    return (
        <div className="mt-5">
            <div>
                {contacts?.map((contact) => (
                    <div key={contact._id}
                        className={`pl-10 py-2 transition-all duration-300 cursor-pointer
                             ${selectedChatData && selectedChatData._id === contact._id ? 'bg-[#8417ff] hover:bg-[#8417ff]' : 'hover:bg-[#f1f1f111]'}`}
                        onClick={() => handleClickContact(contact)}
                    >
                        <div className="flex gap-5 items-center justify-start text-neutral-300">
                            {!isChannel ?
                                // for contacts
                                <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                                    {contact.image ? <AvatarImage
                                        src={contact.image}
                                        className="bg-black w-full h-full object-cover"
                                        alt='profile'
                                    />
                                        : <div
                                            className={`${selectedChatData && selectedChatData._id === contact._id
                                                ? "bg-[#fffff22] border border-white/70"
                                                : getColor(contact.color)}
                                             w-10 h-10 text-lg flex-center uppercase font-bold border-[1px] rounded-full 
                                            `}
                                        >
                                            {
                                                contact.firstName ? contact.firstName.split("").shift()
                                                    : contact.email.split("").shift()
                                            }
                                        </div>
                                    }
                                </Avatar>

                                // for channels
                                :
                                <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                                    #
                                </div>
                            }

                            {isChannel ? (
                                <span className="capitalize">{contact.channelName}</span>
                            ) : (
                                <span className="capitalize">{`${contact.firstName} ${contact.lastName}`}</span>
                            )}

                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ContactsList