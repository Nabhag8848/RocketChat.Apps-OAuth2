import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { MessageActionType } from "@rocket.chat/apps-engine/definition/messages";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { OAuth2Setting } from "../config/Settings";
import { OAuth2Locator } from "../enums/oauth2";
import { OAuth2App } from "../OAuth2App";
import { OAuth2Storage } from "../persistance/oauth2";
export class OAuth2Client {
    constructor(private readonly app: OAuth2App) {}
    public async login(
        read: IRead,
        http: IHttp,
        modify: IModify,
        persis: IPersistence,
        context: SlashCommandContext
    ): Promise<void> {
        const { client_id, client_secret, redirect_uri } =
            await this.getOAuth2Settings(read);

        const oAuthStorage = new OAuth2Storage(
            persis,
            read.getPersistenceReader()
        );
        const id = await oAuthStorage.connectUserToClient(
            client_id,
            context.getSender()
        );

        const appBot = (await read.getUserReader().getAppUser()) as IUser;
        const messageBuilder = modify
            .getCreator()
            .startMessage()
            .setRoom(context.getRoom())
            .setSender(appBot);

        const full_redirect_uri = redirect_uri + OAuth2Locator.redirectUrlPath;

        const response = `${OAuth2Locator.authUri}client_id=${client_id}&redirect_uri=${full_redirect_uri}`;
        try {
            messageBuilder.addAttachment({
                text: "Login to your Notion Account",
                actions: [
                    {
                        type: MessageActionType.BUTTON,
                        text: "Login",
                        msg_in_chat_window: false,
                        url: `${response}`,
                    },
                ],
            });

            await modify.getCreator().finish(messageBuilder);
        } catch (err) {
            messageBuilder.setText(
                "An error occurred when trying to send the login url:disappointed_relieved:"
            );

            await modify
                .getNotifier()
                .notifyUser(context.getSender(), messageBuilder.getMessage());
        }
    }

    public async logout(
        read: IRead,
        http: IHttp,
        modify: IModify,
        persis: IPersistence,
        context: SlashCommandContext
    ) {
        const oAuthStorage = new OAuth2Storage(
            persis,
            read.getPersistenceReader()
        );

        const tokenInfo = await oAuthStorage.getTokenInfoOfUser(
            context.getSender().id
        );

        const appBot = (await read.getUserReader().getAppUser()) as IUser;
        const messageBuilder = modify
            .getCreator()
            .startMessage()
            .setRoom(context.getRoom())
            .setSender(appBot);

        if (tokenInfo?.access_token) {
            const tokenInfo = await oAuthStorage.removeTokenInfoOfUser(context.getSender().id);
            messageBuilder.setText("✅ Logout Successful");
        } else {
            messageBuilder.setText(
                `You are already logout! Login to your workspace \`/notion login\``
            );
        }

        await modify
            .getNotifier()
            .notifyUser(context.getSender(), messageBuilder.getMessage());
    }

    public async test(
        read: IRead,
        http: IHttp,
        modify: IModify,
        persis: IPersistence,
        context: SlashCommandContext
    ): Promise<void> {
        const oAuthStorage = new OAuth2Storage(
            persis,
            read.getPersistenceReader()
        );

        const tokenInfo = await oAuthStorage.getTokenInfoOfUser(
            context.getSender().id
        );
        const appBot = (await read.getUserReader().getAppUser()) as IUser;
        const messageBuilder = modify
            .getCreator()
            .startMessage()
            .setRoom(context.getRoom())
            .setSender(appBot);

        if (tokenInfo?.access_token) {
            messageBuilder.setText("User is already loggedIn :rocket:");
        } else {
            messageBuilder.setText("Login to your workspace `/notion login`");
        }

        await modify
            .getNotifier()
            .notifyUser(context.getSender(), messageBuilder.getMessage());
    }

    private async getOAuth2Settings(read: IRead) {
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

        return {
            client_id,
            client_secret,
            redirect_uri,
        };
    }
}
