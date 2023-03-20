import {
    IRead,
    IModify,
    IHttp,
    IPersistence,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    ISlashCommand,
    SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";
import { CmdParameters } from "../enums/cmdparams";
import { helperMessage } from "../lib/helperMessage";
import { OAuth2App } from "../OAuth2App";

export class NotionCommand implements ISlashCommand {
    constructor(private readonly app: OAuth2App) {}

    public command: string = "notion";
    public i18nParamsExample: string = "NotionCommandParams";
    public i18nDescription: string = "NotionCommandDescription";
    public providesPreview: boolean = false;

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<void> {
        const param = context.getArguments()[0];
        const oauth2Instance = this.app.getOAuth2Instance();
        switch (param) {
            case CmdParameters.LOGIN: {
                oauth2Instance.login(read, http, modify, persis, context);
                break;
            }
            case CmdParameters.LOGOUT: {
                oauth2Instance.logout(read, http, modify, persis, context);
                break;
            }
            case CmdParameters.TEST: {
                oauth2Instance.test(read, http, modify, persis, context);
                break;
            }
            case CmdParameters.HELP: {
                await helperMessage(read, http, modify, persis, context);
                break;
            }
            default: {
                await helperMessage(read, http, modify, persis, context);
            }
        }
    }
}
