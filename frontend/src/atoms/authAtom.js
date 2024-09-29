import { atom } from "recoil";


// recoil atoms vneko chai euta shared piece of state ho, 

// atom chai euta method jasto ho jasle object as parameter linxa, 
// yo object ma hami yo atom ko unique name dinxam inside key: ani tesko starting value dinxam inside default: 

// yesko chai euta unique id hunxa jasle hami yo state lie identify garna sakxam
// yesma chai hamile jun const varaible ko name xa tesailie nai unique key / unique state ko name / unique state identifier ko name deko, esto garda easy hunxa bujna
// key vnera hunxa, tesma hamile atom ko name dinxam ani default ma esko default value dinxam

// aba yo authScreenAtom vanni jun atom banako xa ni this can be accessed by any component throughout the app 
// access garna hamile recoil le provide greko hook ko use garnu parxa

// mainly 2 ta method xa, 

// method 1:
// if hamilie tyo state ko value matra chiyeko xa, ani tesko setter function chahiyeko xaina becasue hami lie tyo file ma value matra chiyeko xa
// ani hamilie tyo file ma state change garnu xaina vaney hami useRecoilValue(atom_ko_name); use garxam
// example : const authScreenAtomValue = useRecoilValue(authScreenAtom);

// similarly hamilie yesko state change garni function matra chiye ko xa vani we can use useSetRecoilState(atom_ko_name);
// example : const setAuthScreenAtom = useSetRecoilState(authScreenAtom);


// method 2:
// hamilie both chiyeko xa same file ma kina ki hami tya value pani use gari rako xam ani teslie change pani gari rako xam vani
// we can use useRecoilState(atom_ko_name) hook
// example : const [authScreenAtomValue, setAuthScreenAtom] = useRecoilState(authScreenAtom);

// const authScreenAtomValue = useRecoilValue(authScreenAtom);

// redux ra recoil ma difference
// Redux : Redux ma chai euata Store vanni container hunxa jun ma sab state haru stored hunxa, store chai Class jasto hunxa which contains all the states
// Recoil : Recoil ma chai store hudaina ani sab atom haru chai function jastai seperated jasto hunxa

const authScreenAtom = atom({
    key: "authScreenAtom",
    default: "login"
})

export { authScreenAtom }