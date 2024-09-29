import { atom } from "recoil"

// yo chai user atom ho, yeslie hami user ko global state pani vanna sakxam
// user global state ko default value chai tyo local storage batai auxa

// aba signup garna ko lagi hami fetch bata post request garxam hai

// ani databse bata cookies create hunxa ani save pani hunxa ani response ma user ko name id email auxa

// hami aba tyo aako user ko data lie local storage ma save garni ani tesko value yo global state ma pani update garni

// yo kina greko vaney ni, hamile login kita sign up grepaxi aba hamilie login page ma gyo vaney home page ma redirect garnu xa

// tesaile yesto garyo vaney hamilie frontend ma pani tha hunxa ki user logged in xa

// cookies lie hamile http only greko xa so javascript le tyo read garna sakdaina tesaile hamile local storage ma pani save greko ho

// aba jaba logout button press garxam ni, tesle k garxa vaney logout rout ma request pathauxa, tesle cookies ta clear hunxa ani
// plus hami user vanni kun global state bana ko thiyo ni teslie pani null garxam ani jun local storage ma save greko xa ni teslie pani delete garxam

// tara ava user le direct cookie editor le cookies delete garyo vani k garni ? tesko lagi paxi ma work garxa
// logic k socheko xa vaney unauthorised vanni pani euta atom banauxu ani jaba k request pani janxa ni backend ma teti khera unauthorised vnera
// response ayo vaney hami user global state lie null garni ani plus tyo local storage ma save vko lie pani delete garni



const userAtom = atom({
    key: "userAtom",
    default: JSON.parse(localStorage.getItem("user-threads"))
})

export default userAtom