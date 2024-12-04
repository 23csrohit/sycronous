import { useAppStore } from "@/store"
import EmojiPicker from "emoji-picker-react"
import { useEffect, useRef, useState } from "react"
import { useSocket } from "@/context/SocketContext"

// icons
import { GrAttachment } from 'react-icons/gr'
import { IoSend } from "react-icons/io5"
import { RiEmojiStickerLine } from "react-icons/ri"

const MessageBar = () => {

    const emojiPickerRef = useRef(null)
    const [message, setMessage] = useState('')
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
    const { userInfo, selectedChatData, selectedChatType } = useAppStore()
    const socket = useSocket()
    const inputRef = useRef()

    // console.log({ userInfo, selectedChatData, selectedChatType })

    // add emoji in input
    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji)
    }


    // send message 
    const handleSendMessage = async () => {
        if (message) {
            if (selectedChatType === 'contact') {
                socket.emit("sendMessage", {
                    sender: userInfo._id,
                    recipient: selectedChatData._id,
                    content: message,
                    messageType: 'text',
                    fileUrl: undefined
                })
            }
            else if (selectedChatType === 'channel') {
                socket.emit("send-channel-message", {
                    sender: userInfo._id,
                    channelId: selectedChatData._id,
                    content: message,
                    messageType: 'text',
                    fileUrl: undefined
                })
            }
        }
        setMessage('')
        // console.log("Message sent through socket ")
    }

    // close emoji picker , if outside click
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (e.target.id !== 'emoji-open') {

                if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
                    setEmojiPickerOpen(false)
                }
            }
        }
        document.addEventListener('mousedown', handleOutsideClick)
        return () => document.removeEventListener('mousedown', handleOutsideClick)
    }, [emojiPickerRef])

    // console.log("emojiPickerOpen = ", emojiPickerOpen)


    // if 'Enter' button clicked, then send msg
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };


    // Focus the input field when the chat is opened
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [selectedChatData])


    return (
        <div className="bg-[#1c1d25] md:h-[10vh] px-4 md:px-8 mb-2 md:mb-4 flex-center gap-2 md:gap-6 ">
            <div className="bg-[#2a2b33] flex flex-1 rounded-md items-center gap-5 pr-5 ">
                {/* messgae input */}
                <input
                    type='text'
                    placeholder="Enter a message"
                    value={message}
                    ref={inputRef}
                    onKeyUp={handleKeyPress}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-transparent w-[70px] px-3 py-5 md:p-5 flex-1 rounded-md focus:border-none focus:outline-none "
                />
                <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
                    <GrAttachment className='text-2xl' />
                </button>

                {/* emoji button */}
                <div className="relative">
                    <button
                        onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
                        className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                    >
                        <RiEmojiStickerLine className='text-2xl' />
                    </button>
                    {/* emoji picker */}
                    <div className="absolute bottom-16 right-0" ref={emojiPickerRef} >
                        <EmojiPicker
                            theme='dark'
                            open={emojiPickerOpen}
                            onEmojiClick={handleAddEmoji}
                            autoFocusSearch={false}
                        />
                    </div>
                </div>
            </div>

            {/* send message button */}
            <button
                onClick={handleSendMessage}
                className="bg-[#8417ff] hover:bg-[#741bda] flex-center p-5 rounded-md focus:border-none focus:outline-none
                         active:scale-90 duration-300 transition-all">
                <IoSend

                    className='text-2xl'
                />
            </button>
        </div>
    )
}

export default MessageBar