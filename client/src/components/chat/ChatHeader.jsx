import { useAppStore } from '@/store';
import { RiCloseFill } from 'react-icons/ri';
import { Avatar, AvatarImage } from '../ui/avatar';
import { getColor } from '@/lib/utils';

const ChatHeader = () => {

    const { closeChat, selectedChatData, selectedChatType } = useAppStore()
    // console.log("selectedChatData = ", selectedChatData )



    return (
        <div className="h-[10vh] border-b-2 border-[#2f303b] flex-between px-5">
            <div className="w-full justify-between flex gap-5 items-center ">
                <div className="flex-center gap-3">
                    <div className="relative bg-neutral-800 hover:bg-neutral-700 p-2 rounded-md flex gap-5 ">
                        {selectedChatType === 'contact' ?
                            // for contacts
                            <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                                {selectedChatData.image ? <AvatarImage
                                    src={selectedChatData.image}
                                    className="bg-black w-full h-full object-cover"
                                    alt='profile'
                                />
                                    : <div
                                        className={`w-12 h-12 text-lg flex-center uppercase font-bold border-[1px] rounded-full 
                                                                  ${getColor(selectedChatData.color)}`}
                                    >
                                        {
                                            selectedChatData.firstName ? selectedChatData.firstName.split("").shift()
                                                : selectedChatData.email.split("").shift()
                                        }
                                    </div>
                                }
                            </Avatar>
                            :
                            // for channels
                            <div className="bg-[#ffffff22] h-12 w-12 flex-center rounded-full">
                                #
                            </div>
                        }
                    </div>
                    {/* user first/last name */}
                    <div className="flex flex-col">
                        {selectedChatType === 'contact' ?
                            <>
                                <p className='capitalize'>
                                    {selectedChatData.firstName && selectedChatData.lastName ? `${selectedChatData.firstName} ${selectedChatData.lastName}` : `${selectedChatData.email}`}
                                </p>
                                <p className="text-neutral-500 text-sm">{selectedChatData.email}</p>
                            </>
                            : <div>
                                {selectedChatData.channelName}
                            </div>
                        }
                    </div>
                </div>


                <div className="flex-center gap-5">
                    <button
                        onClick={closeChat}
                        className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                    >
                        <RiCloseFill className='text-3xl' />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
