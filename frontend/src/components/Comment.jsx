import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { useNavigate } from "react-router-dom";

// aba yo chai comment componet banako, yo chai hamile PostPage ma use greko xa ahile ko lagi
// yesma pani basic designing greko xa using chakra ui

// hamile comment component call garda map greko kina ki tyo method easy hudo rahixa(explained in PostPage page-component)

// yesma pani hamile Actions component use greko xa ko liked state banau nu pareko xa ani Actions comonent use garda props ma yo state pathako xa

// ani like lie hamile liked ko anusar manipulate greko xa, if user le like garyo vaney current like + 1 hunxa ani feri unlike garyo vaney
// tyo pahila ko state ma auxa
// kina ki yo hamile database ma save greko xaina liked vako so rerender garda original unsaved value nai auxa

const Comment = ({ reply, lastReply }) => {
    const navigate = useNavigate();
    return (
        <>
            <Flex gap={4} py={2} my={4} w={"full"} onClick={() => navigate(`/${reply.username}`)} cursor={"pointer"}>
                <Avatar
                    name={reply.username}
                    src={reply.userProfilePic ? reply.userProfilePic : "https://bit.ly/broken-link"}
                    size={"sm"}
                ></Avatar>
                <Flex gap={1} w={"full"} flexDirection={"column"}>
                    <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={700}>
                            {reply.username}
                        </Text>
                        {/* <Flex gap={2} alignItems={"center"}>
                            <Text fontSize={"sm"} color={"gray.light"}>
                                {createdAt}
                            </Text>
                            <BsThreeDots></BsThreeDots>
                        </Flex> */}
                    </Flex>
                    <Text>{reply.text}</Text>
                </Flex>
            </Flex>
            {!lastReply ? <Divider my={4}></Divider> : null}
        </>
    );
};

export default Comment;
