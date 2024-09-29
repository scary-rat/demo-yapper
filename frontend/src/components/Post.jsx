import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../../hooks/useShowToast";
import { DeleteIcon } from "@chakra-ui/icons";
import { Spinner } from "@chakra-ui/react";

// yo chai javascript ko library ho yele chai hamile kati time agadi post crete vko tyo seconds, minutes, hours, days, years samma ko measurement dinxa
// yema tara hamile created at ko time dinu parxa
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import allPostAtom from "../atoms/allPostAtom";

// User page chai mainly 2 major components le bneko xa, UserHeader component ra UserPost component
// Yo chai hamro UserPost component ho

// hamile esma pahila ta UserPost component call garda ko sab props lie get greko xa
// ani liked xa ki xaina vnera euta state banako xa

// ani basic designing greko xa chakra ui use grera
// bus yesma hamile like, comment, repost, share ko lagi xuttai Action vani component banako xa

// hamile Action lie xutttai component banako kina bhanye tyo many tham ma reuse vako xa
// ani arko euta main reason chai yo click garda liked ra unliked ko state change hunxa
// so yeslie xutai component na greko bhaye yo UserPost vanni component purai rerender hunthiyo like garda
// aba xutai component banako le like ki unlike garda tyo Actions componet matra rerender hunxa

// so yo jahilai mind ma rakhnu parxa ki kun kura lie component banau ni ani kun lie component na banauni

// yesma hamile image display garna pani contidional use greko xa, if user le post garda without image greko xa vani
// pani without error chalxa
// halile check greko xa post.img && image
// yesko matlab post.img true xa vani matra Image display gara, false xa vani nagara

// ani hamile tyo sab props bata ako data lie pani use greko xa

// Note: hamile direct Acctions vitra pani liked state define garna skthiyem but tyo liked xa ni nai tesko anusar hamile
// yo user post vanni parent component ma changes greko xa tesaile hamile actions vitra greko vye parent lie liked ki unliked
// state xa vnera vanna sakidaina kita dherai garo hunxa, so hamile yo state parent vitra define greko
// so hamile yo pani dhyan rakhnu parxa ki parent component ma state define garni ki chaild ma garni

// yo chai hamile UserPost component batai sab copy greko xa

// yesma aba hamilie user ko post anusar usko profile pic ra username chiyeko xa
// tesaile hami yesma user ko profile pani fetch garxam
// yo jun post ako xa ni, tesma chai post.postedBy ma jun user le post greko tesko id xa
// so using that id hami data fetch garna sakxam
// tyo data fetch grera user state ma save garni ani tehi user ma set greko object bata post ko owner ko name ra profile pic set garni

// ani hami jun yo post xa ni teslie hami actions ma pani send garxam
// so that we can track yo post kasle kasle like haru greko xa vnera tract garna very easy hunxa
// pahila hamile ta liked ki ra set unlike state pass greko thiyem frontend ma

const Post = ({ post }) => {
    const userIdOfPostCreator = post.postedBy;

    const loggedInUser = useRecoilValue(userAtom);

    // yo chai hamile each post kasle post greko tyo user lo data store grna ko lagi state banako

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    // aba hami yo component ma delete function pani rakheko xa, for it to work properly hamile delete grepaxi
    // tyo post global state bata pani hatnu parxa ni so hami delete successful vye paxi tyo deleted post lie
    // global state bata filter grera nikalxam

    const setAllPostAtomValue = useSetRecoilState(allPostAtom);

    const customToast = useShowToast();

    const navigate = useNavigate();

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                // hami post ko createdBy vanni kun key xa tyo pass grera fetch greko, yeto garda hamilie
                // user ko data auxa backend bata
                // yo chai hamile user ko name profile haru sab post ko side ma jun user ko tyo porifle ma jani link xa ni
                // tya display garna ko lagi use greko
                setLoading(true);
                const res = await fetch(`${import.meta.env.VITE_BASE_URI}/users/profile/${userIdOfPostCreator}`);
                const data = await res.json();
                if (data.error) {
                    customToast("Error", data.error, "error");
                    return;
                }

                setUser(() => data);
            } catch (error) {
                setUser(() => null);
                customToast("Error", error.message, "error");
            } finally {
                setLoading(false);
            }
        };
        getUserProfile();
    }, [userIdOfPostCreator, customToast]);

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
            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/posts/delete/${post._id}`, {
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
                return prev.filter((eachPost) => eachPost._id !== post._id);
            });

            customToast("Success", data.message, "success");
        } catch (error) {
            customToast("Error", error.message, "error");
        } finally {
        }
    };

    if (loading) {
        return;
    }

    // tara aba k xa vaney ni so sab link ma wrapped xa hai, tara aba user ko pfp ki ta username ma click grda kheri malie ta user ko page ma janu xa
    // but yo sab ta Link ma wrapped xa jun chai post ko page ma janxa
    // so tesk lagi hami tyo specific profile box lie prevent defailt garna sakxam ani use navigate greera user ko profile ma navigate garna sakxam

    return (
        <Link to={`/${user?.username}/post/${post._id}`}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar
                        size="md"
                        name={user?.username}
                        src={user.profilePic}
                        // yesma testo greko yo link ma wrapped xa tara prevent default grera chiye ko page ma navigate greko
                        onClick={(event) => {
                            event.preventDefault();
                            navigate(`/${user.username}`);
                        }}
                    />
                    <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                        {/* aba repleis haru xavni tesko first 3 reply haruko pfp dekhau ni */}
                        {/* euta pani reply xaina vani panda dekhau ni */}
                        {/* euta reply xa vani first wala ko dekhau ni, 2 ta xa vani first ra second dubai ko */}
                        {/* 3 ta xa vani first, second ra 3rd 3tai ko, ani 3 vanda badi xa vney pani 3 ta ko matra dekhau ni */}
                        {post.replies.length === 0 && <Text textAlign={"center"}>🐼</Text>}
                        {post.replies[0] && (
                            <Avatar
                                size="xs"
                                name={post.replies[0].username}
                                src={
                                    post.replies[0].userProfilePic ? post.replies[0].userProfilePic : "https://bit.ly/broken-link"
                                }
                                position={"absolute"}
                                top={"-10px"}
                                left="12px"
                                padding={"2px"}
                            />
                        )}
                        {post.replies[1] && (
                            <Avatar
                                size="xs"
                                name={post.replies[1].username}
                                src={
                                    post.replies[1].userProfilePic ? post.replies[1].userProfilePic : "https://bit.ly/broken-link"
                                }
                                position={"absolute"}
                                top={"5px"}
                                right="-15px"
                                padding={"2px"}
                            />
                        )}
                        {post.replies[2] && (
                            <Avatar
                                size="xs"
                                name={post.replies[2].username}
                                src={
                                    post.replies[2].userProfilePic ? post.replies[2].userProfilePic : "https://bit.ly/broken-link"
                                }
                                position={"absolute"}
                                top={"5px"}
                                left="-15px"
                                padding={"2px"}
                            />
                        )}
                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text
                                fontSize={"sm"}
                                fontWeight={"bold"}
                                onClick={(event) => {
                                    event.preventDefault();
                                    navigate(`/${user.username}`);
                                }}
                            >
                                {user?.username}
                            </Text>
                            <Image src="/verified.png" w={4} h={4} ml={1} />
                        </Flex>
                        {/* style={{ whiteSpace: "nowrap" }} yestari inline styling pani garna milxa as a object pass grera inside style prop */}
                        {/* property ko name chai as a key pass garni parxa example : width, height chai as key hunxa ani tesko value pass garni */}
                        <Flex gap={4} alignItems={"center"}>
                            <Text fontSize={"small"} color={"gray.light"} style={{ textWrap: "nowrap" }}>
                                {/* formatDistanceToNow chai function/method ho yesle chai distance between given date ra current date dinxa re */}
                                {/* hamile props ma purano date diney example 1st jan 2023 ani yesle chai ahile 1st jan 2024 chali rako xa vaney
                                    1 year return garxa in words 
                                */}
                                {formatDistanceToNow(new Date(post.createdAt))} ago
                            </Text>
                            {loggedInUser?._id === post.postedBy && (
                                <DeleteIcon size={16} onClick={handleDeletePost}></DeleteIcon>
                            )}
                        </Flex>
                    </Flex>

                    <Text fontSize={"sm"}>{post.text}</Text>
                    {post.img && (
                        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                            <Image src={post.img} w={"full"} />
                        </Box>
                    )}

                    <Flex gap={3} my={1}>
                        <Actions post={post} />
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    );
};

export default Post;
