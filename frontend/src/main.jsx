import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { mode } from "@chakra-ui/theme-tools";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import "./index.css";
import { color } from "framer-motion";

// aba hami sab components ko lagi style define garni
// yo chakra ui le provide garxa

// hamile styles vanni object banayeu hai tesvitra global vani key lie modify garim
// global vanni key chakra ui le dinxa
// yesma hami j style pass garxam ni tyo throught the app all components ma by default apply hunxa
// unless hami tyo component ko style css file bata arkai change garxam, tyo change garyo vani chai changed wala nai linxa

// aba tyo global key ma hamile euta function pass grekoxa kina vanu hamilie dynamic background re color property chiyeko xa
// yo function ahile kun mode select vako xa tyo note grera rakheko hunxa, ani tesle tyo current mode argument linxa body : (props)

// ani hamile tyo function vitra euta object return greko xa jun ko main key body xa, yo body ko meaning <body> tag ho
// tyo body tag vitra hamile color ra bg define gareko xa, ani tyo  mode function use grera dynamic way ma gareko xa
// mode function le 2ta argument linxa, light theme ko color, dark theme ko color ani tyo function le arko function return garxa

// tyo jun function return garna ni tyo function ko argument le ahile kun mode select greko xa light xa ki dark xa tyo linxa argument ma
// ani tyo light ki ta dark anusar mode ma pass greko color finally return garxa

// tyo (props) le chai current theme "light" kita "dark store greko hunxa"
// javascript ma yedi function le function return greko xa vani hami tyo vitra ko return function lie argument yesari pass garxam
// function theme (light, dark) {
//   return function (props) {
//   if props.colorMode = light
//   return light
//   else return dark
//      }
// }
// aba hmile yo main theme functin ra tesko return function ko lagi atgument pass garnu xa vani yesari garna milxa
// theme (light_color, dark_color) (return_function_ko_tyo_props_argument_ko_lagi_value)

// chakra ui vitra styles vanni object hunxa so import to use colors vanni variable name

const styles = {
    global: (props) => ({
        body: {
            color: mode("grey.800", "whiteAlpha.900")(props),
            bg: mode("grey.100", "#101010")(props),
        },
    }),
};

// aba configuration ko lagi hamile euta variable banako
// config euta object ho kun le initalColorMode ra useSystemColorMode key lie modify garxa
// yo dutai key chakra ui le provide greko ho, yo key chakra ui le bujxa ki defalt them dark rakhni, tara system ma light xa vani
// system ko hisab le light lini, system ma k select greko xa teslie priority dini

const config = {
    initialColorMode: "dark",
    useSystemColorMode: true,
};

// aba yo chai custom color define gareko object,
// chakra ui vitra colors vanni object hunxa so import to use colors vanni variable name
// yesle gray color lie light ra dark ma further classify garxa
// colors.gray.light xa vani euta color apply hunxa ani if color.gray.dark xa vani arko color apply hunxa
const colors = {
    gray: {
        light: "#a3a3a3",
        dark: "#1e1e1e",
    },
};

// aba hamile theme vani constant ma extendTheme greko xa
// yo pani chakra ui le provide greko if hamilie kunai chakra ui ko configuratio styles ra color haru lie change garnu xa vani
// hamile chakra ui ko default config change greko, mode ko hisable style pani deko ani new color pani add greko chakra ui ko default theme vitra
const theme = extendTheme({ config, styles, colors });

// chakra ui use garna ko lagi hamro main app component lie <ChakraProvider> component ma wrap garnu parxa ani theme extend greko xa vani
// tyo theme as props pani pass garnu parxa
// tara hamile color ko lagi mode functin pani use greko xa so tesko lagi chakra ui le deko euta script component pani use garnu parxa
// yo ColorModeScript component chai App component ko thakkya mathi use garnu parxa
//  <ChakraProvider theme={theme}>
//      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
//      <App />
// </ChakraProvider>

// tespaxadi react router dom install greraab lie <BrowserRouter> component vitra wrap garni for enabling routes
// ani app.jsx ma gyera routes banauni

createRoot(document.getElementById("root")).render(
    // strict mode chai safe mode ho re yesle jahilai sab component lie twice render garxa re
    // so fetch haru use greko xa ani console log garyo vaney yesle first ma null log hunxa ani balla fetched wala kina ki fetch hunu vanda agadi
    // yo strict mode le render gari halxa re, yo strict mode production ma jada always afai hatxa re so no need to worry

    <StrictMode>
        <RecoilRoot>
            <BrowserRouter>
                <ChakraProvider theme={theme}>
                    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                    <App />
                </ChakraProvider>
            </BrowserRouter>
        </RecoilRoot>
    </StrictMode>
);
