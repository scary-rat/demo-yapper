import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { useSetRecoilState } from "recoil";
import { authScreenAtom } from "../atoms/authAtom";
import userAtom from "../atoms/userAtom";
import useShowToast from "../../hooks/useShowToast";

// yo ra login card chai chakra ui ko leko ho component copy grera
// yesma euta tyo useColorModeValue vanni jun xa ni
// this is a hook used to set the color according to the system theme mode re
// useColorModeValue("light_mode_ko_color_for_this_element", "dark_mode_ko_color_for_this_element")

// aba signup garna ko lagi hami fetch bata post request garxam hai

// ani databse bata cookies create hunxa ani save pani hunxa ani response ma user ko name id email auxa

// hami aba tyo asko user ko data lie local storage ma save garni ani tesko lagi euta userAtom pani banau ni i.e global userState

// yo kina greko vaney ni, hamile login kita sign up grepaxi aba hamilie login page ma gyo vaney home page ma redirect garnu xa

// tesaile yesto garyo vaney hamilie frontend ma pani tha hunxa ki user logged in xa

// cookies lie hamile http only greko xa so javascript le tyo read garna sakdaina tesaile hamile local storage ma pani save greko ho

// aba jaba logout button press garxam ni, tesle k garxa vaney logout rout ma request pathauxa, tesle cookies ta clear hunxa ani
// plus hami user vanni kun global state bana ko thiyo ni teslie pani null garxam ani jun local storage ma save greko xa ni teslie pani delete garxam

// tara ava user le direct cookie editor le cookies delete garyo vani k garni ? tesko lagi paxi ma work garxa
// logic k socheko xa vaney unauthorised vanni pani euta atom banauxu ani jaba k request pani janxa ni backend ma teti khera unauthorised vnera
// response ayo vaney hami user global state lie null garni ani plus tyo local storage ma save vko lie pani delete garni

// tyo user global state ko default value chai tyo local storage batai auxa

// (more detailed explanation chai userAtom.js ma xa)

const SignupCard = () => {
    const [showPassword, setShowPassword] = useState(false);
    const setAuthScreenAtomValue = useSetRecoilState(authScreenAtom);
    const setUserAtomValue = useSetRecoilState(userAtom);
    const [loading, setLoading] = useState(false);
    const [signUpData, setSignUpData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });

    const customToast = useShowToast();

    const handleSignUp = async () => {
        if (loading) {
            return;
        }
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/users/signup`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },

                // imp : stringify garna important xa kina ki yo data object ko rup ma janxa, ani error auxa stringify grena vaney

                // yo credentials vneko chai cookies ko access dine ki nai vneko, eslie include grena vaney browser ma cookies save hunnxa
                // ani logout garda pani include garnu parxa natra cookies delete hunnxa
                credentials: "include",
                body: JSON.stringify(signUpData),
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

            // ani signup successful vyo vaney chai jun data response ma ako xa ni teslie global user atom / state ma save greko
            // ani teslie aba stringfy grera local storage ma pani greko,
            // imp : stringify garnu parxa natra yo save hudaina because yo object ho

            localStorage.setItem("user-threads", JSON.stringify(data));
            setUserAtomValue(data);

            // main error yesmai ako thiyo malie kinaki yesma error.message vneko string hunu parxa
            // mahile first ma customToast("Error", error, "error"); error matra pass greko jun euta object ho tesaile error ako
        } catch (error) {
            customToast("Error", error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex align={"center"} justify={"center"}>
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"} textAlign={"center"}>
                        Sign up
                    </Heading>
                </Stack>
                <Box rounded={"lg"} bg={useColorModeValue("white", "gray.dark")} boxShadow={"lg"} p={8}>
                    <Stack spacing={4}>
                        <HStack>
                            <Box>
                                <FormControl isRequired>
                                    <FormLabel>Full Name</FormLabel>
                                    <Input
                                        type="text"
                                        value={signUpData.name}
                                        onChange={(e) =>
                                            setSignUpData((prev) => {
                                                return {
                                                    ...prev,
                                                    name: e.target.value,
                                                };
                                            })
                                        }
                                    />
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl isRequired>
                                    <FormLabel>Username</FormLabel>
                                    <Input
                                        type="text"
                                        value={signUpData.username}
                                        onChange={(e) =>
                                            setSignUpData((prev) => {
                                                return {
                                                    ...prev,
                                                    username: e.target.value,
                                                };
                                            })
                                        }
                                    />
                                </FormControl>
                            </Box>
                        </HStack>
                        <FormControl isRequired>
                            <FormLabel>Email address</FormLabel>
                            <Input
                                type="email"
                                value={signUpData.email}
                                onChange={(e) =>
                                    setSignUpData((prev) => {
                                        return {
                                            ...prev,
                                            email: e.target.value,
                                        };
                                    })
                                }
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={signUpData.password}
                                    onChange={(e) =>
                                        setSignUpData((prev) => {
                                            return {
                                                ...prev,
                                                password: e.target.value,
                                            };
                                        })
                                    }
                                />
                                <InputRightElement h={"full"}>
                                    <Button variant={"ghost"} onClick={() => setShowPassword((showPassword) => !showPassword)}>
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={10} pt={2}>
                            <Button
                                loadingText="Signing Up..."
                                size="lg"
                                bg={useColorModeValue("gray.600", "gray.700")}
                                color={"white"}
                                _hover={{
                                    bg: useColorModeValue("gray.700", "gray.800"),
                                }}
                                onClick={handleSignUp}
                                isLoading={loading}
                            >
                                Sign up
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={"center"}>
                                Already a user?{" "}
                                <Link
                                    color={"blue.400"}
                                    onClick={() => {
                                        setAuthScreenAtomValue("login");
                                    }}
                                >
                                    Login
                                </Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
};

export default SignupCard;
