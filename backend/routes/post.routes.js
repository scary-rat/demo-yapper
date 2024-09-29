import express from "express"
import { createPost, deletePost, getFeedPosts, getPost, likeUnlikePost, replyToPost, getUserPost } from "../controllers/post.conteroller.js";
import protectedRoute from "../middleware/protectedRoute.middleware.js";

const postRoute = express.Router();




// aba hami yesma chai post haru ko lagi routes banau ni



// hami pahila get route banau ni

// pahila hami feed route define garni
//  yo pani protected route hunxa kina ki yo user ho home page jasto ho, user logged in nai xaina vaney tesko home page hudaina
// /feed /:id vanda agadi define garnu parxa kina ki
// /:id vneko dynamic route ho, yo /feed vanda mathi vyo vaniy yesle "feed" lie nai :id as variable treat garxa
// ani /feed rout ko satta / rout ma janxa with feed as a variable for dynamic routing

// tara hamile /feed lie mathi define garim vaney yo /feed match hunxa ani tala ko route execute hunna

postRoute.get("/feed", protectedRoute, getFeedPosts)


// hamile sab routes ta banayem post ko lagi 
// but hamile specific user ko sab post ko ta banakai xaina
// yo post usko profile ma hunxa ni yo user le greko sab post haru
// sab post euta user le banako hamile get garna ko lag chai get method le euta route banam getUserPost vanni
postRoute.get("/user/:username", getUserPost)

// yo route protected hunu pardaina jasle pani post herna milxa
// yo route dynamic hunxa, yesko params/url ma post ko id janxa

postRoute.get("/:id", getPost)

// ani euta create route banau ni, 
// yo chai protected route ho, protected route bata req.user ma currently logged in user ko instance createPost controller ma janxa

postRoute.post("/create", protectedRoute, createPost)

// ani euta link unlike ko lagi pani route banau ni, 
// yo chai protected route ho, protected route bata req.user ma currently logged in user ko instance likeUnlikePost controller ma janxa
// yesma id ma jun post lie like ki unlike garna lgeko ni tesko id janxa url/params ma

postRoute.post("/like/:id", protectedRoute, likeUnlikePost)

// euta delete ko lagi pani route banau ni 
// yo pani protected route hunxa, protected route bata req.user ma currently logged in user ko instance protectedRoute controller ma janxa
// yo delete post ma jun id janxa url/params ma tyo chai delete garna lgeko post ko id ho

postRoute.delete("/delete/:id", protectedRoute, deletePost)


// aba reply ko lagi pani euta route banau ni
// yo reply pani protected route hunxa so req.user ma logged in suer ko isntance janxa
// ani yesko id ma jun post ma reply garni tyo post ko id janxa

postRoute.post("/reply/:id", protectedRoute, replyToPost)





export default postRoute;