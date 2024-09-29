import mongoose from "mongoose";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from 'cloudinary';

// pahila hami single post get garna euta route banau ni
// yo protected route hudaina kina ki logged in na bhaye pani post haru view garna milxa

// simple get post, route ma auda jun url ma post ko id xa, tyo wala post database ma xa vaney teslie res.json ma send garni
// tyo post xaina vaney post not found vanni

const getPost = async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ error: `The yapping doesnt exist` })
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: `The yapping doesnt exist` })
        }
        res.status(200).json(post)
        console.log(post)
    } catch (error) {
        res.status(500).json({ error: `There was some error ${error.message}` })
        console.log("Error in getPost : ", error.message)
    }

}

// pahila aba hami post create garna euta contoller banam
// post create garna firest ma chai user logged in hunu parxa so yesko route protected xa, hamilie req.user ma logged in user ko details pani milxa
// aba postedBy ra text field chai required ho, image na bhayeni hunxa 

const createPost = async (req, res) => {
    try {

        const { postedBy, text } = req.body;

        // yo let ma kina greko vaney ni yo img url hamilie cloudnary ko url ma change garnu xa
        // detail explanation updateProfile controller ma xa inside user.controller.js ma
        let { img } = req.body

        // check garni postedBy ra text present xa ki nai, xaina vaney error pathau ni
        if (!postedBy || !text) {
            console.log("reached if check")
            return res.status(400).json({ error: "Enter something bruh. What ya yapping. Kya yapper bnega re tu" })
        }


        // xa vaney user lie find garni using id, posted by ma user ko id hunxa

        const user = await User.findById(postedBy);

        // user vetiyena bhaney error pathau ni

        if (!user) {
            return res.status(404).json({ error: "user not found" })
        }

        // user vetiyo avney feri check garni ki logged in user ra le nai afno account bata post create garna khoje ko ho ki
        // bro wanna be hacker bhayera arkako id url ma pass grera arkai ko account ma post banau na khoje ko venera
        // logged in user ko id ra post jasle banau na lageko tesko id differet xa vaney error pass garni

        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You cannot create post in someone elses account bruh. Asli ID se aa bhai" })
        }

        // aba feri euta check, tyo text ko length 500 manda less hunu parxa natra message pathauna na dini
        const maxLength = 500;
        if (text.length > maxLength) {
            return res.status(400).json({ error: `Text must be less than ${maxLength}. Itna bhi yapping nahi karna hai. Thoda kam likh` })
        }


        // aba check garni ki use le k image pani post greko xa ni nai
        // image post greko xa vaney updateProfile controller ma jasto greko ko thiyo ni user.controller.js vitra testai cloudnary ma upload garni 
        // ani tyo ako url lie cloudnary ko url ma change grera response ma pathau ni
        if (img) {
            console.log("posting image")
            const uploadedResponse = await cloudinary.uploader.upload(img)

            img = uploadedResponse.secure_url
            console.log("uploaded image")
        }

        // aba sab thik xa vaney post create garni 
        // tara post create garni 2 method rahixa
        // first method mongoose kai create method use grera banau ni like signup ma banako jasto
        // Collection_Model.create method le mongoose lo instance pani banauxa ani teslie afai save pani garxa re

        // const newPost = await Post.create({
        //     postedBy: postedBy,
        //     text: text,
        //     img: img
        // })

        // second method
        // second method chai ali different xa, Post jun model bana ko xa ni tyo yeuta object ho, but yo just simple object haina
        // tyo euta object constructor jasto ho, so hamile new keyword use grera kunai pani object constructer bata euta new object banauna milxa
        // yo javascript ko functionality ho. Jasto hami garxam ni const current_date = new Date, testai ho

        // ani yesma hamile local storage mai Post model jun xa ni tesko euta new object banauxam
        // tesko suppose euta new instance banau xam
        // ani tesko instance banaye paxi, tesmai directly data pani hamilie kasto chiye ko xa, tesko key value pass garxam ani teslie manually save garxam


        const newPost = new Post({ postedBy: postedBy, text: text, img: img })

        await newPost.save()

        // return garda hamile euta message vanni key pani xuttai pass grera pathani
        // tara yo jun newPost vanni object xa ni tyo mongoose ko mongo db ko instance bata baneko object ho
        // teslie pani hami directly modify garna mildaina 
        // (arko detail in user.contaoler.js updateProile contaoller ma xa, yo bith different ho ek choti ramrari padhad mathi dekhi)
        // so pahila hami teslie toObject vnera euta normal js object ma convert garni 
        // ani balla tyo converted object ma message vani key banau ni ani tyo converted object as response pathau ni

        const newPostObject = newPost.toObject();

        // Add message property to plain object
        newPostObject.message = "Post created successfully";

        res.status(201).json(newPostObject)
        console.log("post created", newPostObject)
    }
    catch (error) {
        res.status(500).json({ error: `There was some error ${error.message}` })
        console.log("Error in createPost : ", error.message)
    }

}

// aba post delete garna pani euta controller banauni
// logged in user le afno matra post delete garna pauxa
// arkako post delete garna paudaina 
// so yo pani euta protected route hunxa ani yesko req.user ma hamilie current logged in user ko details pani milxa
// kun post delete garni tyo pani url ma auxa

const deletePost = async (req, res) => {
    try {
        // url ma ako le post lie find garni
        const post = await Post.findById(req.params.id);

        // tyo post xaina vaney post not found vanni
        if (!post) {
            return res.status(400).json({ error: `Post not found` })
        }


        // post xa vaney feri euta check garni ki logged in user kai post ho ki haina
        // logged in user ko post haina vaney error vanni u cant delete vanni
        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(400).json({ error: `You cant stop someone else from yapping BOO!` })
        }

        // aba post ma image xa vani tyo image lie pahila cloudnary bata pani ta delete garnu parxa
        // so pahila cloudnary bata image lie delete garni 
        if (post.img) {
            const postImgId = post.img.split("/").pop().split(".")[0]
            const uploadedResponse = await cloudinary.uploader.destroy(postImgId)
        }


        // logged in user le afnai post delete garna khoje ko xa vaney successfull vanni ani message ma last time deleted post pani pathauni
        // delete chai url j post ko id ako thiyo ni tehi delete garni

        const deletedPost = await Post.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: `Post deleted succesfull`, deletedPost })
        console.log(`Post deleted succesfull`)

    } catch (error) {
        res.status(500).json({ error: `There was some error ${error.message}` })
        console.log("Error in deletePost : ", error.message)
    }

}


// aba like unlike ko lagi pani euta route banau ni
// yo chai tyo follow unfollow jastai route hunxa almost
// hami post ko likes array ma jun jun user le like garxa ni tesko id tya push gardini

const likeUnlikePost = async (req, res) => {
    try {
        // url bata post ko id lim 
        // ani user ko pani id liyera rakham
        // yo better way ho aru routes ma hamile req.params.id ra req.user._id use greko xa which is bad practice

        const postId = req.params.id;
        const userId = req.user._id;

        // url mata ako post lie hami pahila find garni
        const post = await Post.findById(postId);

        // aba post vetiyena vaney post not found error diney
        if (!post) return res.status(404).json({ error: "Post not found. No one every yapping this" })

        // tara aba post vetiyo vaney check garni ki logged in user le nai like garna lageko xa ki 
        // wanna be hacker le arkai ko acccount bata like garna khoje ko xa 
        // yo yo garna necessary xaina because logged in user kai id hami cookies bata liyera like unlike garam

        // so aba pahila check garni ki already liked xa ki nai
        // tyo check garna hamile hernu parxa ki like array ma yo logged in user ko id already present xa ki nai
        // already pressent vaye nikal diney i.e unlike garni, present na bhaye hali diney i.e push gari diney

        // mongoose ko updateOne use garni kina ki hamile one Post instance lie update greko xa i.e just one document of Post Model
        // hami likes ma push garda aru field pani update garnu paryo vaney pani milxa
        // tesko lagi mongoose kos set operator use garnu parxa rey example :
        // await post.updateOne({ _id: postId }, { $pull: { likes: req.user._id }, $set: { email: "rahul@gmail.com", name: "rahul" } })
        // set le current value lie provided value le replace garxa re

        // $push ra $pull user ko signup controller ra followUnfollowUser controller ma ramri explain greko xa

        if (post.likes.includes(userId)) {
            // yo chai mongoose ko method ho so yesle directly databse ma update garxa so hamile Post use garnu parxa
            // post use garna mildaina because yo post chai Post ko local instance ho, post use grera pani change garna milxa tyo method tala xa
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })

            // post.likes.pull.(userId)
            // await post.save();
            res.status(200).json({ message: "Post unliked successfully" })
            console.log("unliked")
        }
        else {
            // await Post.updateOne({ _id: postId }, { $push: { likes: userId } })

            // first ma hamile post instance xa ni teslie modify garnu parxa
            // yesma chai hamile post instance jun locally save xa tesko likes ma first user id push grerko
            // ani yo local instance thiyo so yeslie ab manually save pani garnu parxa

            // ani always make sure sab details field xa, if tyo detail modify greko xaina vaney pani tyo pass garnu parxa purano data halera
            // natra tyo key remove hunxa database bata
            // example : username, email, name xa ani aba hamile username = abc name = bcd garera save garim vaney tyo email field gayab hunxa databse bata
            // so  username = abc, email = already_database_ma_vako_data, name = bcd

            post.likes.push(userId)
            await post.save();

            res.status(200).json({ message: "Post liked successfully" })
            console.log("liked")
        }


    } catch (error) {
        res.status(500).json({ error: `There was some error ${error.message}` })
        console.log("Error in likeUnlikePost : ", error.message)
    }
}


// aba hami reply ko lagi controller banau ni
// yo protected route ho so yesma panir req.user ma user ko isntance ako hunxa
// yesma hami k garni vaney ni logged in user ko id, profile pic, username extract garni
// ani tyo logged in user le deko text pani lini
// ani tyo sab lie replies array vitra as a object push gardini, replies array ko each element object ho

const replyToPost = async (req, res) => {
    try {
        // aba hami first ma user le deko text ra tyo user ko sab detailes store garera rakhni
        // jun post ma reply garna lageko tesko pani id liyera rakhni

        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic
        const username = req.user.username

        // first ma check garni ki text field frontend bata ako xa ki nai asko xaina vaney error diney

        if (!text) return res.status(400).json({ error: "Text field is required" })

        // tespaxi post find garni though post id bata jun url ma ako thiyo

        const post = await Post.findById(postId)

        // testo post xaina vaney no such post vanni
        if (!post) return res.status(404).json({ error: "Post not found. No such yapping by any yapper" })

        // ani post vetiyo vaney teslie modify garni, like sab details halni ani locally jun post instance banako thiyo tesma push garni
        // ani tesailie save garni

        // ani always make sure sab details field xa, if tyo detail modify greko xaina vaney pani tyo pass garnu parxa purano data halera
        // natra tyo key remove hunxa database bata
        // example : username, email, name xa ani aba hamile username = abc name = bcd garera save garim vaney tyo email field gayab hunxa databse bata
        // so  username = abc, email = already_database_ma_vako_data, name = bcd

        const reply = {
            userId: userId,
            text: text,
            userProfilePic: userProfilePic,
            username: username,
            _id: postId,
        }

        post.replies.push(reply)
        await post.save()

        // ani response pathauda hami jun yo reply ako thiyo ni, like current reply, tyo pani xuttai pathauni
        // kinaki yo hamilie frontend ma state ko array vitra spread garnu parnixa
        res.status(201).json({ message: "Reply added successfully", post: post, reply: reply })
        console.log("Reply added successfully")


    }
    catch (error) {
        res.status(500).json({ error: `There was some error ${error.message}` })
        console.log("Error in replyToPost : ", error.message)
    }
}


// aba hami get feed ko lagi euta controller banau ni
// yesbata chai user le follow greko sab jana ko post dekhinxa
// user logged in xa vaney matra tesko home page hunxa natra tesko feed khi hunnxa
// so logged in user ko instance hamilie milxa req.user ma throught proteced route middleware

// hami k garni vaney ni first currently logged in user search garni
// ani yo user le kaslie kaslie follow greko xa tyo check garni, ani tyo sab ko post dekhau ni tara
// latest post top ma auni gari sort grera dekhau ni

const getFeedPosts = async (req, res) => {

    try {
        const userId = req.user._id;
        const user = await User.findById(userId)

        // first check garni ki yo user xa ki nai, xaina vaney user not found vanni
        // tara yo kina check grerko ? yo ta directly cookies bata ako ho user, logged in vyera ako ho but
        // user na huna sakxa, what if he got banned ki testo testo but browser ma cookies ahile pani save xa tesaile yesto check greko

        if (!user) {
            return res.status(200).json({ error: "User not found, No such yapper" })
        }

        // aba hami first ma tyo user ko following lie get garam
        // yo following chai euta array ho jun ma sab user jaslie jaslie yo logged in user le follow greko xa tesko id haru saved xa
        // aba tyo sab following user haru ko id following array ma ayo

        // hami k garni vaney ni following + logged in user ko post haru feed ma dekhauni
        // so aba following ma user.follwing ma vko sab id haru ko array ma user ko pani id haldini
        const following = [...user.following, user._id];

        // console.log(following)

        // aba hami feedPosts vanni Post ko instance banau ni
        // yesma chai hami Post.find use garni ani kasto query search garni vanay ni
        // find by postedBy ani tyo postedBy ko value chai following array ma vako sab elemet ko
        // like k huxa vaney ni
        // Post.find(postedBy: first_id_in_array)
        // Post.find(postedBy: second_id_in_array)
        // Post.find(postedBy: third_id_in_array)
        // Post.find(postedBy: last_id_in_array)
        // yesto hunxa just like loop

        // huna chai yesto hunxa "postedBy": { "$in": [first_id_in_array, second_id_in_array, third_id_in_array, ..., last_id_in_array] }
        // but picture garda mathi ko ramra ri bujinxa

        // mainly yesko matlab chai sab post find gara 
        // jun post ko postedBy key (yo posted by ko value chai user ko id ho) xa ni tyo following array vitra xa
        // aba 10 ota array ki elemnt vye i.e 10 ota user ko id vaye tyo 10 otai user le greko sab post find gara vneyko

        // ani teslie createdAt -1 le sort greko that is latest post at top, i.e decending order

        const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 })

        // ani sab post aye pani response pathauni

        res.status(200).json({ message: "All feed post fetched successfully", feedPosts: feedPosts })
        console.log("All feed post fetched successfully")

    }
    catch (error) {
        res.status(500).json({ error: `There was some errorss ${error.message}` })
        console.log("Error in getFeedPosts : ", error.message)
    }
}


// hamile sab routes ta banayem post ko lagi 
// but hamile specific user ko sab post ko ta banakai xaina
// yo post usko profile ma hunxa ni yo user le greko sab post haru
// sab post euta user le banako hamile get garna ko lag chai get method le euta route banam getUserPost vanni

const getUserPost = async (req, res) => {
    try {

        // hami k garni vaney ni first search garni ki user typed in url database ma xa ki nai
        // xa vaney tesle post greko sab post lie search garni ani response ma pathau ni
        // if tyo user xaina vani error response ma pathau ni no such user vnera

        // NOTE: Model.find user garda kheri sab data find hunxa ani array vitra tyo found data as a object auxa
        // like array ko each element chai object hunxa which matches our find query

        // findOne le chai one paticular object return garxa, yo chai object hunxa not inside array, direct object hunxa
        const username = req.params.username;

        const user = await User.findOne({ username: username })

        if (!user) {
            return res.status(400).json({ error: "No such yapper found" })
        }

        const userId = user._id
        const posts = await Post.find({ postedBy: userId }).sort({ createdAt: -1 })


        res.status(200).json(posts)

    } catch (error) {
        res.status(500).json({ error: `There was some error in getUserPost ${error.message}` })
    }


}

export { createPost, deletePost, getPost, likeUnlikePost, replyToPost, getFeedPosts, getUserPost }