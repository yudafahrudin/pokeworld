import React, { useState, useRef } from "react";
import { css } from '@emotion/css'
import HCaptcha from "@hcaptcha/react-hcaptcha";

import { FormInput, Button } from "../components";

const container = css`
    margin: 20px 0;
`

function Hcaptcha() {
    const captchaRef = useRef();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("Secret123@")
    const [accessToken, setAccessToken] = useState("")
    const [hcaptchaKey, setHcaptchaKey] = useState("")
    const [captchaToken, setCaptchaToken] = useState("")
    const [userName, setUserName] = useState("")
    const [resultVoting, setResultVoting] = useState(null)

    const getRespKey = () => {
        try {
            const res = captchaRef.current.getRespKey();
            console.log("Response Key: ", res);
            setHcaptchaKey(`P0_` + res.split("_")[1])

        } catch (error) {
            console.log(error);
        }
    };

    const executeCaptcha = async () => {
        try {
            const res = await captchaRef.current.execute();

        } catch (error) {
            console.log(error);
        }
    };

    const setEmailInput = (event) => {
        setEmail(event.target.value)
    }

    const setPasswordInput = (event) => {
        setPassword(event.target.value)
    }

    const setHcaptchaKeyInput = (event) => {
        setHcaptchaKey(`P0_` + event.target.value.split("_")[1])
    }

    const setEkeyToken = (ekey) => {
        setHcaptchaKey(ekey)
    }

    const generateCaptchaToken = async () => {
        const requestOption = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hcaptchaResponse: hcaptchaKey })
        }

        await fetch("https://www.mnetplus.world/api/common-service/v1/captcha/token", requestOption)
            .then(res => res.json())
            .then(
                (result) => {
                    setResultVoting(null)
                    setCaptchaToken(result?.data.captchaToken)
                },
                (error) => {
                }
            )
    }

    const votingFeature = async () => {
        const requestOption = {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(
                {
                    "selectedItems": [
                        {
                            "optionGroupId": "zDZZo4CvdYG6T93J-zbez",
                            "optionIds": [
                                "qa-ttAUgJab6_pAOWNaMv",
                                "7i-Xo83j7C3Dxc5hy4vg9",
                                "7pthxw4FYcpgCy2SSKRqh"
                            ]
                        }
                    ],
                    "captchaToken": captchaToken
                }
            )
        }

        await fetch("https://www.mnetplus.world/api/vote-service/v1/vote?voteId=bqYCDWDNlQukDG2FGigBX",
            requestOption)
            .then(res => res.json())
            .then(
                (result) => {
                    setResultVoting(result.data)
                    setCaptchaToken("")
                    setUserName("")
                    setEmail("")
                },
                (error) => {
                    setCaptchaToken("")
                    setUserName("")
                    setEmail("")
                }
            )
    }

    const getAccountInfo = async (accessToken) => {
        const requestOption = {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
        }

        await fetch("https://www.mnetplus.world/api/account-service/v1/user/me",
            requestOption)
            .then(res => res.json())
            .then(
                (result) => {
                    if (result) {
                        setUserName(result.data.userName)
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

    const onSubmitToken = (token) => {
        console.log(token)
    }

    return (
        <div className={container}>
            <h2 className={css`margin-left:10px`}>Hcaptcha tester</h2>
            <div>
                <HCaptcha
                    ref={captchaRef}
                    sitekey="f1d1b649-d854-4456-89fc-31c65bd938f4"
                    onVerify={(token, ekey) => {
                        setEkeyToken(`P0_` + ekey.split("_")[1])
                    }}
                />
                <small
                    style={{ fontWeight: "bold" }}>
                    1. Submit Key : {hcaptchaKey ? hcaptchaKey.substring(0, 20) + '...' : "(kosong)"}
                </small>
            </div>

            {hcaptchaKey && (<div>
                <br />
                <Button bgColor="primary"
                    onClick={generateCaptchaToken}
                >Generate captchaToken</Button>
                <br />
                <small
                    style={{ fontWeight: "bold" }}>
                    2. CaptchaToken : {captchaToken ? captchaToken : "(kosong)"}
                </small>
                <br /><br />
            </div>)}

            {captchaToken && (<div>
                <FormInput
                    onChange={setEmailInput}
                    value={email}
                    placeholder="email"
                />
                <br />
                <small>your password should <b>{password} </b></small>
                <br />
                <br />
                <Button bgColor="primary"
                    onClick={onLogin}
                >Login</Button>

                <small style={{ marginLeft: 10, fontWeight: "bold" }}>
                    3. Username : {userName ? userName : "(kosong)"}
                </small>
            </div>)}

            {userName && (<div>
                <br />
                <Button bgColor="primary"
                    onClick={votingFeature}
                >Lets Vote</Button>

            </div>)}
            {resultVoting && (
                <div style={{ marginTop: 20, border: "1px solid", textAlign: 'center', paddingTop: 10, paddingBottom: 10 }}>
                    <small>Voting Date</small> : {resultVoting && resultVoting?.voteDate} <br />
                    <small>Pelanggaran Voting</small> :
                    {resultVoting?.abuseCheck === "ok" && <><b style={{ color: "green" }}> tidak ada</b></>}
                    {resultVoting?.abuseCheck === "warn" && <><b style={{ color: "red" }}> change your IP</b></>}
                </div>)}
        </div>
    )
}

export default Hcaptcha;

// v:750f21b
// sitekey:f1d1b649-d854-4456-89fc-31c65bd938f4
// host:localhost.com
// hl:id
// motionData:%7B%22st%22%3A1659636686453%2C%22mm%22%3A%5B%5B123%2C25%2C1659636686462%5D%2C%5B100%2C49%2C1659636686491%5D%2C%5B83%2C70%2C1659636686553%5D%2C%5B82%2C70%2C1659636686642%5D%2C%5B82%2C70%2C1659636686658%5D%2C%5B82%2C70%2C1659636686676%5D%2C%5B80%2C70%2C1659636686709%5D%2C%5B29%2C53%2C1659636687087%5D%5D%2C%22mm-mp%22%3A69.44444444444444%2C%22md%22%3A%5B%5B29%2C53%2C1659636687087%5D%5D%2C%22md-mp%22%3A0%2C%22mu%22%3A%5B%5B29%2C53%2C1659636687093%5D%5D%2C%22mu-mp%22%3A0%2C%22v%22%3A1%2C%22topLevel%22%3A%7B%22st%22%3A1659636686061%2C%22sc%22%3A%7B%22availWidth%22%3A1440%2C%22availHeight%22%3A814%2C%22width%22%3A1440%2C%22height%22%3A900%2C%22colorDepth%22%3A30%2C%22pixelDepth%22%3A30%2C%22top%22%3A0%2C%22left%22%3A0%2C%22availTop%22%3A25%2C%22availLeft%22%3A0%2C%22mozOrientation%22%3A%22landscape-primary%22%2C%22onmozorientationchange%22%3Anull%7D%2C%22nv%22%3A%7B%22permissions%22%3A%7B%7D%2C%22pdfViewerEnabled%22%3Atrue%2C%22doNotTrack%22%3A%22unspecified%22%2C%22maxTouchPoints%22%3A0%2C%22mediaCapabilities%22%3A%7B%7D%2C%22oscpu%22%3A%22Intel%20Mac%20OS%20X%2010.15%22%2C%22vendor%22%3A%22%22%2C%22vendorSub%22%3A%22%22%2C%22productSub%22%3A%2220100101%22%2C%22cookieEnabled%22%3Atrue%2C%22buildID%22%3A%2220181001000000%22%2C%22mediaSession%22%3A%7B%7D%2C%22webdriver%22%3Afalse%2C%22hardwareConcurrency%22%3A4%2C%22geolocation%22%3A%7B%7D%2C%22appCodeName%22%3A%22Mozilla%22%2C%22appName%22%3A%22Netscape%22%2C%22appVersion%22%3A%225.0%20(Macintosh)%22%2C%22platform%22%3A%22MacIntel%22%2C%22userAgent%22%3A%22Mozilla%2F5.0%20(Macintosh%3B%20Intel%20Mac%20OS%20X%2010.15%3B%20rv%3A103.0)%20Gecko%2F20100101%20Firefox%2F103.0%22%2C%22product%22%3A%22Gecko%22%2C%22language%22%3A%22id%22%2C%22languages%22%3A%5B%22id%22%2C%22en-US%22%2C%22en%22%5D%2C%22onLine%22%3Atrue%2C%22plugins%22%3A%5B%22internal-pdf-viewer%22%2C%22internal-pdf-viewer%22%2C%22internal-pdf-viewer%22%2C%22internal-pdf-viewer%22%2C%22internal-pdf-viewer%22%5D%7D%2C%22dr%22%3A%22%22%2C%22inv%22%3Afalse%2C%22exec%22%3Afalse%2C%22wn%22%3A%5B%5B680%2C722%2C2%2C1659636686063%5D%5D%2C%22wn-mp%22%3A0%2C%22xy%22%3A%5B%5B0%2C0%2C1%2C1659636686063%5D%5D%2C%22xy-mp%22%3A0%2C%22mm%22%3A%5B%5B213%2C144%2C1659636686277%5D%2C%5B213%2C148%2C1659636686293%5D%2C%5B213%2C152%2C1659636686310%5D%2C%5B213%2C158%2C1659636686326%5D%2C%5B212%2C164%2C1659636686346%5D%2C%5B212%2C171%2C1659636686376%5D%2C%5B211%2C179%2C1659636686394%5D%5D%2C%22mm-mp%22%3A18.857142857142858%7D%2C%22session%22%3A%5B%5D%2C%22widgetList%22%3A%5B%220q4tuy60h79%22%5D%2C%22widgetId%22%3A%220q4tuy60h79%22%2C%22href%22%3A%22http%3A%2F%2Flocalhost.com%3A3000%2Fhcaptcha%22%2C%22prev%22%3A%7B%22escaped%22%3Afalse%2C%22passed%22%3Afalse%2C%22expiredChallenge%22%3Afalse%2C%22expiredResponse%22%3Afalse%7D%7D
// n:eb0fdee41a08fbef2fc56e2aca20f5156682356bf580031fbc75ac9358876dcbc50f4f80d4074dd279a2f923e46721c046a1d02fbe1b08a2a8f99cb234bbdca037e7f3607399049e6f322ba01ea1848ca5b857827e2231696bcdc803d172bc0a2e43cb477da534996055d8527bcae25958ca3f8019527ef230df04b9ea6d84f4d170194c52a51c34da73cec8c8f7ad2ae10df29c1a7d62eb5e00c90bdcbf5723a4155d13d3eb56fc7bc774d0abce9377e7d7baefc2260b7ac0d12423e25faf8d28707c42f4c36e1d52ffbce21f5b27f0de935e63e44d9bcce9427923f9aee18d3ab11a6004d68c7fecba4a495a665630e9b9b92c0b9b84b542304b73782992beac951618a3c1ffbe54e1433703fc56b4d84bfb7e388f13b4d41652b64f65fdf222be0ea043072d5a9453bbb1080e276d8bdc984723698733643af009e37e4a7c5f983b29be0643aa796867679024e5352d15af9f70e0427e72beb037548520f13963581d6be4f376c75244b7c05c9caf9b91a872f10e57333d7065510a007528c5330dba80667005ade15d9f3c772e8dc538d736a26842aa42584bbbbd4ab1f65377953511266281cb28084af33dc22ef636bc1dea25502a38babc3a607c14da121abbd22005f4af42fc91493cbf22e43a303b73f22abae32a64bb3838cba1d1ecb2870cfbf16b9cc9c338f644e5aee7b233ae0005251c956eba18ed345dc9dfd43b6f4150c9dd1ca532586d2928f6bf1069404a1ab778389911b95650668872b439b461cfbe4350c5b9fb8edabf116d50c3655e8a9cbd6c26e51b8617b1ec80bc7cf251057da0a4ea109e460f311cdaf8e5abc23f8626cebe7d8ee567606a8f3fbf3512b21dc19583d200af873a00b729a6b92750e40852a9f3a95a05ae39d9fb0ff5205a4f6c6624dc8ee406f9b1fff2ead7453b5a4fa4630c48db7a576950c80606b38ea8d6137515a1a86b10df33317bde00ed69a46e552fc5412a62701f4dcb67ab305efedcc364ca0931bb8ea8e95f9297978479c2c02a3266e444477d5705ca51fac42b80a90876923ef38954974440e87d40947c97f3e8fc279bfa244d3976105c05c37cf4439d10f36adffe3033409da6868eb82e49ed4081931f4dcd931af9493e8f55af6e17e2515c887e6b870ba5980f0b9b5104b74fb3f50c9560244b3cb7866cc7098551785723382d4be5dbacb065c2df2c30991f0ed754f14cb58cd374cef5007d5eabe00dbff79daaa181e27e66200723e2691dbee59c3c62ceb85049e453e6b54b9a182191daa9059d5029ac799ab736c613b967d7bef8df85ba531d26a52fd6be9384ad2ff0caa0f828c655b54d46cf12abf0e9fb22c0ebfd85338052e0d097cc6d4901e5e2a1b9f1a643fb0c3602d83fa3e83905e99e32bd6e0560ca59d0b9ccaa824cb0fa07258dc1369cc56a4c1015c0a67e7e5269574e0f748dd4a0f623c8a780d71faeacc878075fcfcbe3a70ee43af8ed64da9cce6ccdf07481ff69718b26132050f1feaf01343cef809ee832c75687db6ac683082970bcded00a1e4dc29ec01b1d95d2c09070115f1141be2f9e9a8f3a51eb8fa5ba2b04561213eba9c010633a7773165274a01a2bd33de23ae198d49b15e69b6e8fbfacb86bb8bd45e77539f36ae497af7b2e836219862b48741054e69b62ea4bda2ccfd26acbfeb292c48ff50de0f9ee5d27d05756a640627fa2ec1ddab6f4e46bd6249089ce64aa118f2586b514a7f57da157c965e875aad984596b81e75beef17891042e303219ae8f0d3273dd8e9206c9cbebb7d7c557d927081658b7eab37504934e2c66ef7f36e5563d96c9290ac94d1fafe31cf00e4b3df0bc80c03d24f224afba356ebfff9320800427f81edefd0206845e921bbb61c3f5e3f72599974bb5a9831392c3ca8f2e5496f1de4b416539710398f24ac9a0b8d97a48ecf9a70e11a810c5ee575afb87656408c11a2845a846f4d8a717da86207c8e42afaecb2331e50f2b47a843f2d189ad2639d469fe9a59e785bb1a0bcb33585d642a8713150194913e0039cd1d1deecef3b02ae2236c77d981ea8ab6bb213d6b7bb29f349ace0404d384be379f05674832a15a8d6e5f5537cbc796b9abcdc825d4ad1c2c490e93ffff5cbe9929a8da958fa9480d85c394e808dc739b0a0e74066d3c0b135f4578c69f6557d8b659fdd63b1537993654273c805cab9a7ddc73a707a8378cf6b645a4e7787a5007da2955fa01e4babbce4c50819864cb4df6d03883d43732f16e81fdf19053ee415dba765fc5e864ceb37b4d3d31b727274241f2eeee5e50e5cbf43356bb50e07614ab95080611e2ffb95b97bba898151cc40cf8e90b5596f0a0a86760a345d4592d22e0f0e937ade09c677290ba9cd73879a028795dbed6eeb6232ee2b127d04d60b4af4f84cf78293921059531ab2812711987220769685744e1753aada1851668045f3302be75d76630691f53d2b9ac2a5700d0d6445e30ca82a409aee42de2255c89beb1d64a935e02ce3e96e216d2f3609fd89f617420ea64e8fb28988d651c39a9a9f5c7490a67b03daa794ec9c235868f7210ccda2aa8327edc0f0fa153acf081bda4f680ac4a867ad731bb8339174cb06108bea6e39fb950a2872406bc09c946435e7486a78934ef7e0f69559fded3041d57a13b76c7bb1dac25eead68442282342aa5aa3b3ea1c7eac2d2aa0ee82ec7dbb33a9a3beafcaa7ecabc58e085cf8842cbd826f252e13f3adf5667d8ada109ba6b8a0704bfbc17e2364449679f820a82dd9b941b8a15d8b9b4233c42870279f8e0a8699ce3391d2600b2f767ca1d606385447ef883d132f92f1135fcf3f3aa23c06c1d1985629a1a5d016ec25981f6d8f1aa54df08039c5c3d353a623102d959a647eadeb561d57b2fece502eca9cbcb37f26e4c49aafeb9bef86e001b0f500d23c3b1271635ea10b1fc79359be38b3c98c84201f820eac816a15bd48998f28a397b151e454fb4ffb836cd0c63422864578d2228b29cff5c18883b549974b27b44fa42001163d97f75b0a88fb04bc4a9c6d053b7bf967f96eee532faa62228bed7b9fe77d878d38af7a90160b383ac593a0340adb19f85bfd17e1bc29b1896e4d77d94ba7b5ff164329db59977044feff70a6a3627b6d44b1d685c15ba5bba352fd995a68af49c502793c7c557bc5d3de4220519b401514742a42cd7769e23bdb7072c3aee8479903dbde4e309999002eb286d84160d1b8415609179b7a16334175ff0d3853c1ad4f78cef871b18ee195271a35fa7b61a33c9f36a135a644439025377b77b2361ff61b9090f76dfcdc35658a7aa1ccf7d409bd6c99469a0d97e045a5696337353ced33d2a874437d1641f7f7aa6861740b6ef805c9ded98cc20267731c24fa324c8d60c3b99e6367069f8a5df965f2cac1104143cc5c4deefe9bc261778eacab07ad5cfb1b60fcbb43b277935c0284d60d534d71afb89383668816cc15b85a9f79a354752175d3bc72818acd5864dfc180175b3c5f24c6436e9f1b1d75061086e164dcb6c9ac3581a8b6e1e2e288b95c976719eae33a9241fe65c9bd63585825eb598df6098747d6dfb5a63dcf60cdbb1d4abf2775b6274bfbb5cec0f69bd1951be3efc87adaf37d7901cc740a32e56b8871430b7b6efb2f6b12498f147bee369d286319fb9737f9ba36fcbf9042f2b1db4147bb2c1fed34746fe18037fcc8384b444a150800d5b0f8eca2e8a6f99a887d2302eefd65868dfe44ea746a0e83f2f9ec08443b15849f52b58934e1c09440d0be7924fa896d00e532fc7d4364fcff2d21b06adabac87e9c9e169b918732c9d39c71437ec381dfade818355ef52d86fff2caeca627d0e6f9545ad0aaa2d59547e2fef2cc8b52960fb6025a3473d83e21887da001ee6f1a770730cf006a6236f12ad33c95072ab8e8690e1945b6eb62b81832f81bf46ef758f0777d6d9da65196c411e571f053eaa517bc588cfed77386ea81a9c5756268bd7519e82544cca30c007471de8714acf648c969e4fc6fe43e59074f81ce0fe39fc741e3b3c00db24f37275a064e6929bb67e845a24ea11e01c616ef80f60ce36bfbe346b387072f5c9bf5d87d6df67b4408b80ed0984f8590fc967fef68a49079db01ec30edc33326438d648161917b79887edbf0a3a61db506aa7d9fa3ba0b514b30baa1c927d0c5ce1a42e46aa2724ea13af525c8456987a84b648c10665db10307afc1219ad9c3c2e14861621e274c3c2055e403a659207729e6f63e1f7da55d7e354539029634cd4628b565cd72ec750118604a064f4df26521825957c3c7de5d3f18190aa5a7dbafbe65f132ca7c078830fb725d3a5a363933a8438ba2c4927a1308454a4cea69a9aac37d8c6c877a4fbbdbdb5f255164cc4b128e4806f4770a958390b1d167c545cfe50ff512188067e26261c3c8d1ac83c5bfed2bea77603b9652e905629ae536b6ef11f30df285bfa6ec9b8fa91010c4a57b746a3e1652ae6236a7abf5cd3c34f13335d4c4401c229f6d48818d0371f72d1980250b1179350259eb8de7e17befccb8e776b011f8c320d59b89fb92c2fd6e959a6926b7d6933ca35bfe79711ab74a8bd9fdd7be3bf11660c85b51a9f68c16b13cd0eab1e2de18abd46dabb2b2ab2cf140e663e6506d46cb8fdeb8b28b2a44472a006f9bc1ea244517da85fc0f4426dcfe1bada2e78b94dfc440c52181f803605f2e7ecd3826baf6112949d70115376bcd59925da44065110b8b0d83c3abaa30962356d2d32aaee27f10e3736c6191a0d254776c7ca3a0af2d8eb045180472ba5ec020f66694e578ebb8f4ce12610bef8082e92762a6ce09819d51b7391e42ec83a95f5fb9928c36e97d23146741cbf24ad6fdd73c39f0a1e2b789f9200&
// c:%7B%22type%22%3A%22hsw%22%2C%22req%22%3A%22eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmIjowLCJzIjoyLCJ0IjoidyIsImQiOiJMeGdXSmxSQ1M0ZDBPbmY1VHBFdEdWYVBJTExEa2lWSGxqSTZ3SURveGxuL1VsRVRwSE1TYVNTUzVUSHgxNVlSWExOcyt0aVFZUHQ3NksyZFM3azJWZjE1MzhxYnZHWG9TSFpnYzJBNUE3YkxIVkg4VFB3UlZlTUNhKy8xNVBoSkM2SVMvbnFOZ0Z5UG1Sc1JKQlByamN5MCtMMVVmY09yWEVZSzNBcThraXBkTFI5ZTEzQUl6aWdWWkE9PUFqbTNYY0NGclFMYW5TdWMiLCJsIjoiaHR0cHM6Ly9uZXdhc3NldHMuaGNhcHRjaGEuY29tL2MvZTFlZmNhMzUiLCJlIjoxNjU5NjM2OTI3fQ.t_mj-xNTaUCtrU8itKBxhrzeBbopWW2tYXVmBILjemU%22%7D