import { Link as ReactRouterLink } from "react-router-dom";
import { Button, Flex, Link as ChakraLink, Text, Spinner, Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../../hooks/useShowToast";
import Post from "../components/Post";
import allPostAtom from "../atoms/allPostAtom";
import SuggestedUsers from "../components/SuggestedUsers";

// aba hamile jun jun user lie follow greko xam ni tini haru sab ko post hami fetch garni
// jahile pani get method use grera fetch garda kheri always use useEffect vitra garnu parxa

const HomePage = () => {
    const loggedInUser = useRecoilValue(userAtom);

    const [loading, setLoading] = useState(true);

    // home page ma pani hami global state use garni
    const [allPostAtomValue, setAllPostAtomValue] = useRecoilState(allPostAtom);

    const customToast = useShowToast();

    useEffect(() => {
        const getFeedPost = async () => {
            try {
                setLoading(true);
                // get method use garda kheri we can skip tyo object kina ki by default yo fetch get method ko lagi configured hunxa
                // tara credentails ko lagi chai hudo rahinaxa so credentials chai include garnu parni rahixa
                const res = await fetch(`${import.meta.env.VITE_BASE_URI}/posts/feed`, {
                    credentials: "include",
                });
                const data = await res.json();

                if (data.error) {
                    customToast("Error", data.error, "error");
                    return;
                }

                console.log(data);

                // data.feedpost kina greko vaney ni hamile backend bata response ma object vitra feedPost object ko data pass greko xa
                // {message: "successful", feedpPosts : feedPosts} yesari greko xa
                // so hamile response ma object pauxam with message as key containing message ko text
                // ani feedPosts as a key containing feed ko details for current logged in user

                // fetch greko sab data hami global posts vani state ma haldini
                //
                setAllPostAtomValue(() => {
                    return data.feedPosts;
                });
            } catch (error) {
                customToast("Error", error.message, "error");
            } finally {
                setLoading(false);
            }
        };
        getFeedPost();
    }, [customToast]);

    console.log(allPostAtomValue);

    if (loading) {
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

    return (
        <Flex gap="10">
            <Box flex={100}>
                {allPostAtomValue.length === 0 && (
                    <>
                        <Text textAlign={"center"} mb={7} color={"gray.light"} opacity={0.7}>
                            Cannot get feed as you follow no one and dont have any post. Post whats happening in the world or
                            follow others to see they are thinking...
                        </Text>
                        {/* <ChakraLink w={"fit-content"} display={"block"} mx={"auto"} as={ReactRouterLink} to={loggedInUser.username}>
                        <Flex w={"full"} justifyContent={"center"}>
                            <Button mx={"auto"}>View Profile</Button>
                        </Flex>
                    </ChakraLink> */}
                    </>
                )}
                {allPostAtomValue.length > 0 && allPostAtomValue.map((post, index) => <Post key={index} post={post}></Post>)}
            </Box>
            {/* <Box flex={30}>
                <SuggestedUsers></SuggestedUsers>
            </Box> */}
        </Flex>
    );
};

export default HomePage;
