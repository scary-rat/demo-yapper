import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import { useNavigate, useParams } from "react-router-dom";
import useShowToast from "../../hooks/useShowToast";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { formatDistanceToNow } from "date-fns";
import allPostAtom from "../atoms/allPostAtom";

// yo chai hamile post page banako
// yesko chai ui ehi page ma xa tara actions ra comment component pani use greko xa
// action ko lagi liked state define greko xa ani tyo component use gardaa send greko xa (detail clear explanation in UserPost, comment component)
// ani hamile Comment component lie map gerko xa with data yo method easy hudo rahixa (detail explanation in UserPage page-component)

// hamile liked xa ki nai tyo basic ma likes ko count lie pani manipulate greko xa
// ani like lie hamile liked ko anusar manipulate greko xa, if user le like garyo vaney current like + 1 hunxa ani feri unlike garyo vaney
// tyo pahila ko state ma auxa
// kina ki yo hamile database ma save greko xaina liked vako so rerender garda original unsaved value nai auxa

// aru ta sab simple ui design using chakra ui ani props passing greko xa

const PostPage = () => {
    const loggedInUser = useRecoilValue(userAtom);

    const { user, loading } = useGetUserProfile();

    const [allPostAtomValue, setAllPostAtomValue] = useRecoilState(allPostAtom);

    const [gettingPost, setGettingPost] = useState(true);

    const customToast = useShowToast();

    const { postId, username } = useParams();

    const navigate = useNavigate();

    // aba hami delete garna ko lagi pani euta function banau ni
    const handleDeletePost = async (event) => {
        try {
            // palila ta prevent default garni kina ki yo post sab Link vitra xa, like a tag vitra xa ani delete button ni a tag vitra xa
            // prevent default grena vani tyo a tag le href vko path ma lanxa instead of deleting
            event.preventDefault();
            // user lie confirm garauni ki post delete garni ki nai vnera
            if (!window.confirm("Are you sure you want to delete this yapp?")) {
                return;
            }
            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/posts/delete/${postId}`, {
                method: "delete",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await res.json();
            if (data.error) {
                customToast("Error", data.error, "error");
                return;
            }

            // so aba delete vye pani hami teslie allPostAtomValue i.e global state bata pani remove garni
            // ani tyo ui ma reflect hunxa without refresh

            // tesko logic chai hami new array banayera teslie return garni
            // tyo new array kasto hunxa vaney ahile jun delete greko array xa ni tyo array bayek global post ma jati pani aru post thiye
            // tyo jasta ko testai halni, so new array ma sab post hunxa except hamile jaslie delete greko thiyem
            // yo achive garna chai hamile filter use greko xam
            setAllPostAtomValue((prev) => {
                return prev.filter((eachPost) => eachPost._id !== postId);
            });

            customToast("Success", data.message, "success");
        } catch (error) {
            customToast("Error", error.message, "error");
        } finally {
        }
    };

    useEffect(() => {
        const getPost = async () => {
            try {
                setGettingPost(true);

                // tyo nam ko user xaina vani post fetch nai na garni kina ki user nai xaina vani tesko post kasari hunxa
                if (!user) {
                    return;
                }

                const res = await fetch(`${import.meta.env.VITE_BASE_URI}/posts/${postId}`);

                const data = await res.json();

                if (data.error) {
                    return customToast("Error", data.error, "error");
                }

                // yo post page ma fetch greko data pani hami global ma set garni ho
                // so menuing global post state cvhai flexible hunxa, yo page ma jsti ota post xa jasko pani post huna sakxa
                // tyo yo global post ma hunxa
                // could be just 1 post, could be user ko sab post, could be user ko all feed ko post
                setAllPostAtomValue(() => [data]);
            } catch (error) {
                customToast("Error", error.message, "error");
            } finally {
                setGettingPost(false);
            }
        };
        getPost();
    }, [user, customToast]);

    if (gettingPost || loading) {
        return (
            <Box
                w={"100vw"}
                height={"100vh"}
                bg={"gray.dark"}
                pos={"fixed"}
                top={0}
                left={0}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Spinner width={69} height={69}></Spinner>
            </Box>
        );
    }
    if (!gettingPost && !loading && allPostAtomValue.length < 1) {
        return (
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Text>No post found</Text>
            </Box>
        );
    }

    const thisPost = allPostAtomValue[0];

    return (
        <>
            <Flex>
                <Flex w={"full"} alignItems={"center"} gap={3} cursor={"pointer"} onClick={() => navigate(`/${user.username}`)}>
                    <Avatar
                        src={user.profilePic ? user.profilePic : "https://bit.ly/broken-link"}
                        size={"md"}
                        name={user.name}
                    ></Avatar>
                    <Flex>
                        <Text>{user.username}</Text>
                        <Image src="/verified.png" w={4} h={4} ml={4}></Image>
                    </Flex>
                </Flex>
                <Flex gap={4} alignItems={"center"}>
                    <Text fontSize={"small"} color={"gray.light"} style={{ textWrap: "nowrap" }}>
                        {/* formatDistanceToNow chai function/method ho yesle chai distance between given date ra current date dinxa re */}
                        {/* hamile props ma purano date diney example 1st jan 2023 ani yesle chai ahile 1st jan 2024 chali rako xa vaney
                                    1 year return garxa in words 
                                */}
                        {formatDistanceToNow(new Date(thisPost.createdAt))} ago
                    </Text>
                    {loggedInUser?._id === thisPost.postedBy && <DeleteIcon size={16} onClick={handleDeletePost}></DeleteIcon>}
                </Flex>
            </Flex>
            <Text my={3}>{thisPost.text}</Text>
            {thisPost.img && (
                <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                    <Image src={thisPost.img} w={"full"} />
                </Box>
            )}

            <Flex gap={3} my={3}>
                <Actions post={thisPost}></Actions>
            </Flex>

            <Divider my={4}></Divider>
            <Flex justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"2xl"}>👋</Text>
                    <Text color={"gray.light"}>Get the app to like, reply and post</Text>
                </Flex>
                <Button>Get</Button>
            </Flex>
            <Divider my={4}></Divider>

            {thisPost.replies.map((reply, index) => {
                return (
                    <Comment
                        key={`${index}${thisPost._id}`}
                        reply={reply}
                        lastReply={index === thisPost.replies.length - 1}
                    ></Comment>
                );
            })}
        </>
    );
};

export default PostPage;
