import mongoose from "mongoose";

// hami post lie seperate object banau ni ani yo post ma jun user le create greko xa ni tesko id pani save garni
// yo post lie user ko model ma rakhnu pardaina
// user ko id le garda nai hami tesle greko sab post access garna sakxam

const postSchema = mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        minLength: 1,
        maxLength: 500,
    },
    img: {
        type: String
    },
    // like chai euta array ho
    // yo array sa jun pani user le like greko xa ni tyo sab ko id janxa
    // hamilie likes ko count kinal na just likes.length method use garni
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },

    // replies chai array of replies ho, ani yo each reply chai euta object ho junma user ko id, user ko name, user ko pic ra username xa

    replies: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            text: {
                type: String,
                required: true,
            },
            userProfilePic: {
                type: String,

            },
            username: {
                type: String,
            }

        }
    ],


    // tyo mathiko yesari pani lekhna milxa

    // replies: {
    //     type: [
    //         {
    //             userId: {
    //                 type: mongoose.Schema.Types.ObjectId,
    //                 ref: "User",
    //                 required: true,
    //             },
    //             text: {
    //                 type: String,
    //                 required: true,
    //             },
    //             userProfilePic: {
    //                 type: String,

    //             },
    //             username: {
    //                 type: String,
    //             }
    //         }
    //     ]
    // }

}, {
    timestamps: true,
})

const Post = mongoose.model("post", postSchema)

export default Post;