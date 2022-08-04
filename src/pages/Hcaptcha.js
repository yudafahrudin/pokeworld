import React, { useState } from "react";
import { css } from '@emotion/css'
import HCaptcha from "@hcaptcha/react-hcaptcha";

import { FormInput, Button } from "../components";

const container = css`
    margin: 20px 0;
`

function Hcaptcha() {
    const [email, setEmail] = useState("jekase4343@aregods.com")
    const [password, setPassword] = useState("Secret123@")
    const [accessToken, setAccessToken] = useState("")
    const [userName, setUserName] = useState("")
    const [userImage, setUserImage] = useState("")

    const setEmailInput = (event) => {
        setEmail(event.target.value)
    }

    const setPasswordInput = (event) => {
        setPassword(event.target.value)
    }

    const getAccountInfo = async (auth = "") => {
        const requestOption = {
            method: 'GET',
            headers: {
                Authentication: 'Bearer ' + auth,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': true,
                'User-Agent': "PostmanRuntime/7.29.2"
            }
        }

        await fetch("https://www.mnetplus.world/api/account-service/v1/user/me", requestOption)
            .then(res => res.json())
            .then(
                (result) => {
                    if (result) {
                        setUserName(result?.data.userName)
                        setUserImage(result?.data.userImage)
                    }
                },
                (error) => {
                }
            )
    }

    const onLogin = async () => {
        const requestOption = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        }

        await fetch("https://www.mnetplus.world/api/account-service/v1/user/login", requestOption)
            .then(res => res.json())
            .then(
                (result) => {
                    if (result) {
                        setAccessToken(result?.data.accessToken)
                        getAccountInfo(result?.data.accessToken)
                    }
                },
                (error) => {
                }
            )
    }
    return (
        <div className={container}>
            <h2 className={css`margin-left:10px`}>Hcaptcha tester</h2>
            <HCaptcha
                onOpen={(val) => console.log(val)}
                sitekey="f1d1b649-d854-4456-89fc-31c65bd938f4"
                onVerify={(token, ekey) => console.log(ekey)}
            />
            Name: {userName && userName}
            Image: {userImage && userImage}
            AccessToke: {accessToken ? accessToken : "access token not found"}
            <br />
            <br />
            <div>
                <FormInput
                    onChange={setEmailInput}
                    value={email}
                    placeholder="email"
                />
                <FormInput
                    onChange={setPasswordInput}
                    value={password}
                    disabled={true}
                    placeholder="password"
                />
                <div>
                    <br />
                    <Button bgColor="primary"
                        onClick={onLogin}
                    >Login</Button>
                </div>
            </div>
        </div >
    )
}

export default Hcaptcha;