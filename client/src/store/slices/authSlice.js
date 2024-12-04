export const createAuthSlice = (set) => (
    {
        userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
        setUserInfo: (userInfo) => set({ userInfo }),
        token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
        setToken: (token) => set({ token }),
    }

)