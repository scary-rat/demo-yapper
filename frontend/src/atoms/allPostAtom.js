import { atom } from "recoil";


// yo global post state chai flexible hunxa, yo page ma jsti ota post xa jasko pani post huna sakxa
// tyo yo global post ma hunxa 
// could be just 1 post, could be user ko sab post, could be user ko all feed ko post 

const allPostAtom = atom({
    key: "allPostAtom",
    default: []
})

export default allPostAtom;