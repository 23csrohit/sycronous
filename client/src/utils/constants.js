export const HOST = import.meta.env.VITE_SERVER_URL


// auth Routes
export const authRoutes = `/api/auth`

export const SIGNUP_ROUTE = `${authRoutes}/signup`
export const LOGIN_ROUTE = `${authRoutes}/login`
export const GET_USERINFO_ROUTE = `${authRoutes}/user-info`
export const UPDATE_PROFILE_ROUTE = `${authRoutes}/update-profile`
export const LOGOUT_ROUTE = `${authRoutes}/logout`


// contacts Routes
export const contactsRoutes = `/api/contacts`

export const SEARCH_CONTACTS_ROUTE = `${contactsRoutes}/search-contacts`
export const GET_CONTACTS_FOR_DM_LIST_ROUTE = `${contactsRoutes}/get-contacts-for-dm`
export const GET_ALL_CONTACTS_ROUTE = `${contactsRoutes}/get-all-contacts`


// message Routes
export const messageRoutes = `/api/message`

export const GET_ALL_MESSAGES_ROUTE = `${messageRoutes}/get-all-messages`



// channel Routes
export const channelRoutes = `/api/channel`

export const CREATE_CHANNEL_ROUTE = `${channelRoutes}/create-channel`
export const GET_USER_CHANNELS_ROUTE = `${channelRoutes}/get-user-channels`
export const GET_CHANNELS_MESSAGES_ROUTE = `${channelRoutes}/get-channels-messages`


