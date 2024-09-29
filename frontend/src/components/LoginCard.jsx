import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import React from "react";
import { authScreenAtom } from "../atoms/authAtom";
import { useSetRecoilState } from "recoil";
import useShowToast from "../../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

// same as signup ko tesmai padha sab

const LoginCard = () => {
    const [showPassword, setShowPassword] = useState(false);
    const setAuthScreenAtomValue = useSetRecoilState(authScreenAtom);
    const setUserAtomValue = useSetRecoilState(userAtom);
    const [loading, setLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });

    const customToast = useShowToast();
    const handleLogin = async () => {
        if (loading) {
            return;
        }
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/users/login`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(loginData),
            });

            const data = await res.json();

            console.log(data);

            if (data.error) {
                customToast("Error", data.error, "error");
                return;
            }
            if (data.message) {
                customToast("Success", data.message, "success");
            }

            localStorage.setItem("user-threads", JSON.stringify(data));
            setUserAtomValue(data);
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
                        Log In
                    </Heading>
                </Stack>
                <Box
                    rounded={"lg"}
                    bg={useColorModeValue("white", "gray.dark")}
                    boxShadow={"lg"}
                    p={8}
                    w={{
                        base: "full",
                        sm: "464px",
                    }}
                >
                    <Stack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Email or Username</FormLabel>
                            <Input
                                type="text"
                                value={loginData.username}
                                onChange={(e) =>
                                    setLoginData((prev) => {
                                        return { ...prev, username: e.target.value };
                                    })
                                }
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={loginData.password}
                                    onChange={(e) =>
                                        setLoginData((prev) => {
                                            return { ...prev, password: e.target.value };
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
                                size="lg"
                                bg={useColorModeValue("gray.600", "gray.700")}
                                color={"white"}
                                _hover={{
                                    bg: useColorModeValue("gray.700", "gray.800"),
                                }}
                                onClick={handleLogin}
                                isLoading={loading}
                                loadingText="Logging in..."
                            >
                                Log In
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={"center"}>
                                Dont have an account? Create One{" "}
                                <Link color={"blue.400"} onClick={() => setAuthScreenAtomValue("signup")}>
                                    Sign up
                                </Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
};

export default LoginCard;
