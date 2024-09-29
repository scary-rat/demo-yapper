import express from "express";

// sab controllers haru import garni
import { loginUser, logoutUser, signupUser, followUnfollowUser, updateUserProfile, getUserProfile } from "../controllers/user.controller.js";
import protectedRoute from "../middleware/protectedRoute.middleware.js";

// first ta router lie euta variable ma rakham, so yo variable le euta function hold gari rako xa

// ani tyo variable batai hami sab route haru define garxam ani paxi yehi variable lie export garxa
// tesaile you variable ma j j define greko xa ni tyo pani router export garda export hunxa,

// like main vaiable nai export vako ho so yo variable ma hamile j j define greko xa tyo yo variable le jun file bata pani use garna sakxa 
// as long as we import this router variable (which contains function) in that file
const userRouter = express.Router();

// yo file ma chai hami route haru define garxam ani userRouter lie export garxam
// aba hamile yo jun userRouter lie export greko xa ni tyo hami main server.js ma import garxam ani /api/users ma yedi khi request ayo vaney teslie userRouter ma redicect garxam

// aba jun yo anonymous function xa ni tyo dherai lamo huna sakxa tesaile hami yo route ma request auda k function run garni tyo arkai file ma define garam
// yo function lie nai contollers vanxam
// so aba sab controllers haru hami arkai controller folder ma controller files vitra define garxam

// bad way
// userRouter.get("/signup", (req, res) => {
//     res.send("user signed up")
// })

// note: euta weird kura userRouter.get("/signup", signupUser) mahile yes ma get use grera controller chai post garni banako thiyo tehi pani work wo
// express jasto framework ma http method strict xaina re

// better way

// user signup route
userRouter.post("/signup", signupUser)

// hami different different file pani bnayera garna sakthinm, signup ko different controller ra login ko different controller
//  but 2ta matra controller ho vnera esmai banako

// 10 ota samma function haru xa vaney tyo eutai file mai banako ramro

// 10 vanda dherai xa vani each function ko lagi seperate file banako ramro

// kita matching matching like sign up ra login ra forget password ko same same controller, post edit create delete ko same function,
// profile edit name edit avatar haruro kame function testo testo 

// user login route

userRouter.post("/login", loginUser)

// aba logout ko route pani banam
userRouter.post("/logout", logoutUser)

// aba follow route banauni
// follow route chai dynamic hunxa, yesma user to follow ko id hunxa /follow/user_to_follow_ko_id
// ani yo route chai protected hunxa kina ki if user logged in xaina vnery yo follow unfollow garna na milni hunu parxa
// without login user le yo route access garna mildaina testo banau nu parxa
// so tesaile euta protectedRoute middleware banayera yo route ma pass garnu parxa so middle ware le check garos ki login xa ki nai
// logged in xa vaney matra /follow route access garna dios natra access nai garna na dios

// tara hami ta yo direct followUnfollowUser() ma pani check garna sakxam ki user logged in xa ki nai, ani logged in vye matra follow unfollow hos
// but yesto garyo vaney server samma request chai janxa ani serverside bata processing garnu parxa eh logged in xaina vnera, 
// yesle unnecessary server load garxa, so middle ware user garda server le response send garnu parni jasari end samma request nai jadaina
// tesaile middle ware use greko

// main reason chai yesto kina greko vaney ni hami aba yo middle ware ma user le deko request lie modify grera,
//  user le deko request + hamro necessary request attach grera controller ma pathauna sakxam ani to request lie req.hamro_request_ko_key grera access garna sakxam

userRouter.post("/follow/:id", protectedRoute, followUnfollowUser)


// aba user ko profile update garna pani euta route banam
// yo pani dynamic hunxa but yesmapani id janxa url params ma 
// update greko le put method use grekos

userRouter.put("/update/:id", protectedRoute, updateUserProfile)


// aba profile route pani banau ni 
// like mahile rocks ko profile visit garda usko sab name, posts, following / followers, profile pic haru sab dekini, logged in navaye panid dekhini
// yo route pani dynamic hunxa but hami username le data get garni, id le haina
// ani yo data get garda sensitive information like password exclude grera get garni
// hami data get garda chai username ko ta id dubai bata fetch garna milni, url ma id aye ni fetch hunxa username aye ni fetch hunxa

userRouter.get("/profile/:usernameOrId", getUserProfile)

export default userRouter;