import React, {useEffect, useState} from 'react'
import './App.css'

import Navigator from "./navigator";
import CookieConsent, {Cookies, getCookieConsentValue} from "react-cookie-consent";
import {ARButton} from "@react-three/xr";

export default function App() {
    const [showAR, setShowAR] = useState<boolean>(false);

    function handleCookieConsentAccepted() {
        setShowAR(true);
    }

    useEffect(() => {
        if (getCookieConsentValue('IndoorNavigatorPrivacyCookie'))
            setShowAR(true);
    }, []);

    return (
        <>
            {/*{showAR ? (*/}
                <ARButton/>
            {/*) : null*/}
            {/*}*/}
            {/*<CookieConsent*/}
            {/*    location={'bottom'}*/}
            {/*    onAccept={handleCookieConsentAccepted}*/}
            {/*    cookieName={'IndoorNavigatorPrivacyCookie'}*/}
            {/*    overlay>Your location is not being tracked.</CookieConsent>*/}
            <Navigator poiJsonPath={process.env.PUBLIC_URL + '/test/poi.json'}
                       startUUID={'12beebf7-6a6d-4c33-ba9f-3d96887a48cf'}/>

        </>
    )
}
