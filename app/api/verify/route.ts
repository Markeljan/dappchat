// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {
    SismoConnect,
    AuthType,
    SismoConnectVerifiedResult,
    ClaimType,
    SismoConnectConfig,
} from "@sismo-core/sismo-connect-server";
import { NextResponse } from "next/server";
import { setCookie } from 'cookies-next';


/************************************************ */
/********* A SIMPLE IN-MEMORY DATABASE ********** */
/************************************************ */

type UserType = {
    id: string;
    name: string;
};



/************************************************ */
/************* CONFIGURE SISMO CONNECT ********** */
/************************************************ */


// define the SismoConnect configuration
const config: SismoConnectConfig = {
    // you can create a new Sismo Connect app at https://factory.sismo.io
    appId: "0xfe303d869ab446ebc2f0d378e466a9a8",
    vault: {
        impersonate: [
            "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
            "0x66ee17d0e530fa9dec4eedb2ddd92fc3fcb1528f",
            "github:leosayous21",
            "twitter:dhadrien_:2390703980",
        ],
    },
};

// create a SismoConnect instance
const sismoConnect = SismoConnect({ config });

/************************************************ */
/***************** THE API ROUTE **************** */
/************************************************ */

// this is the API route that is called by the SismoConnectButton
export async function POST(req: Request) {
    const sismoConnectResponse = await req.json();

    try {
        const result: SismoConnectVerifiedResult = await sismoConnect.verify(
            sismoConnectResponse,
            {
                auths: [
                    { authType: AuthType.VAULT },
                    { authType: AuthType.EVM_ACCOUNT },
                ],
                claims: [
                    // we ask the user to prove that he has a gitcoin passport with a score above 15
                    // https://factory.sismo.io/groups-explorer?search=0x1cde61966decb8600dfd0749bd371f12
                    {
                        groupId: "0x1cde61966decb8600dfd0749bd371f12",
                        claimType: ClaimType.GTE,
                        value: 15,
                    },
                    // // we ask the user to prove that he is part of the Sismo Contributors group and selectively prove its level
                    // // https://factory.sismo.io/groups-explorer?search=0xe9ed316946d3d98dfcd829a53ec9822e
                    // {
                    //     groupId: "0xe9ed316946d3d98dfcd829a53ec9822e",
                    //     isSelectableByUser: true,
                    // },
                    // // we optionally ask the user to prove that he is following Sismo on Lens
                    // // https://factory.sismo.io/groups-explorer?search=0xabf3ea8c23ff96893ac5caf4d2fa7c1f
                    // {
                    //     groupId: "0xabf3ea8c23ff96893ac5caf4d2fa7c1f",
                    //     isOptional: true,
                    // },
                ],
                signature: {
                    message: "",
                    isSelectableByUser: true,
                },
            }
        );

        const user = {
            // the userId is an app-specific, anonymous identifier of a vault
            // userId = hash(userVaultSecret, appId).
            id: result.getUserId(AuthType.VAULT),
            name: result.getSignedMessage(),
        } as UserType;


        // save the user in the user store DB
        // userStore.setUser(user);
        // setCookie('sismo-user', user);
        const response = NextResponse.json(user);
        response.cookies.set({
            name: 'sismo',
            value: JSON.stringify(user),
            httpOnly: true,
            maxAge: 60 * 60,
        })
        return response;
    } catch (e: any) {
        console.error(e);
        return NextResponse.json(e.message, { status: 500 });
    }
}
