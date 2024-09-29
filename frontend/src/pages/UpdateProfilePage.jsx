import { Button, Flex, FormControl, FormLabel, Heading, Input, Stack, useColorModeValue, Avatar, Center } from "@chakra-ui/react";

import React, { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import usePreviewImage from "../../hooks/usePreviewImage";
import useShowToast from "../../hooks/useShowToast";

// yesma hamile firest ma k greko vaney ni, hamile logged in user ko details leko userAtom bat
// user atom ma hamile login / signup vako bela server le j user ko data response ma pathako thiyo ni tyo save grera rakheko xa
// ani tyo aba hamile user details ma haleko ani tyo inputs ko value auto fill greko

// aba yesma chai hami choose greko file lie preview garauna ko lagi euta hook banau ni
// tyo jun profile image jasto box xa ni round, tesma file choose gare paxi preview garauna yo hook banako
// hamile usePreviewImage vanni euta hook banako xa,
// yo hook le k garxa vaney ni hamile upload greko image lie base 64 string ma convert garxa ani euta state ma save garxa

// ani tyo convert garni function ra base 64 string save vko state lie return garxa

// const { imageUrl, handleImageChange } = usePreviewImage();

// imageUrl chai state ho jun ma hamro upload greko image as a string save vko xa
// ani handleImageChange vanni chai image lie base 64 ma convert garni euta function ho, yo function le image lie convert garxa
// ani setImageUrl use grera imageUrl ko value set pani garxa

const UpdateProfilePage = () => {
    const [userAtomValue, setUserAtomValue] = useRecoilState(userAtom);

    const [updating, setUpdating] = useState(false);

    const navigate = useNavigate();

    const [userDetails, setUserDeatails] = useState({
        name: userAtomValue.name,
        username: userAtomValue.username,
        email: userAtomValue.email,
        bio: userAtomValue.bio,
        password: "",
    });

    const selectFileRef = useRef(null);

    const { imageUrl, handleImageChange } = usePreviewImage();

    const customToast = useShowToast();

    const handleProfileUpdate = async (event) => {
        event.preventDefault();

        if (updating) {
            return;
        }

        try {
            setUpdating(true);
            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/users/update/${userAtomValue._id}`, {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                // aba hamro userDetails ma profile pic hamile haleko xaina so profilePic xuttai body ma pass garnu parxa
                body: JSON.stringify({ ...userDetails, profilePic: imageUrl }),
            });

            const data = await res.json();
            if (data.error) {
                customToast("Error", data.error, "error");
                return;
            }

            if (data.message) {
                customToast("Success", data.message, "success");
            }

            // yesma malie error ako dherai
            // mahile chai yo jun userle fill greko data thiyo ni tyo save garna khojeko setUserAtom ma
            // but hamilie chai server le j response deko xa ni tyo set garni
            // yo update grepaxi pani server le hamilie user ko updated details ko response dinxa
            // ani tyo response chai save garni
            // natra ta k vayo vaney ni local storage ma chai tyo image ko jun 64 base string save vyo
            // tara mahile tyo pani work huni banaye ani tyo method pani tala xa

            setUserAtomValue(data);
            localStorage.setItem("user-threads", JSON.stringify(data));
            // submit vye paxi redirect pani garni to the logged in user ko profile page i.e upaded username ma navigate garnu paryo jun chai response ma auxa
            // as data.username
            navigate(`/${data.username}`);

            // kita yo arko method server baa without response wala

            // user le fill in greko data bata

            // setUserAtomValue((prev) => {
            //     const newUserDetails = {
            //         ...prev,
            //         ...userDetails,
            //         message: "profile updated",
            //         profilePic: imageUrl || userAtomValue.profilePic,
            //     };
            //     localStorage.setItem("user-threads", JSON.stringify(newUserDetails));
            //     return newUserDetails;
            // });
        } catch (error) {
            customToast("Error", error.message, "error");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <form onSubmit={handleProfileUpdate}>
            <Flex align={"center"} justify={"center"} my={5}>
                <Stack
                    spacing={4}
                    w={"full"}
                    maxW={"md"}
                    bg={useColorModeValue("white", "gray.dark")}
                    rounded={"xl"}
                    boxShadow={"lg"}
                    p={6}
                >
                    <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
                        Edit Your Profile
                    </Heading>
                    <FormControl>
                        <Stack direction={["column", "row"]} spacing={6}>
                            <Center>
                                <Avatar size="xl" src={imageUrl || userAtomValue.profilePic}></Avatar>
                            </Center>
                            <Center w="full">
                                <Button w="full" onClick={(e) => selectFileRef.current.click()}>
                                    Change Avatar
                                </Button>
                                <Input
                                    ref={selectFileRef}
                                    type="file"
                                    placeholder="Choose File"
                                    accept="image/*"
                                    hidden
                                    onChange={(event) => handleImageChange(event)}
                                ></Input>
                            </Center>
                        </Stack>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                            placeholder="Johnhoe Pandey"
                            _placeholder={{ color: "gray.500" }}
                            type="text"
                            value={userDetails.name}
                            onChange={(e) =>
                                setUserDeatails((prev) => {
                                    return {
                                        ...prev,
                                        name: e.target.value,
                                    };
                                })
                            }
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>User name</FormLabel>
                        <Input
                            placeholder="johnhoe"
                            _placeholder={{ color: "gray.500" }}
                            type="text"
                            value={userDetails.username}
                            onChange={(e) =>
                                setUserDeatails((prev) => {
                                    return {
                                        ...prev,
                                        username: e.target.value,
                                    };
                                })
                            }
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Email address</FormLabel>
                        <Input
                            placeholder="johnhoe@gmail.com"
                            _placeholder={{ color: "gray.500" }}
                            type="email"
                            value={userDetails.email}
                            onChange={(e) =>
                                setUserDeatails((prev) => {
                                    return {
                                        ...prev,
                                        email: e.target.value,
                                    };
                                })
                            }
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Bio</FormLabel>
                        <Input
                            placeholder="Your Bio"
                            _placeholder={{ color: "gray.500" }}
                            type="text"
                            value={userDetails.bio}
                            onChange={(e) =>
                                setUserDeatails((prev) => {
                                    return {
                                        ...prev,
                                        bio: e.target.value,
                                    };
                                })
                            }
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Password</FormLabel>
                        <Input
                            placeholder="Password"
                            _placeholder={{ color: "gray.500" }}
                            type="password"
                            value={userDetails.password}
                            onChange={(e) =>
                                setUserDeatails((prev) => {
                                    return {
                                        ...prev,
                                        password: e.target.value,
                                    };
                                })
                            }
                        />
                    </FormControl>
                    <Stack spacing={6} direction={["column", "row"]}>
                        <Button
                            onClick={() => navigate(`/${userAtomValue.username}`)}
                            bg={"red.400"}
                            color={"white"}
                            w="full"
                            _hover={{
                                bg: "red.500",
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            bg={"blue.400"}
                            color={"white"}
                            w="full"
                            _hover={{
                                bg: "blue.500",
                            }}
                            type="submit"
                            isLoading={updating}
                        >
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </form>
    );
};

export default UpdateProfilePage;
