import { apiClient } from "@/lib/api-client";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store"
import { GET_ALL_MESSAGES_ROUTE, GET_CHANNELS_MESSAGES_ROUTE } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import rocketIcon from '@/assets/icons/rocket-icon.png'


const MessageLoadingSkeleton = () => (
  <div className="flex flex-col h-full gap-5">
    {/* on the left side */}
    <div className="flex flex-col gap-5">
      <div className="h-9 w-2/3 flex items-start justify-start rounded-lg skeleton"></div>
      <div className="h-9 w-1/3 flex items-start justify-start rounded-lg skeleton"></div>
    </div>

    {/* on the right side */}
    <div className="flex flex-col items-end gap-5">
      <div className="h-9 w-1/3 rounded-lg skeleton"></div>
      <div className="h-9 w-1/4 rounded-lg skeleton"></div>
      <div className="h-[200px] w-[200px] md:w-2/5 rounded-lg skeleton"></div>
    </div>

    <div className="flex flex-col gap-5">
      <div className="h-9 w-1/4 rounded-lg skeleton"></div>
    </div>

  </div>
)


const MessageContainer = () => {
  const scrollRef = useRef();
  const { selectedChatType, selectedChatData, selectedChatMessages, token, setselectedChatMessages, userInfo } = useAppStore();
  const previousMessagesLength = useRef(0);
  const [messageLoading, setMessageLoading] = useState(false)

  // scrol down as new message come
  useEffect(() => {
    const isInitialLoad = previousMessagesLength.current === 0;
    const hasNewMessage = selectedChatMessages.length > previousMessagesLength.current;

    if (scrollRef.current) {
      if (isInitialLoad) {
        // Jump directly to the last message on initial load
        scrollRef.current.scrollIntoView({ behavior: "auto" });
      } else if (hasNewMessage) {
        // Scroll smoothly to the last message if there are new messages
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }

    // Update the previous message length to the current message length
    previousMessagesLength.current = selectedChatMessages.length;
  }, [selectedChatMessages]);


  // fetch messages
  useEffect(() => {
    try {
      // get All personal Messages
      const getAllMessages = async () => {
        setMessageLoading(true)
        const response = await apiClient.post(GET_ALL_MESSAGES_ROUTE,
          { token, recipientId: selectedChatData._id },
          { withCredentials: true }
        )
        setMessageLoading(false)
        console.log("GET_ALL_MESSAGES_ROUTE RESPONSE => ", response)
        if (response.data.AllMessages) {
          setselectedChatMessages(response.data.AllMessages)
        }
      }

      // get Channels Messages
      const getChannelsMessages = async () => {
        setMessageLoading(true)
        const response = await apiClient.post(GET_CHANNELS_MESSAGES_ROUTE,
          { token, channelId: selectedChatData._id },
          { withCredentials: true }
        )
        console.log("GET_CHANNELS_MESSAGES_ROUTE RESPONSE => ", response)
        if (response.data.channelMessages) {
          setselectedChatMessages(response.data.channelMessages)
        }
        setMessageLoading(false)
      }


      if (selectedChatData._id) {
        if (selectedChatType === 'contact') {
          getAllMessages()
        } else if (selectedChatType === 'channel') {
          getChannelsMessages()
        }
      }
    } catch (error) {
      console.log('GET_ALL_MESSAGES_ROUTE ERROR => ', error)
    }
  }, [selectedChatData, token, setselectedChatMessages, selectedChatType])



  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={message._id + index}>
          {showDate && <div className="text-center text-gray-500 my-2">
            {moment(message.timestamp).format("LL")}
          </div>
          }

          {selectedChatType === 'contact' && renderDMMessages(message)}
          {selectedChatType === 'channel' && renderChannelMessages(message)}
        </div>
      );
    });
  };


  const renderDMMessages = (message) => (
    <div
      className={`flex flex-col
        ${message.sender === selectedChatData._id ? "items-start" : "items-end"}`}
    >
      {message.messageType === "text" && (
        <div
          className={`
            ${message.sender === selectedChatData._id
              ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
              : "bg-[#8417ff]/5 text-[#8417ff] border-[#8417ff]/50"
            }
            border inline-block p-4 rounded my-1 max-w-[50%] break-words
          `}
        >
          {message.content}
        </div>
      )}
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );


  // render Channel Messages
  const renderChannelMessages = (message) => (

    <div
      className={`flex flex-col my-5
      ${message.sender._id === userInfo._id ? "items-end" : "items-start"}`}
    >
      {message.messageType === "text" && (
        <div
          className={`
          ${message.sender._id === userInfo._id
              ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
              : "bg-[#8417ff]/5 text-[#8417ff] border-[#8417ff]/50 ml-8"
            }
          border inline-block p-4 rounded my-1 max-w-[50%] break-words
        `}
        >
          {message.content}
        </div>
      )}

      {message.sender._id !== userInfo._id ?
        <div className="flex items-center gap-3 my-1 text-sm capitalize">
          <Avatar className="w-7 h-7 rounded-full overflow-hidden">
            {message.sender.image ? <AvatarImage
              src={message.sender.image}
              className="bg-black w-full h-full object-cover"
              alt='profile'
            />
              : <div
                className={`w-7 h-7 text-lg flex-center uppercase font-bold border-[1px] rounded-full 
                         ${getColor(message.sender.color)}`}
              >
                {
                  message.sender.firstName ? message.sender.firstName.split("").shift()
                    : message.sender.email.split("").shift()
                }
              </div>
            }
          </Avatar>

          <p className="text-sm text-white/70">
            {`${message.sender.firstName} ${message.sender.lastName}`}
          </p>
          <div className="text-xs text-white/70">
            {moment(message.timestamp).format("LT")}
          </div>
        </div>

        :
        <div className="text-xs text-white/70">
          {moment(message.timestamp).format("LT")}
        </div>
      }



    </div>
  )


  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 md:px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {
        // show loading skeleton
        messageLoading ? <MessageLoadingSkeleton />
          :
          selectedChatMessages.length <= 0 ? (
            <div className="flex-center h-full  w-full">
              <div className="text-[#ff6c17] text-5xl font-bold flex-center w-full gap-">
                Let&#8245;s Go...
                <img src={rocketIcon} className="w-[90px] h-" alt='Rocket Icon' />
              </div>
            </div>
          ) : (
            // render actual messages
            <>{renderMessages()}</>
          )
      }

      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;
