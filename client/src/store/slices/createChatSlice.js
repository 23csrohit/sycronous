export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    directMessagesContacts: [],
    channels: [],

    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setselectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
    setDirectMessagesContacts: (directMessagesContacts) => set({ directMessagesContacts }),
    setChannels: (channels) => set({ channels }),
    addChannel: (channel) => {
        const channels = get().channels
        set({ channels: [channel, ...channels] })
    },
    closeChat: () => set({
        selectedChatType: undefined,
        selectedChatData: undefined,
        selectedChatMessages: []
    }),
    addMessage: (message) => {
        const selectedChatType = get().selectedChatType
        const selectedChatMessages = get().selectedChatMessages

        set({
            selectedChatMessages: [
                ...selectedChatMessages,
                {
                    ...message,
                    recipient: selectedChatType === 'channel'
                        ? message.recipient
                        : message.recipient._id,
                    sender: selectedChatType === 'channel'
                        ? message.sender
                        : message.sender._id,
                }
            ]
        })
    },
    // move channel on 1st place as message receive/send
    addChannelInChannelList: (message) => {
        const allChannels = get().channels
        const currentChannelData = allChannels.find(channel => channel._id === message.channelId)
        const currentChannelIndex = allChannels.findIndex(channel => channel._id === message.channelId)

        if (currentChannelIndex !== -1 || currentChannelIndex !== undefined) {
            allChannels.splice(currentChannelIndex, 1)
            allChannels.unshift(currentChannelData)
        }
    },
    addContactsInDMContacts(message) {
        const userId = get().userInfo._id;
        const fromId = 
            message.sender._id === userId 
                ? message.recipient._id 
                : message.sender._id;
        const fromData = 
            message.sender._id === userId 
                ? message.recipient 
                : message.sender;
    
        const dmContacts = get().directMessagesContacts;
        const data = dmContacts.find((contact) => contact._id === fromId);
        const index = dmContacts.findIndex((contact) => contact._id === fromId);
        console.log({ data, index, dmContacts, userId, message, fromData });
    
        if (index !== -1 && index !== undefined) {
            console.log("in if condition");
            dmContacts.splice(index, 1);
            dmContacts.unshift(data);
        } else {
            console.log("in else condition");
            dmContacts.unshift(fromData);
        }
    
        set({ directMessagesContacts: dmContacts });
    }
    

});