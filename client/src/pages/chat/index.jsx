import { useAppStore } from "@/store"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import ContactsContainer from "../../components/contacts/ContactsContainer"
import ChatContainer from "../../components/chat/ChatContainer"
import EmptyChatContainer from "../../components/chat/EmptyChatContainer"

const Chat = () => {

  const { userInfo, selectedChatType } = useAppStore()
  const navigate = useNavigate()

  // if profile setup is incomplete then navigate to '/profile' page
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please setup profile to continue...")
      navigate("/profile")
    } 1
  }, [userInfo, navigate])


  return (
    <div className="text-white overflow-hidden h-screen flex border-t-yellow-950">
      <ContactsContainer />
      {
        !selectedChatType ? <EmptyChatContainer /> : <ChatContainer />
      }
    </div>
  )
}

export default Chat