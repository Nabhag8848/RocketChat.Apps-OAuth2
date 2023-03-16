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
import { OAuth2App } from "../OAuth2App";

export class NotionCommand implements ISlashCommand {
    constructor(private readonly app: OAuth2App) {}

    public command: string = "notion";
    public i18nParamsExample: string = "";
    public i18nDescription: string = "Notion Authorization";
    public providesPreview: boolean = false;

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<void> {
        const param = context.getArguments()[0];

        switch (param) {
            case CmdParameters.LOGIN: {
                break;
            }
            case CmdParameters.LOGOUT: {
                break;
            }
            case CmdParameters.TEST: {
                break;
            }
            default: {
            }
        }
    }
}
