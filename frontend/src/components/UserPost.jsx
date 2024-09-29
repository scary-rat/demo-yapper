import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import Actions from "./Actions";
import { useState } from "react";

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
// halile check greko xa postImg && ImageBox
// yesko matlab postImg true xa vani matra Image display gara, false xa vani nagara

// ani hamile tyo sab props bata ako data lie pani use greko xa

// Note: hamile direct Acctions vitra pani liked state define garna skthiyem but tyo liked xa ni nai tesko anusar hamile
// yo user post vanni parent component ma changes greko xa tesaile hamile actions vitra greko vye parent lie liked ki unliked
// state xa vnera vanna sakidaina kita dherai garo hunxa, so hamile yo state parent vitra define greko
// so hamile yo pani dhyan rakhnu parxa ki parent component ma state define garni ki chaild ma garni

const UserPost = ({ postImg, postTitle, likes, replies }) => {
    const [liked, setLiked] = useState(false);
    return (
        <Link to={"/markzuckerberg/post/1"}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar size="md" name="Mark Zuckerberg" src="/zuck-avatar.png" />
                    <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                        <Avatar
                            size="xs"
                            name="John doe"
                            src="https://bit.ly/dan-abramov"
                            position={"absolute"}
                            top={"0px"}
                            left="15px"
                            padding={"2px"}
                        />
                        <Avatar
                            size="xs"
                            name="John doe"
                            src="https://bit.ly/sage-adebayo"
                            position={"absolute"}
                            bottom={"0px"}
                            right="-5px"
                            padding={"2px"}
                        />
                        <Avatar
                            size="xs"
                            name="John doe"
                            src="https://bit.ly/prosper-baba"
                            position={"absolute"}
                            bottom={"0px"}
                            left="4px"
                            padding={"2px"}
                        />
                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text fontSize={"sm"} fontWeight={"bold"}>
                                markzuckerberg
                            </Text>
                            <Image src="/verified.png" w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={"center"}>
                            <Text fontStyle={"sm"} color={"gray.light"}>
                                1d
                            </Text>
                            <BsThreeDots />
                        </Flex>
                    </Flex>

                    <Text fontSize={"sm"}>{postTitle}</Text>
                    {postImg && (
                        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                            <Image src={postImg} w={"full"} />
                        </Box>
                    )}

                    <Flex gap={3} my={1}>
                        <Actions liked={liked} setLiked={setLiked} />
                    </Flex>

                    <Flex gap={2} alignItems={"center"}>
                        <Text color={"gray.light"} fontSize="sm">
                            {replies} replies
                        </Text>
                        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                        <Text color={"gray.light"} fontSize="sm">
                            {likes} likes
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    );
};

export default UserPost;
