import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minLength: 6,
        required: true,
    },
    rawPassword: {
        type: String,
    },
    profilePic: {
        type: String,
        default: ""
    },
    // yo followers chai euta array ho ani yo array vitra jun elements haru hunxa ni tyo sab ko type chai string ho
    followers: {
        type: [String],
        default: [],
    },
    following: {
        type: [String],
        default: [],
    },
    bio: {
        type: String,
        default: "",
    },
},
    {
        timestamps: true
    }
)

const User = mongoose.model("user", userSchema)

export default User;