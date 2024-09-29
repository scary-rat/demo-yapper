import {
    Avatar,
    Box,
    Button,
    Flex,
    Link as ChakraLink,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Portal,
    Text,
    VStack,
    useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import useShowToast from "../../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";

// User page chai mainly 2 major components le bneko xa, UserHeader component ra UserPost component
// Yo chai hamro UserHeader component ho

// yesma hamile basic design greko xa using chakra ui ani yo chakra ui
// hamile VSTack vitra sab wrap greko xa because design nai testo thiyo
// hamile dropdown portal jasto pani use greko xa which allow us to copy user ko url

// yo copy url ko lagi chai euta function banako xa
// yo function le url ko link get garxa ani teslie clipboard ma copy garxa ani tyo copy vyepaxi hamile chakra ui ko toast display grakoxa
// toast ko lagi hamile useToast hook use gareko jun chakra ui le nai provide garxa

// Lesson learned :
// hami hook haru use garda teslie functional component mai i.e main component mai define garnu parxa const toast = useToast(); vnera
// hamile inner function ma const toast = useToast(); garyo vani react hook usuage policy error auxa

// so hamile copyUrl functin vitra useToast(); garni haina, main functional component i.e UserHeader vitrai useToast(); garnu parxa

// aba hami yo component ma chai jun user ko data ako xa teslie use grera dynamic banau ni
// logged in user ko data state ma store grera rakhni ani jun user ko profile visit greko xa tyo ta hamilie props bata user object ma ako hunxa
const UserHeader = ({ user }) => {
    const customToast = useShowToast();

    // logged in user ko data liyera rakni
    const loggedInUser = useRecoilValue(userAtom);

    const navigate = useNavigate();

    // aba logged in user le current jun user ko profile view greko xa teslie follow greko xa ki nai tesko lagi pani euta state banau ni ani
    // tyo true ki false store grera rakhni
    // check garna chai hamile k greko xa vani ni
    // current logged in user ko id, jun user ko data hamile get grera yo component ma pass greko thiyem ni tesko followers list ma xa ki xaina
    // tyo check grerko, current logged in user ko id tyo followers array ma vye true return garxa navaye false auxa kina ki include use greko xa

    // ani tara user logged in nai xaina vaney ta check garna milena kina ki loggedInUser ta null xa so null._id garda ta error auxa
    // tesaile hamile ?. use greko that means ki loggedInUser null navaye matra tyo check garni
    // ani || false pani greko xa, meaning user.followers.includes(loggedInUser._id) null/undefined vye false hunxa vnera

    // paxi hami yeli following true xa ki false xa tesle follow button render garauni ho

    const [following, setFollowing] = useState(user.followers.includes(loggedInUser?._id) || false);

    // aba euta updating vanni state pani banauni kina ki hamilie jaba samma fetch request fullfil hudai ta taba samma button vitra loading chaiye ko xa
    // suruma false hunxa ani fetch garda like async function ko try vitra tyo true set garni, ani try catch finally ko finally vitra tyo feri false set garni
    // finally vye chai try complete vye ni, catch compelte vye ni tespaxni finally chai every time run gara vneko hunxa so finally always run hunxa
    const [updating, setUpdating] = useState(false);

    const copyUrl = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            customToast("Success", "Profile URL copied", "success");
        });
    };

    // aba yo chai follow unfollow handle garxa when clicked on the follow button
    const handleFollowUnfollow = async () => {
        // frontend mai hami check garam ki user logged in xa ki nai
        // logged in na vaye fetch nai na garni
        // tara yo always hunna so backend ko lagi pani hamile yo functionality banako xa using middle ware

        if (!loggedInUser) {
            customToast("Error", "You must be logged in to perform this action", "error");
            return;
        }

        // hamile follow button thichem ani tyo fetch request chali rako xa, tara tyo chalda chaldai hamile feri follow button thichim vaney
        // yo function bata directly bahira jani

        if (updating) {
            return;
        }

        // aba try ma chai hami fetch ma post request send garni to follow ki ta unfollow
        try {
            setUpdating(true);
            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/users/follow/${user._id}`, {
                method: "post",
                headers: {
                    Content: "application/json",
                },
                credentials: "include",
            });
            const data = await res.json();

            // aba eta mostly error kina auxa vne ni, hamile logged in nagareko vaye so logged in navaye auth page ma navigate garni error show grera
            // ani function bata return garni
            if (data.error) {
                customToast("Error", data.error, "error");
                navigate("/auth");
                return;
            }

            // data.error ayena vani successfully fetch complete vyo so below code run hunxa
            // aba tyo backend ma vko hami frontend ma similation grera dekhauni without fetching the new data again
            // hamile yo jun user ko profile ma xam ni teslie feri fetch garda ni hunxa but fetch request vneko data base sanga communication
            // time pani dherai lagxa ani resource pani dherai lagxa, example 10000000 users le ekai choti follow grey vani
            // follow garda pani 10000000 times post request gyo ani aba fer 10000000 times get reqest pani jani vo
            // so tehi get 10000000 get request lie prevent garna hami yo frontend mai simulate garna sakxam

            // simulation ko lagi, pailai follow greko tyiyo ahile unfollow press greko vye
            // jun hamilie user ko detail ako thiyo ni as props, teslie modify garni tesko jun yeni last element pop grera nikalni
            // kina ki hamile follower ta array.length use grera show greko xa so array ko length by 1 less vo, ani tyo pani update hunxa when component re renders

            // ani aba pahila follow greko thiyena ani ahile follow ma perss greko vye
            // jun hamilie user ko detail ako thiyo ni as props, teslie modify garni ani tesma yo current logged in user ko id followers ma push garni
            // yesle array ma 1 item push grera array lo length by 1 badayo, so rerender ma pani tyo update hunxa
            if (following) {
                customToast("Success", `Unfollowed ${user.name}`, "success");
                user.followers.pop();
            } else {
                customToast("Success", `Followed ${user.name}`, "success");
                user.followers.push(loggedInUser._id);
            }

            // ani hami aba set garni following lie opposite ma, pahila following true vye false garni, false vye true garni

            setFollowing(() => !following);
        } catch (error) {
            customToast("Error", error.message, "error");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <VStack alignItems={"start"}>
            <Flex justifyContent={"space-between"} w={"full"}>
                <Box>
                    <Text fontSize={"2xl"} fontWeight={700}>
                        {user.name}
                    </Text>
                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"sm"}>{user.username}</Text>
                        <Text
                            fontSize={"xs"}
                            bg={useColorModeValue("gray.200", "gray.dark")}
                            color={useColorModeValue("gray.dark", "gray.200")}
                            p={1}
                            borderRadius={"full"}
                        >
                            thread.net
                        </Text>
                    </Flex>
                </Box>
                <Box>
                    <Avatar
                        name={user.name}
                        src={user.profilePic ? user.profilePic : "https://bit.ly/broken-link"}
                        size={{
                            base: "md",
                            md: "xl",
                        }}
                    ></Avatar>
                </Box>
            </Flex>
            <Text color={!user.bio && "gray.light"} opacity={!user.bio && 0.5} mb={3}>
                {user.bio ? user.bio : "Not a real gay without a bio !!"}{" "}
            </Text>
            {/* user logged in vye ani logged in user ko id ra ahile jasko profile logged in user le heri rako xa vani 
                meaning user le afnai profile visit greko xa vani uslie update profile vanera button pani dini to update his profile

                tara koi arkai user ko profile current logged in user le visit greko xa vani uslie yo update profile ko satta follow unfollow button dekhau ni

                .? use greko kina ki user logged in nahuna ni sakxa, ?. grena vani error auxa kina ki we cannot do null._id
            */}
            {loggedInUser?._id === user._id ? (
                <ChakraLink as={ReactRouterLink} to="/profile/update">
                    <Button size={"sm"}>Update Profile</Button>
                </ChakraLink>
            ) : (
                // already follow greko vye Unfollow text dekhau ni, ani follow nagareko vye Follow text dekhauni using mathi banako following state
                <ChakraLink as={ReactRouterLink}>
                    <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
                        {following ? "Unfollow" : "Follow"}
                    </Button>
                </ChakraLink>
            )}
            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"}>{user.followers.length} followers</Text>
                    <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                    <Link color={"gray.light"}>instagram.com</Link>
                </Flex>
                <Flex>
                    <Box className="icon-container">
                        <BsInstagram size={24} cursor={"pointer"}></BsInstagram>
                    </Box>
                    <Box className="icon-container">
                        <Menu>
                            <MenuButton>
                                <CgMoreO size={24} cursor={"pointer"}></CgMoreO>
                            </MenuButton>
                            <Portal>
                                <MenuList bg={"gray.dark"} color={"gray.light"}>
                                    <MenuItem onClick={copyUrl}>Copy Link</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>
            <Flex w={"full"}>
                <Flex
                    flex={1}
                    borderBottom={"1.5px solid"}
                    borderColor={useColorModeValue("black", "white")}
                    justifyContent={"center"}
                    pb={3}
                    cursor={"pointer"}
                >
                    <Text fontWeight={700}>Threads</Text>
                </Flex>
                <Flex
                    flex={1}
                    borderBottom={"1.5px solid gray"}
                    borderColor={"gray.light"}
                    justifyContent={"center"}
                    pb={3}
                    cursor={"pointer"}
                    color={"gray.light"}
                >
                    <Text>Replies</Text>
                </Flex>
            </Flex>
        </VStack>
    );
};

export default UserHeader;
