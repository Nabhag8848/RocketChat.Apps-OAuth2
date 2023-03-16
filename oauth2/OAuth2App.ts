import {
    IAppAccessors,
    IConfigurationExtend,
    IEnvironmentRead,
    ILogger,
} from "@rocket.chat/apps-engine/definition/accessors";
import { App } from "@rocket.chat/apps-engine/definition/App";
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata";
import { NotionCommand } from "./commands/NotionCommand";
import { settings } from "./config/Settings";
import { OAuth2Instance } from "./lib/oauth2";

export class OAuth2App extends App {
    private oAuth2Instance: OAuth2Instance;

    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    protected async extendConfiguration(
        configuration: IConfigurationExtend,
        environmentRead: IEnvironmentRead
    ): Promise<void> {
        await Promise.all(
            settings.map((setting) => {
                configuration.settings.provideSetting(setting);
            })
        );

        const notionCommand: NotionCommand = new NotionCommand(this);
        await configuration.slashCommands.provideSlashCommand(notionCommand);
    }
}
