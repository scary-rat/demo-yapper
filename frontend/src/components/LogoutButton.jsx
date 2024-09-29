import React from "react";
import useShowToast from "../../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { useSetRecoilState } from "recoil";
import { FiLogOut } from "react-icons/fi";

import { Button, Flex, Text } from "@chakra-ui/react";
import { authScreenAtom } from "../atoms/authAtom";
import { useNavigate } from "react-router-dom";

// aba jaba logout button press garxam ni, tesle k garxa vaney logout rout ma request pathauxa, tesle cookies ta clear hunxa ani
// plus hami user vanni kun global state bana ko thiyo ni teslie pani null garxam ani jun local storage ma save greko xa ni teslie pani delete garxam

const LogoutButton = () => {
    const customToast = useShowToast();
    const setUserAtomValue = useSetRecoilState(userAtom);
    const setAuthScreenAtomValue = useSetRecoilState(authScreenAtom);
    const navigation = useNavigate();
    const handleLogout = async () => {
        try {
            console.log("trying");
            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/users/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // yo credentials vneko chai cookies ko access dine ki nai vneko, eslie include grena vaney browser ma cookies save hunnxa
                // ani logout garda pani include garnu parxa natra cookies delete hunnxa
                credentials: "include",
            });
            const data = await res.json();

            // response ma error ayo vaney toast send greko, ani error ayo vaney chai e batai return pani greko
            if (data.error) {
                customToast("Error", data.error, "error");
                return;
            }
            // response ma messsage ayo vaney toast send greko successful vnera
            if (data.message) {
                customToast("Success", data.message, "success");
            }

            // auth page ko userScreen state ahile signup vko xa so teslie login garam
            setAuthScreenAtomValue("login");

            // ani logout successful vyo vaney local storage bata remove greko ani global user state lie pani null greko
            localStorage.removeItem("user-threads");
            setUserAtomValue(null);
            navigation("/auth");
        } catch (error) {
            // main error yesmai ako thiyo malie kinaki yesma error.message vneko string hunu parxa
            // mahile first ma customToast("Error", error, "error"); error matra pass greko jun euta object ho tesaile error ako
            customToast("Error", error.message, "error");
        }
    };
    return (
        <Button position={"fixed"} top={"30px"} right={"30px"} size={"sm"} onClick={handleLogout}>
            <Flex gap={"10px"} alignItems={"center"}>
                <Text>Logout</Text>
                <FiLogOut fontSize={"sm"} />
            </Flex>
        </Button>
    );
};

export default LogoutButton;
