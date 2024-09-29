import { useEffect, useState } from "react"
import useShowToast from "./useShowToast.js"
import { useParams } from "react-router-dom";

const useGetUserProfile = () => {
    const customToast = useShowToast();
    const [user, setUser] = useState("")
    const { username } = useParams()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getUserProfileData = async () => {
            try {
                setLoading(true)
                // hamile get method use gardai xam ani user logged in navaye pani get chai garna milxa hai 
                // so yo fet chai get method ko lagi auto configred hunxa without credentials wala
                // so yesma chai direct const res = await fetch(`${import.meta.env.VITE_BASE_URI}/${username}` ani const data = await res.json()
                // garey hunxa

                const res = await fetch(`${import.meta.env.VITE_BASE_URI}/users/profile/${username}`, {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    // credentials: "include"
                })

                const data = await res.json()

                if (data.error) {
                    customToast("Error", data.error, "error")
                    return;
                }

                setUser(data)
            } catch (error) {
                customToast("Error", error.message, "error")
            } finally {
                setLoading(false)

            }
        }
        getUserProfileData();
    }, [username, customToast])

    return { loading, user }

}

export default useGetUserProfile;