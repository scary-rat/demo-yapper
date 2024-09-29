import { Button, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import HomePage from "./pages/HomePage";
import LogoutButton from "./components/LogoutButton";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";

// hami app ma routes banau ni, tara this project ko lagi outlet use na grerko
// main container vitra routes define greko

// routes hamile dynamic define greko xa
// /:username vneko username chai variable ho so /harry /mark /james j add gre pani t=yo page open hunxa
// but data hami jun display garam xam yo page ma tyo pani dynamic hunxa according to the username
// /harry le yo userpage access garda harry ko data dekhauni ani /mark le garda mark ko dekhauni

// testai hamile post page ko lagi pani dynamic route define gareko xa

// yersma hamile aba protected route jasto pani define greko xa
// user logged in xa vaney userAtom vanni global state ma user ko data save hunxa hai so hamile tesko value user ma yo app component ma liyera rakhekoxa
// user logged in xaina vaney yo value null huxa ani logged in xa vney null hudaina
// so tyo check grera hamile route protected banak xa
// logged in xaina vaney i.e user null xa vaney / home page ma auda auth page ma navigate gra vneko xa smililary with update page

// aba user le log in garni bitikai user variable ma data auxa ani user true hunxa so user true xa ani auth page access garna lgeko xa vaney
// teslie navigate to the home page gardeko xa

function App() {
    const user = useRecoilValue(userAtom);
    console.log(user);
    return (
        <Container maxW="672px">
            {user && (
                <>
                    <LogoutButton></LogoutButton>
                </>
            )}
            <Header></Header>

            {user && <CreatePost></CreatePost>}

            <Routes>
                <Route path="/" element={user ? <HomePage></HomePage> : <Navigate to="/auth"></Navigate>}></Route>
                <Route path="/:username" element={<UserPage></UserPage>}></Route>
                {/* aba hai chai /username/post/12334324324 page ma jada we can get 
                    username by using {username} = useParams
                    ani postID by using {postId} = useParams                 
                */}
                <Route path="/:username/post/:postId" element={<PostPage></PostPage>}></Route>
                <Route path="/auth" element={user ? <Navigate to="/"></Navigate> : <AuthPage></AuthPage>}></Route>
                <Route
                    path="/profile/update"
                    element={user ? <UpdateProfilePage></UpdateProfilePage> : <Navigate to="/"></Navigate>}
                ></Route>
            </Routes>
        </Container>
    );
}

export default App;
