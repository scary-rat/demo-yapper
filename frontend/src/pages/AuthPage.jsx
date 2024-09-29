import React from "react";
import SignupCard from "../components/SignupCard";
import LoginCard from "../components/LoginCard";
import { useRecoilState, useRecoilValue } from "recoil";
import { authScreenAtom } from "../atoms/authAtom";

// hami esma chai recoil use gareko xam
// recoil chai redux jastai state management library ho
// recoil atoms vneko chai euta shared piece of state ho, yesko chai euta unique id hunxa jasle hami yo state lie identify garna sakxam
// key vnera hunxa, tesma hamile atom ko name dinxam ani default ma esko default value dinxam
// (detailed explanation chai authAtom.js ma xa)
// recoil ko atoms vaneko redux ko slices jasto ho

const AuthPage = () => {
    // const [authScreenAtomValue, setAuthScreenAtomValue] = useRecoilState(authScreenAtom);

    const authScreenAtomValue = useRecoilValue(authScreenAtom);

    return <>{authScreenAtomValue === "login" ? <LoginCard /> : <SignupCard></SignupCard>}</>;
};

export default AuthPage;
