// aba yesma chai hami choose greko file lie preview garauna ko lagi euta hook banau ni
// tyo jun profile image jasto box xa ni round, tesma file choose gare paxi preview garauna yo hook banako

// yeslie hook banako kina vaney yo fer pani tannai tham ma use garnu parni xa

// yo hook le k garxa vaney ni hami jun file upload garxam ni tyo file image ho ki nai tyo first check garxa
// file image hoina vaney error toast dinxa

// image ho vaney lesle javascript ko FileReader vanni API object use garera uplodaed file lie base 64 string ma convert garxam
// hamile pahilai check greko xa ki yo uploaded file image nai hunu parxa vnera so yesle image lie ni base 64 string ma convert garxa

/* (
so hamro output chai image nai hunxa, yo file reader le covert garda first ma always check if jun type ko file chiye ko tehi 
uploade greko xa, natra vaney unwanted kura huna sakxa
eg : aba pdf upload garyo pfp ma vaney teslie conver garxa pani tyo string use garxa image empty kita unwanted glitch jasto huna sakxa kina ki hami yo img tag vitra use gardaixam
 ) */

// ani hami tyo string use grera image lie render garna sakxam

// tyo base string lie hami imageUrl ma set garxa ani tyo imageUrl use garda tyo image render hunxa through tyo base 64 string

// base 64 ma convert garni process :
// step 1 : hami yo hook ko handleImageChange function onchange vitra use gardai xam so tesko event auxa
// step 2 : tesko event use grera hami files ma k file upload greko xa tyo get garni
//          files[0] greko kina ki yo euta object return garxa, 
//          yo object ko 0 vanni key ma uploaded files ko details hunxa ani arko length vanni key ma kati ota files upload greko tesko length hunxa
//          console.log(file) grera check garna sakinxa
// step 3: aba first ma check garni if file present xa ki nai, ani present vye yo file ko type image ho ki nai
//         yo files[0] object ma type vanni key hunxa ani yo key ma image/ doc/ i.e uploaded file ko type hunxa so check garni;
//         file && file.type.startsWith("image/") vye matra base 64 string ma convert garni natra error diney
// step 4: base urm ma convert garnxa chai euta FileReader ko reader vanni object instance banauni ani 
//         tyo reader.readAsDataURL vanni method use grera teslie base 64 string ma convert garni, tyo file complete read vye oani euta event trigger hunxa
//         tyo event chai reader.onloadend ho ani hamile tyo file completely read vye paxi tesko result chai result vanni key vitra auxa so
//         hami reader.result use grera tyo base 64 string like get garna sakxam

// NOTE : reader.readAsDataURL(file) yo chai asynchronously file read garxa re so hamile yo asynchronously file read garnu vanda agadi
// yo file read vye pani k garni vnera reader.onloadend ma define garnu parxa re
// so reader.readAsDataURL(file) le asynchronously file read garxa ani tyo file completely ready vye paxi yo reader.onloadend event trigger hunxa
// ani tesvita hami reader.result access garna sakxam
// yesma hami async await use garna milxaina kina ki yo reader.readAsDataURL(file) promise haina, but asynchronously read garxa

// NOTE: hamile reader.readAsDataURL(file) yesko tala console .log grera reader.result garem vaney tesko value null auxa
// so hamile result.onloadend event vitra reader.result lie access ra save garni parxa kina ki 
// yo event file completely reader vyera, tyo file base 64 string ma convert vye paxi ballla yo event trigger vako ho

import React, { useState } from 'react'
import useShowToast from './useShowToast';

const usePreviewImage = () => {
    const [imageUrl, setImageUrl] = useState(null)
    const customToast = useShowToast()

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log(file)
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImageUrl(reader.result)
                // console.log(reader.result)
            }

            reader.readAsDataURL(file)

        }
        else {
            if (file) {
                customToast("Invalid File Type", "Please Select Image File Type", "error")
                setImageUrl(null)
            }
        }
    }
    return { handleImageChange, imageUrl, setImageUrl }
}

export default usePreviewImage

