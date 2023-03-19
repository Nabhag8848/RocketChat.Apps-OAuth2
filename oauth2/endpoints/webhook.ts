import {
    HttpStatusCode,
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    ApiEndpoint,
    IApiEndpointInfo,
    IApiRequest,
    IApiResponse,
} from "@rocket.chat/apps-engine/definition/api";
import { OAuth2Setting } from "../config/Settings";
import { OAuth2Content, OAuth2Locator } from "../enums/oauth2";
import { OAuth2Storage } from "../persistance/oauth2";
import { sendDirectNotification } from "../lib/sendDirectNotification";

export class WebHookEndpoint extends ApiEndpoint {
    public path: string = "webhook";
    public url_path: string = OAuth2Locator.redirectUrlPath;
    public async get(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<IApiResponse> {
        const client_id = (await read
            .getEnvironmentReader()
            .getSettings()
            .getValueById(OAuth2Setting.CLIENT_ID)) as string;
        const client_secret = (await read
            .getEnvironmentReader()
            .getSettings()
            .getValueById(OAuth2Setting.CLIENT_SECRET)) as string;
        const redirect_uri = (await read
            .getEnvironmentReader()
            .getSettings()
            .getValueById(OAuth2Setting.REDIRECT_URI)) as string;

        const url = OAuth2Locator.accessTokenUri;
        const code = request.query.code;
        const final_redirect_uri = redirect_uri + this.url_path;
        const credentials = new Buffer(
            `${client_id}:${client_secret}`
        ).toString("base64");
        const response = await http.post(url, {
            data: {
                grant_type: "authorization_code",
                code,
                redirect_uri: final_redirect_uri,
            },
            headers: {
                Authorization: `Basic ${credentials}`,
                "Content-Type": "application/json",
                "User-Agent": "Rocket.Chat-Apps-Engine",
            },
        });
        if (response.statusCode !== HttpStatusCode.OK) {
            this.app
                .getLogger()
                .warn("Unable to retrieve response with auth code.");
            return {
                status: response.statusCode,
                content: OAuth2Content.failed,
            };
        }

        // store the data in persistance storage
        const oAuthStorage = new OAuth2Storage(
            persis,
            read.getPersistenceReader()
        );
        const user_id = await oAuthStorage.getUserIdByClient(client_id);
        const id = await oAuthStorage.connectUserToTokenInfo(
            response.data,
            user_id
        );

        const user = await read.getUserReader().getById(user_id);
        await sendDirectNotification(
            user,
            read,
            modify,
            "Login Successful :rocket:"
        );
        return this.success(OAuth2Content.success);
    }
}
