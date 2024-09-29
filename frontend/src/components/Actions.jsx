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
    Box,
    Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../../hooks/useShowToast";
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import allPostAtom from "../atoms/allPostAtom";
// yo actions vanni chai hamile xuttai component banako xa
// yesma basic defigning reko xa ani tara hamile esma prevent default greko xa
// UserPost component fully link ho ani yo component pani tyo link vitra xa
// hamile yo actions ma click garda pani page redirect hunxa, tesailie prevent garna e.preventDefault() greko
// natra like unlike, comment hunna, button press garda like comment ko satta tyo post page ko route ma janxa
// tesaile e.preventDefault() greko

// yesma hamile basic designing greko xa ani 4 svg use greko xa

// like ko lagi chai ahile halie props get greko xa action component call garda pass greko props haru
// props ma hamile liked state ra teslie set garni function matra pass greko xa
// ani to like press garda liked true vye red color greko xa natra transparent color greko xa
// like ma click garda function pass greko xa junle like lie true ki false ma toggle garxa, i.e true vye false ani false vye true garxa

// hamile pahila likes ko lagi like ra setlike props ma get greko thiyem, tyo ta frontend ma show garauna matra thiyo
// backend ma vko post lie lieked unliked garni process ali different hunxa
// hami props ma post lie get garxam, ani like garda current logged in user ko id tyo like array ma halxam
// tara already liked thiyo ani button press greko xa vani tyo logged in user ko id tyo like array bata nikalxam

// ani yehi actions vitra hami liked ra replies ko count pani show garxam
// ani handkle like ra unlike pani banam xam which will send request backend ma to like ki ta unlike
// frontend ma pani tesko simulation tehi handleLike function mai garxam

// aba hami post lie props ma ta leko xam tara yo post chai hamilie euta state ma pani save grera rakhnu parxa
// kina vani hami simulate grera post ma current user ko id add vko simulation pani grera frontend ma like vko dekhanu parxa
// ani like count pani badaunu parxa, tesaile hami post like props ma linxam but tesko name post rakhera
// ani tyo post lie store garna euta post state just yo actions component ko lagi banau xam

// ani aba post ko reply / comments ko lagi pani request e batai pathauni
// k garni vaney commpent ko icon ma press garda modal open garni ani tyo modal ma input field hunxa
// ani yeuta add comment vanni button pani hunxa ani tyo button ma reply add grera click garda chai post request janxa

const Actions = ({ post }) => {
    const user = useRecoilValue(userAtom);

    // like state define grera, first check grerko ki likes array ma alredy current user logeed in xa ki nai teskai hisab le like set greko xa
    const [liked, setLiked] = useState(post.likes.includes(user?._id));

    // hamile props ma leko post ko data lie euta state ma store grera rakhni
    // ani simulation ko lagi yehi state wala post ma data push ra pop garni

    // yo yesto xuttai state banayera garda pani ali ali ta hunxa but this is very bad practice re taw kin na vaney hamile
    // yo component ma banako state lie change garda yo component matra refresh hudo rahixa hai
    // tara hamilie ta yo actions jun ma hamile use gareko xa tyo compoent pani refresh garnu xa
    // natra hamile reply chai yesbata haleko xa tara tyo replies ta show yesko parant component ma greko xa
    // reply add vye paxi pani tyo parent component ta refresh hudaina kina vani hamile tyo component lie refresh grekai xaina
    // aba hami k garna sakxam vani {post, setPost} yesma setPost chai parent bata auxa ani added post lie bus set garxa
    // yo chai just for parent ko refresh ko lagi greko
    // yo yo good practice haina
    // kina ki hamilie globally yesto chiyeko xa ani hamile post ko lagi global state banko xa so tyo global mai changes garni ho
    // kina ki hamilie just 1 post ko jugard garni haina we will have to take care of all the post ani set garda pani
    // all post hunu parxa with changes to the changed post only

    // yesko satta hami k garni vaney ni hami main jun post state xa tesailie change garni
    // telie map grera yo current post in that global post vetauni, ani tesma yo wala post replace gardini, like replay greko xa vani
    // tyo main global ma search garni ki kun post ma reply greko xa
    // ani tyo post vetayera tesma yo post le reply array ma yo reply haldini

    // similary with like pani garni

    // aba hamile global all post ko euta post props ma leko xam so teslie set garna pani recoil ko set use garnu parxa
    // ani yesari set garnu parxa ki all post except modified post + modified post save garnu parxa
    // so pahila current modified post lie fileter grera nikalnu parxa old global state bata
    // ani yo new modified value halnu parxa tes ma

    const [allPostAtomValue, setAllPostAtomValue] = useRecoilState(allPostAtom);

    useEffect(() => {
        if (allPostAtomValue.length < 1) {
            setAllPostAtomValue([post]);
        }
    });

    // aba comment post vairako request gko xa vani tyo check garna ko lagi euta state banauni
    // like loader ko lagi ani button lie disable garna ko lagi so multiple reqest patahuna na pani unless first is completed
    const [isPosting, setIsPosting] = useState(false);

    // yo chai liking gri rako request gai rako bela feri arko request na jaos vnera optimization ko lagi banako
    const [isLiking, setIsLiking] = useState(false);

    // yo chai hamro custom toast ko lagi ho
    const customToast = useShowToast();

    // ani aba yo chai hami reply greko input lie state sanga bind garna banako state ra tyo reply lie handle garni onchange function
    const [commentText, setCommentText] = useState("");

    const handleCommentTextChange = (event) => {
        const inputText = event.target.value;
        setCommentText(() => inputText);
    };

    // modal ko lagi code
    // yo chai chakra ui le provide greko hook to control modal opening ra closing
    const { isOpen, onOpen, onClose } = useDisclosure();

    // aba yo chai handle comment vanni function banauni jun le chai post method fetch garxa to post the comment
    // ani post ma comment grepaxi hami tyo jun post ma comment garem ni
    // tyo comment lie tyo comment greko post ma pani halnu parxa inside global post state
    // a post ma comment garim vani hamile a post ko replies array ma yo new comment lie pani halnu parxa

    const handleAddComment = async () => {
        try {
            if (isPosting) {
                return;
            }
            setIsPosting(true);
            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/posts/reply/${post._id}`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ text: commentText }),
            });
            const data = await res.json();
            if (data.error) {
                customToast("Error", data.error, "error");
                return;
            }

            // hamile post request pathayem hai aba
            // tespaxi tyo successful vye pani aba hamile tyo global post state ma yo new comment lie halnu parxa
            // tyo halni logic chai :
            // euta new array banauni map use grera, map ko condiction esto rakni ki sab global post object haru hunxa yo array ma
            // but jun post object ma hamile comment greko ni tesko satta hami new post object retrun garni
            // tyo new post object kasto hunxa vani ni { ...atomPost, replies: [data.reply, ...atomPost.replies]} meaning same to same old post object
            // but just tyo old post object ko replies ma euta new replies array hunxa
            // tyo new replies array chai kasto hunxa vaney [data.reply, ...atomPost.replies] meaning new server bata response ma ako reply + sab old replies

            // yo garna ko lagi chai :-
            // tyo global post ma jati pani post xa tesbata hamilie yo current post, jun ma hamile comment greko tyo find garni ani find grepxi
            // tyo wala matra post object modify garni with server bata ako reply
            // hamile server bata response ma euta reply vanni matra object pani pathako xam
            // tesko lagi hami map use garxam ani map vitra atomPost ko id ra current post ko id xa vaney, euta new object store garni

            const newPostArray = allPostAtomValue.map((atomPost) => {
                if (atomPost._id === post._id) {
                    return { ...atomPost, replies: [data.reply, ...atomPost.replies] };
                }
                return atomPost;
            });

            console.log(newPostArray);

            // ani tyo new jun post array banako thiyem hamile teslie global state ma save gardini
            // likes ko lagi pani hamile yestai greko thiyo

            setAllPostAtomValue((prev) => newPostArray);

            setCommentText(() => "");
            onClose();
            customToast("Success", data.message, "success");
        } catch (error) {
            customToast("Error", error.message, "error");
        } finally {
            setIsPosting(false);
        }
    };

    const handleLikeAndUnlike = async () => {
        try {
            // user logged in xaina vni k return garni tyo ta backend ma banakai xa
            // tra hami tyo frontend ma ni handle greko ramro kina ki
            // use logged in na vye backend ma request kina send garnu tyo ta waste of resource hunxa
            // tesaile frontend mai hami handle garxam user logged in navaye unautorised please login vnera toast dini ani funtion bata return garni

            // tara koi koi wanna be hacker haru ni hunxan, k k grera frontend ko data change grera request send garxan, tesko lagi backend ma pani
            // user logged in navaye middleware le reuest lie stop grera unauthorised vanni message fini banau ni

            if (!user) {
                customToast("Error", "You are not logged in. Please login to like or unlike posts.", "error");
                return;
            }

            // manxe haru chor hunxan so tini haru dyam dyam like press greko grekai ni garna sakxan so server ma request gko gai hunxa sakxa without first request being fullfiled
            // so tyo prevent garna ko lagi hami optiimixation pani garni

            // if post request gai rako xa ani without completion vko bela ma feri click garyo vani yo handle like Unlike function bara direct return gardini
            setIsLiking(true);
            if (isLiking) {
                return;
            }

            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/posts/like/${post._id}`, {
                method: "post",
                headers: {
                    "Content-Type": "json/application",
                },
                credentials: "include",
            });
            const data = await res.json();

            if (data.error) {
                customToast("Error", data.error, "error");
                return;
            }

            // aba like ki ta unlike successfully vye pani hami currently logged in user ko id like post ko likes array vitra halxam ki ta nikalxam

            // currently unlike greko vye hami tyo currently logged in user ko id lie tyo post object ko likes array vitra bata filter grera nikalxam
            // hamile follow ma chai etikai jun vye ni last ko element pop grera nikaleko thiyo for simulation
            // but tyo chai correct method haina, teti khera follow vanni euta matra button thiyo tyo component ma so tyo work garyo
            // yo action render vko component ma tannai post haru xan ani tannai like button xa, so randomly pop garda ta
            // arkai tala wala post ko like delete garna sakxam ni ta so hami proper method use grera frontend ma pani
            // currently logged in user kai id push garni when he likes ki ta remove garni when he unlikes

            // so unlike garda chai hamile post object ko likes array bata esko id filter grera nikalni
            // filter chai hami array ma matra use garna sakxam, yo javascript ko euta array method ho
            // filter le k garxa vani j hamile return ma condition deko xa ni tyo element bayek aru sab element ko new array dinxa
            // so hami tyo likes array bata user lie nikalera newLikedArray banau ni ani teslie post ma haldini
            if (liked) {
                const newLikedArray = post.likes.filter((element) => {
                    return element !== user?._id;
                });

                // post ma halna chai hamile tyo full post object lie set post ma return garni
                // tara teyo likes array ko chai value hami newLikedArray return garni using spread operator
                // spread operator ma chai ...prev vneko pahila ko same to same
                // , likes: newLikedArray vneko chai tara likes key ma yo new data halera
                const newPostArray = allPostAtomValue.map((atomPost) => {
                    // search garni ki atom post ra current post same xa ki nai
                    // same xa vaney tyo element ko object ko likes ma new liked array halera return garni
                    if (atomPost._id === post._id) {
                        // atomPost.likes = newLikedArray; garna mildaina re kinaki
                        // In JavaScript, objects and arrays are reference types. When you use map on an array,
                        // it returns a new array, but the objects inside it still hold references to the original objects.
                        // ani recoil state managemt library ho yeko jun object xa ni tyo normal object haina re
                        // so we cannot modify recoil ko object ko value haru by doing atomPost.likes = newLikedArray;
                        // hamile new array ta banayem map use grera tara object inside haruko chai old reference nai xa re
                        // so yesari modify garna mildaina, instead hamile object pani new banayera teslie modify garnu parxa re
                        // so spread operator use garni {...atomPost, likes: newLikedArray}
                        // new object kasto hunxa vaney {...atomPost} meaning same as atomPost tara likes: newLikedArray
                        // but tesko kun likes key xa tesko new value chai newLikedArray hunxa

                        // atomPost.likes = newLikedArray;
                        return { ...atomPost, likes: newLikedArray };
                    }
                    return atomPost;
                });

                setAllPostAtomValue(() => newPostArray);
            } else {
                // aba user le like gardai xa vani hami k garni vney ni hami tyo likes array ma pahila current klogged in user lie halni
                // tyo halna chai hami euta newLikedArray banau ni ani tesma current logged in user ko id spread opereator use grera tyo array ma halni
                // ani tespani set post ma teslie pass gardini
                const newLikedArray = [...post.likes, user._id];
                const newPostArray = allPostAtomValue.map((atomPost) => {
                    if (atomPost._id === post._id) {
                        return { ...atomPost, likes: newLikedArray };
                    }
                    return atomPost;
                });

                setAllPostAtomValue(() => newPostArray);
            }

            // ani successfully liked ki ta unlike vye paxi hami pahila liked true vye ahile false gardini ani pahila false vye ahile true gardini
            setLiked(!liked);
            // customToast("Success", data.message, "success");
        } catch (error) {
            customToast("Error", error.message, "error");
        } finally {
            setIsLiking(false);
        }
    };

    console.log(post.likes.length);
    return (
        <Flex flexDirection="column">
            <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
                <svg
                    aria-label="Like"
                    color={liked ? "rgb(237, 73, 86)" : ""}
                    fill={liked ? "rgb(237, 73, 86)" : "transparent"}
                    height="19"
                    role="img"
                    cursor={"pointer"}
                    viewBox="0 0 24 22"
                    width="20"
                    onClick={handleLikeAndUnlike}
                >
                    <title>Like</title>
                    <path
                        d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
                        stroke="currentColor"
                        strokeWidth="2"
                    ></path>
                </svg>

                <svg
                    aria-label="Comment"
                    color=""
                    fill=""
                    height="20"
                    role="img"
                    viewBox="0 0 24 24"
                    width="20"
                    cursor={"pointer"}
                    onClick={onOpen}
                >
                    <title>Comment</title>
                    <path
                        d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                        fill="none"
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeWidth="2"
                    ></path>
                </svg>

                {/* yo duita chai diferent compnent jun chai yehi page ma create greko xa for readability */}
                {/* more detail ko lagi scroll down and read */}
                <RepostComponent></RepostComponent>
                <ShareComponent></ShareComponent>
            </Flex>
            <Flex gap={2} alignItems={"center"}>
                <Text color={"gray.light"} fontSize="sm">
                    {post.likes.length} likes
                </Text>

                <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                <Text color={"gray.light"} fontSize="sm">
                    {post.replies.length} replies
                </Text>
            </Flex>
            <Modal
                closeOnOverlayClick={false}
                isOpen={isOpen}
                onClose={() => {
                    setCommentText("");
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
                            <Textarea
                                placeholder="Your commnet to the yapp goes here..."
                                onChange={handleCommentTextChange}
                                value={commentText}
                            ></Textarea>
                            <Text fontSize="xs" fontWeight="bold" textAlign="right" color={"gray.light"} m={"1"}>
                                500
                            </Text>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleAddComment} isLoading={isPosting}>
                            Comment
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

export default Actions;

// aba hami yeta main page ko nam j xa tyo component i.e main component k in this case Action component
// yemaline of code dherai vyo ani aba button haru ani k k jun chai can be grouped ani used as a component xa vani
// tyo hami yehi file ma tala component banauna sakxam
// repost svg component
const RepostComponent = () => {
    return (
        <svg aria-label="Repost" color="currentColor" fill="currentColor" height="20" role="img" viewBox="0 0 24 24" width="20">
            <title>Repost</title>
            <path
                fill=""
                d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"
            ></path>
        </svg>
    );
};

// share svg component
const ShareComponent = () => {
    return (
        <svg aria-label="Share" color="" fill="rgb(243, 245, 247)" height="20" role="img" viewBox="0 0 24 24" width="20">
            <title>Share</title>
            <line
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="22"
                x2="9.218"
                y1="3"
                y2="10.083"
            ></line>
            <polygon
                fill="none"
                points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
            ></polygon>
        </svg>
    );
};
