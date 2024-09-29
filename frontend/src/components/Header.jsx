import { Flex, Image, Link as ChakraLink, useColorMode, Text } from "@chakra-ui/react";
import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as ReactRouterLink } from "react-router-dom";
import { authScreenAtom } from "../atoms/authAtom";

const Header = () => {
    // use color mode chai chakra ui le provide greko euta hook ho, tes ma chai light ra dark color mode define hunxa
    // ani tyo hook vita tyo mode lie toggle garni eura function pani deko hunxa toggleColorMode
    // so hamile yo colormode bata ahile current mode light xa ki dark xa tha pauxam ani on click ma toggleColorMode like call grera
    // light xa vani dark garxam ani dark xa vani light garxam

    // aba user logged in xa vani chai hami yesma navigation ko lagi home page ra profile page pani dekhau ni
    // so tesko lagi hami global state ma save vko logged in user lie get garni
    const loggedInUser = useRecoilValue(userAtom);

    const setAuthScreenAtomValue = useSetRecoilState(authScreenAtom);

    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <Flex justifyContent={"space-between"} mt={6} mb={12}>
            {/* userlogged in vye home icon dekhauni natra skip garni */}
            {loggedInUser ? (
                <ChakraLink as={ReactRouterLink} to="/">
                    <AiFillHome size={24}></AiFillHome>
                </ChakraLink>
            ) : (
                <ChakraLink as={ReactRouterLink} to="/auth" onClick={() => setAuthScreenAtomValue("login")}>
                    <Text>Login</Text>
                </ChakraLink>
            )}
            <Image
                cursor={"pointer"}
                alt="logo"
                width={50}
                src={colorMode === "dark" ? "/logo-dark.png" : "/logo-light.png"}
                onClick={toggleColorMode}
            ></Image>

            {/* userlogged in vye proflie icon dekhauni natra skip garni */}
            {loggedInUser ? (
                <ChakraLink as={ReactRouterLink} to={`${loggedInUser.username}`}>
                    <RxAvatar size={24}></RxAvatar>
                </ChakraLink>
            ) : (
                <ChakraLink as={ReactRouterLink} to="/auth" onClick={() => setAuthScreenAtomValue("signup")}>
                    <Text>Sign Up</Text>
                </ChakraLink>
            )}
        </Flex>
    );
};

export default Header;
