import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    useColorModeValue,
    FormControl,
    Textarea,
    Text,
    Input,
    Flex,
    Image,
    CloseButton,
    Img,
    Box,
    Spinner,
} from "@chakra-ui/react";

import React, { useRef, useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImage from "../../hooks/usePreviewImage";
import useShowToast from "../../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import allPostAtom from "../atoms/allPostAtom";
import { useLocation } from "react-router-dom";

// aba hami yi component ma chai create post garni
// esma chai euta modal hunxa ani yo modal ma chai text area ra image uplaod garni mailxa ani tyo post garni

// yo chau MAX_CHAR vanni variable banako kinaki directly useState(500) lekhni bad practice ho re
const MAX_CHAR = 500;

const CreatePost = () => {
    // yo chai chakra ui le provide greko hook to control modal opening ra closing
    const { isOpen, onOpen, onClose } = useDisclosure();

    // aba hami tyo character kati lekhna milni tyo limit set greko xa ni so aba user lie dekhanu ni pani ki kati charater lekhna milxa ajai
    // so tesko lagi state banayera rakheko, jati new letter type garxa teti yo remaining letters ko value kam hudai janxa
    const [remainingLetters, setRemainingLetters] = useState(MAX_CHAR);

    // aba hamile jun image ko url har time change hunda tyo show garna ko lagi eura usePreviewImage hook banako thiyo ni
    // tyo use greko kina ki hamilie user le jun image upload greko xa tyo pani show garaunu xa as he uploads
    const { handleImageChange, imageUrl, setImageUrl } = usePreviewImage("");

    // aba yo chai posting xa ki nai vnera button ma loading spinner dekhauna ko lagi euta state
    const [posting, setPosting] = useState(false);

    // current logged in user vye matra hamile post haru garna milxa ani current logged in user ko aru pani k k data chiyeko hunxa for posting
    // so tyo user ko pani euta variable banayera rakheko
    const currentLoggedInUser = useRecoilValue(userAtom);

    // hamilie tyo file vani input hidden banau nu xa ani image ko icon ma click garda tyo file input trigger garnu xa
    // so tesaile tyo input type file ko reference store garna ko lagi euta referebce liyera rakheko
    const imageRef = useRef(null);

    // aba tyo text area ma k type greko for posting tesko lagi pani euta state liyera rakheko, yehi tyo text area ko value sanga pani bind garni
    const [postText, setPostText] = useState("");

    // hamile post add garni bitikai tyo pani ta dehinu paryo ni user ko profile ma tesko lagi pani hami global post state ma create garni
    // bitikai new created lie afno profile ko posts ma halxam

    const setAllPostAtomValue = useSetRecoilState(allPostAtom);

    // tara aba arka ko profile use le open gari rako xa ani taba post crete garera all post ma set garyo vani ta euta bug auxa
    // tyo k bug ho vaney ni, ma user a xu ani mahie b ko profile visit garey
    // ani b ko profile visit grerea mahile post create garey vani tyo ta b ko profile ma pani dekhido rahixa
    // kina ki hamile post state lie change garim, tyo post state ma b ko all post thiyo tesma hamile a ko post halidim
    // so tyo prevent garna ko lagi if user afno profile page ma xa vani matra post append garni natra vani append nagarni
    // tesko lagi hamilie url bata user ko username milxa, tyo check garni if logged in user ko username ra url ko usename same xa vani matra
    // post state ma tyo new post halni

    // hamile currentLoggedInUser ko value mathi currentLoggedInUser ma store grera rakheko xa

    const pathLocation = useLocation();
    const username = pathLocation.pathname.split("/")[1];

    // custom toast jun hamile hook banako thiyo to show toast
    const customToast = useShowToast();

    // aba yo chai tyo text area ma type garda onchange ma ca;; garni function
    // yo function le chai text area ko value ra state lie bind garxa
    // like text area ma j tpe gardai gyo tyo postText state ma save hudai janxa

    // aba tesma ajai arko kura pani check gari rako xam
    // tyo hamile set greko limit
    // every time hami khi new character text area ma lekhda yo function chalxa hai so hami check garni ki tyo textarea ma lekheko
    // string ko length max char jun hamile 500 set greko tyo vanda badi xa ki nai
    // aba tyo vanda badi vyo vani hami text lie slice garni ani 0,500 characters lie matra postText state ma set gardiney
    // ani tyo remaining letter like pani 0 ma set gardiney

    function handlePostTextChange(event) {
        const inputText = event.target.value;
        if (inputText.length > MAX_CHAR) {
            const restrictText = inputText.slice(0, MAX_CHAR);
            setPostText(() => {
                return restrictText;
            });
            setRemainingLetters(0);
        }
        // tara if input ma vko length chai less xa than max length then complete j j type greko xa tyo tyo state ma save gardai jani
        // ani jun remaining letters vanni state thiyo ni teslie pani max char - input length gardiney, like 500 - ahile jati ota character lekhiyo
        else {
            setPostText(() => {
                return inputText;
            });
            setRemainingLetters(() => MAX_CHAR - inputText.length);
        }
    }

    // aba posting ko lagi euta function banau ni
    // yesle chai post request garxa ani body ma { postedBy: currentLoggedInUser._id, text: postText, img: imageUrl } object as a request send garxa
    // NOTE: body ma stringy grera pathau nu parxa
    // ani respose successfully vyo vani chai post successful vnera auxa natra chai error auxa so tyo pani handle grekoxa
    // ani post vye paxi chai tyo postinput state lie empty greko ani imageUrl lie pani empty greko
    const handleCreatePost = async () => {
        // yo chai posting vairako xa ani user le aja pani post request vai rako bela click grerko grekai garna khojiyo vani
        // yo new jati pani function chaiyo ni while posting, tyo chai e bata retur gardine
        // (detail explanation in UserHeader.jsx page for follow functionality)
        if (posting) {
            return;
        }
        try {
            setPosting(true);
            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/posts/create`, {
                method: "post",
                headers: {
                    "Content-type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ postedBy: currentLoggedInUser._id, text: postText, img: imageUrl }),
            });

            const data = await res.json();

            if (data.error) {
                customToast("Error", data.error, "error");
                return;
            }

            setPostText(() => "");
            setImageUrl(() => "");

            // aba hamie post create gani successful vyo vani
            // tyo add greko post lie hamile global post state ma pani ta halnu parxa
            // but if user afno feed page ra afno profile page ma xa vani matre halni
            // so feed page bata post garda ra afno profile page bata post garda tyo user lie afno post faat se dekhi halxa

            // tesko lagi logic chai :
            // new array banayera tyo array set garni, tyo array chai kasto hunx vani [data, ...prev] meaning
            // server bata response ako data first ma halni ani aru sab pahila ko global post ko elements haru jasto ko testai halni
            onClose();
            if (username === currentLoggedInUser.username || pathLocation.pathname === "/") {
                setAllPostAtomValue((prev) => {
                    return [data, ...prev];
                });
            }
            customToast("Success", data.message, "success");
        } catch (error) {
            customToast("Error", error.message, "error");
        } finally {
            setPosting(false);
        }
    };

    // aba yo chai modal ra button ho chakra ui bata uthko
    // yesma hamile imageurl vye matra image dekhako xa natra vani image container lie render greko xain
    // ani hamile modal ko onClose ma onClose lie ta return grek xa, tara tyo return garni vanda agadi posttext ra imageUrl state lie empty greko xa
    // yo kina greko vaney, jaba modal ma image ra text type grera close garxam ni tyo data remove hunna, post button ma click garda yo data ti present hunxa
    // tara hamilie modal close vye paxi yo data pani delete hunu xa / reset hunu xa to empty
    // so tesaile hamile yesto greko

    if (posting) {
        return (
            <Box
                w={"100vw"}
                height={"100vh"}
                bg={"gray.dark"}
                pos={"fixed"}
                top={0}
                left={0}
                zIndex={"1111"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Spinner width={69} height={69}></Spinner>
            </Box>
        );
    }

    return (
        <>
            <Button position={"fixed"} bottom={10} right={10} onClick={onOpen}>
                + Post
            </Button>

            <Modal
                closeOnOverlayClick={false}
                isOpen={isOpen}
                onClose={() => {
                    setImageUrl("");
                    setPostText("");
                    return onClose();
                }}
                isCentered
            >
                <ModalOverlay />
                <ModalContent bg={useColorModeValue("gray.200", "gray.dark")}>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            {imageUrl && (
                                <Flex mb={5} w={"full"} position={"relative"}>
                                    <Image src={imageUrl}></Image>
                                    <CloseButton
                                        onClick={() => setImageUrl("")}
                                        position={"absolute"}
                                        right={2}
                                        top={2}
                                        bg={useColorModeValue("gray.light", "gray.dark")}
                                    ></CloseButton>
                                </Flex>
                            )}
                            <Textarea
                                placeholder="Your yapping goes here..."
                                onChange={handlePostTextChange}
                                value={postText}
                            ></Textarea>
                            <Text fontSize="xs" fontWeight="bold" textAlign="right" color={"gray.light"} m={"1"}>
                                {remainingLetters}/500
                            </Text>
                            <Input type="file" hidden ref={imageRef} onChange={handleImageChange} accept="image/*"></Input>
                            <Flex
                                alignItems={"center"}
                                gap={2}
                                onClick={() => imageRef.current.click()}
                                w={"fit-content"}
                                ml={"5px"}
                                cursor={"pointer"}
                            >
                                <BsFillImageFill size={16}></BsFillImageFill> <Text fontSize="xs">Add Image</Text>
                            </Flex>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleCreatePost} isLoading={posting}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreatePost;
