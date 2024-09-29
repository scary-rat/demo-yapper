import React, { useCallback, useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../../hooks/useShowToast";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import { useRecoilState, useRecoilValue } from "recoil";
import allPostAtom from "../atoms/allPostAtom";

// User page chai mainly 2 major components le bneko xa, UserHeader component ra UserPost component

// hamile yo page ma tyo UserHeader ra UserPost component lie use greko xa required porps pass grera
// yo way chai better rahixa many data lie map grera display garna, because
// aba hamile userpost vitra ko parent div lie map greko vayey tya jun like ko button xa ni tesma problem authiyo
// just like tyo note app ma jasto, tyo note app ma sab ko lagi useState banaunu parni vyera object banayera greko thiyo
// ani jun ma click greko tesko matra true grera baki ko false rakhnu preko thiyo so kasto complicated vko thiyo

// yo method ma hami jun component call garxam, tyo call lie map grera data lie props jasari send garni
// tesma sab ko lagi xutai liked ko state afai banxa so complicated way a kun click vo tesko lagi function banai rakhnu pardaina
// very easily hunxa

// aba hami yo component mai user ko data fetch garxam, for example hami abc ko profile ma gayim vaney abc userko data fetch garni yo page ma
// ani tyo get greko use lie hami as a props user header component ma pass garni
// ani tyo user header lie dynamic banau ni

const UserPage = () => {
    // pahila user vanni state banayera teslie null garam
    // const [user, setUser] = useState(null);

    // hamile userlie get garna euta xuttai hook nai banako xa tesaile mathi ko user lie comment garni
    const { user, loading } = useGetUserProfile();

    // aba hami lie user ko profile ma janu xa vani tyo url bata navigate hunxa, dynamic route bata
    // hamile userParams grera url ma vko username lie store grera rakheko, useParams hook use grera
    const { username } = useParams();

    // aba yo parameter lie hami global url username atom ma save garxam kina ki yo hamile create post main app component ma pani
    // chiyeko xa, create post gloablly xa ani tesma hamilie yo user ko url chaiyeko vyera yesto garnu preko ho

    // post fetch vai rako belako lagi pani loader banau na hami euta state ma true false store grera rakhni
    const [loadingPost, setLoadingPost] = useState(true);

    const customToast = useShowToast();

    // hami post pani yehi component ma fetch garxam ani fetch greko post chai hami all post vanni state ma store grera rakhxam, ani tehi
    // store greko post lie post component ma as a props pass garxam
    // const [allPost, setAllPost] = useState([]);

    // yesto ta vyena hamilie all post many place ma chini rhixa, so many tham ma different state bnayera garda ekai choti sab tham ma reflect nahuni rahixa
    // so hami yesko lagi global state banau xam ani ti bata jun pani component ma post chiyeko xa teslie modify garera global state mai rakhni
    // so hami recoil le state ra atom banauxam es ko lagi

    const [allPostAtomValue, setAllPostAtomValue] = useRecoilState(allPostAtom);

    // aba hami use effect ma yo userko data lie get garxam
    // ani yesko dependency chai jun jun state variable yo useeffect vanda bhira initialise/modify greko xa tara tyo use effect vitra use greko xa tyo tyo hunu parxa

    useEffect(() => {
        // yo code lie comment garidim kina ki hamile user lie get garna ko lagi xutati euta hook nai banako xa
        // const getUser = async () => {
        //     console.log("loading 1");
        //     try {
        //         setLoading(true);
        //         // hamro yo chai get method ho so hamile fetch ma tyo link paxadi ho object pass garnu pardaina, by default configured huxna for get method
        //         const res = await fetch(`${import.meta.env.VITE_BASE_URI}/users/profile/${username}`, {
        //             method: "get",
        //             headers: {
        //                 "Content-Type": "application/json",
        //             },
        //             credentials: "include",
        //         });
        //         const data = await res.json();

        //         if (data.error) {
        //             customToast("Error", data.error, "error");
        //             return;
        //         }
        //         setUser(() => data);
        //     } catch (error) {
        //         customToast("Error", error.message, "error");
        //     } finally {
        //         setLoading(false);
        //     }
        // };

        // aba hami tyo user ko lagi post pani ta fetch garnu parxa so tesko lagi pani euta get user post vanni function banau ni
        const getUserPost = async () => {
            try {
                setLoadingPost(true);
                const res = await fetch(`${import.meta.env.VITE_BASE_URI}/posts/user/${username}`, {
                    method: "get",
                    headers: {
                        "Content-Type": "applicaton/json",
                    },
                });
                const data = await res.json();
                if (data.error) {
                    customToast("Error", data.error, "error");
                    return;
                }
                setAllPostAtomValue(() => data);
            } catch (error) {
                customToast("Error", error.message, "error");
            } finally {
                setLoadingPost(false);
            }
        };

        // aba yo dependency array ma j pani xa ni like j pani variable jun chai useEffect ko bahira banako xa tara yo useEffect vitra lekheko xa vani
        // teslie pani include garnu parxa
        // so username ra customToast pani include garnu parxa
        // but yo customToast ta variable ho which holds function as value i.e custom hook le return greko function ho so yo ta infinite time chalxa
        // so tesko lagi hami callback hook use garnu parxa tyo custom hook vitrai

        getUserPost();
    }, [username, customToast]);

    // react render chai hunxa first time mai, data fetch vai rako xa async way ma so aba jaba samma data fetch hunna taba samma
    // user ta null hunxa
    // so data na ai kana tala ko code haru chalyo vani ta, error auxa kinaki sab tala ko code ta hamile yo data vaneko object ho jasari code greko xa
    // ani tehi hisab le functionality banako xa, like object ko method, array ko method haru use greko xa
    // tyo ta null ma use garna mildaina so tyo sab le error dinxa
    // tesaile jaba samma data fetch vyera user ma data audaina taba samma loading vnera dekhauni

    // aba hamile loading vanera state pani banako xa, loading vai rako xa vani hami spinner dekhau ni

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

    // jaba data auxa component re render hunxa ani user null hunna ani aru code chalxa
    if (!user && !loading) {
        return (
            <Flex minHeight={`calc(100vh - 200px)`} justifyContent={"center"} alignItems={"center"}>
                <Text fontSize={24} textAlign={"center"} color={"gray.light"}>
                    This yapper still in momma's belly, not in here ...
                </Text>
            </Flex>
        );
    }

    return (
        <div>
            <UserHeader user={user}></UserHeader>
            {/* <UserPost likes={2002} replies={403} postImg="/post1.png" postTitle="Lets talk about stuff"></UserPost>
            <UserPost likes={21} replies={2} postImg="/post2.png" postTitle="Lets talk about stuff"></UserPost>
            <UserPost likes={232} replies={22} postImg="/post3.png" postTitle="Lets talk about stuff"></UserPost>
            <UserPost likes={1} replies={3} postTitle="This is first post and without image"></UserPost> */}
            {console.log(allPostAtomValue)}
            {loadingPost && (
                <Box mt={4} bg={"gray.dark"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Spinner width={39} height={39}></Spinner>
                </Box>
            )}

            {allPostAtomValue.length === 0 ? (
                <Text textAlign={"center"} mt={5} color={"gray.light"} opacity={0.5}>
                    This yapper has no yapping. <br /> This dude/duddie/attackhelicopter needs to yap something
                </Text>
            ) : (
                allPostAtomValue.map((post, index) => {
                    return <Post key={`${index}${post._id}`} post={post}></Post>;
                })
            )}
        </div>
    );
};

export default UserPage;
