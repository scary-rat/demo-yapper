import jwt from "jsonwebtoken";

const generateCookieAndSave = (userId, res) => {
    // aba cookie lie sign garam ani tesko options haru set garam, options like expiry date
    const cookie = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });

    // aba tyo sign greko cookie lie save garam ani options pani pass garam browser ma kati time save garni (maxAge), security haru ani blah blah haru
    res.cookie("jwtcookie", cookie, {
        // yo chai more secure hunxa re, httpOnly slie true garyo vaney browser ko javascript le tyo cookie lie access garna sakdaina re
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000, //yes ma directly "15d" lekhna mildaina, hamile ms ma time dinu parxa
        sameSite: "none", // yo pani security ko lagi ho re, CSRF attack lie prevent garna re
        secure: true,

    })
    console.log("cookie created and saved")

    // aba yo generated token lie pani return garam katai use garnu parla ki
    // browser ma save ta tyo mathi kai le vai sakyo, return na gary ni hunxa katai use garnu xaina vaney, tara incase katai use garnu paryo vani vnera return greko ramro

    return cookie;
}

export default generateCookieAndSave;
