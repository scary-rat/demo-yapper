
// yo euta middle ware ho tesaile yesle request lie capture garxa
// yo hamle deko request lie hold grera rakxa jaba samma hami next() function call gardainam
// next vneko chai aba yo middle ware ko kam sakiyo ani request lie next that is controller function ma pathau vneko
// yesto kina greko vaney ni hami aba yo middle ware ma user le deko request lie modify grera user le deko request + hamro necessary request attach grera pathauna sakxam

import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// yo middle ware chai async hunxa because hami database bata data read gre ko xa

const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwtcookie;


        if (!token) {
            return res.status(401).json({ error: "Unauthorised. Please login to do this action." })
        }

        // aba hami tyo cookie ma save greko id decode grera yo decodeCookie vanni variable ma save garam 
        // ani tyo id lie hami jun reuest object xa ni tesma halera server/controlelr ma pathauni, 
        // hami req object ma user key banayera tyo decodes id lie user ko value ko rup ma save grera req object lie modify grera controller ma pathau ni
        // ani tya hami user.findById(req.user.userId) le tyo user lie find garni
        // yo userId chai hamile jwt sign garda j key banako thiyo ni tehi hunu parxa

        const decodeCookie = jwt.verify(token, process.env.JWT_SECRET)

        // tara hami directly tyo user lie middle ware mai find grera tyo user lie req.user ma halera pathauna sakxam
        // yesma k risky xa vaney testo garda user ma password pani auxa ani hacker le request lie hack garna sakyo vney tyo sanga encrypted password pani janxa
        // so tyo prevent garna ko lagi hami k garni vaney ni yo user ko data jun find garxam tesbata password key lie - i.e nikalera send garni

        // yo userId chai hamile jwt sign garda j key banako thiyo ni tehi hunu parxa

        // aba hami find fgarda mongoose ko findbyid query method use garxam, tyo sangai hami arko pani euta query method dinxam
        // hami .select() query method dinxam, yesle mongoose lie vanxa ki user lie find garda explicitly yo select ma pass greko key lie inclue gara ki exclude gara
        // - for excluding + for including

        // so k hunxa vaney find gara user by id tara password key lie nikalera/exclude garera, so hamilie j data auxa tesma password key ra tesko value hunna
        const user = await User.findById(decodeCookie.userId).select("-password").select("-rawPassword")


        req.user = user;

        next();

    }
    catch (error) {
        res.status(500).json({ error: `There was some error ${error.message}` })
    }
}


export default protectedRoute;