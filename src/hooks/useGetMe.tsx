'use client'
import { useEffect } from "react"
import axios from "axios"
import { useDispatch } from "react-redux";
import { setUserData } from "@/redux/userSlice";

const useGetMe = (status: string) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (status !== "authenticated") return;

        const getMe = async () => {
            try {
                const { data } = await axios.get("/api/user/me");
                dispatch(setUserData(data));
            } catch (error) {
                console.log(error);

            }
        };

        getMe();
    }, [status]);
};

export default useGetMe;