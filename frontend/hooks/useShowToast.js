import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

// aba yesma chai hami yeuta custom hook banako
// custom hook vneko chai euta function ho, jasko name chai hami use bata start garxam
// ani main kura chai custom hook le euta already defined hook use garxa inside a function ani tyo function lie return garxam

// useShowToast vanni chai euta hook ho jun vitra showToast vanni function xa ani yo useShowToast le chai showToast inner function lie return garxa
// so aba hamile const inner_function = useShowToast garxa hami sanga showToast (title, description, status) vanni function inner_function vanni varaibale ma auxa
// ani aba hami inner_function("test", "this is test", "success") use garna sakxam

const useShowToast = () => {
    const toast = useToast();

    // use call back le chai function le cache garxa re
    // jaba euta function component ma use vko hunxa ani tyo component rerender vyo vani yo function pani feri create hunxa re
    // so use call back use grera hami yo function lie save garna sakxam
    // so aba component rerender vye  pani yo function chai recreate hunnxa already data memory ma save hunxa
    // unless yo callback ko dependency change vyo vani
    // toast ko value change vyo vani balla yo function memory ma pani change hunxa

    const showToast = useCallback((title, description, status) => {
        toast({
            title: title,
            description: description,
            status: status,
            isClosable: true,
            duration: 3000,
        });
    }, [toast])
    return showToast;
};

export default useShowToast;
