import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";

export async function helperMessage(
    read: IRead,
    http: IHttp,
    modify: IModify,
    persis: IPersistence,
    context: SlashCommandContext
) {
    const helperMessage = `:wave: Need some help with \`/notion\`?
    Use \`/notion\` to Authorize through 🚀💬 following arguments available: 
    \xa0\xa0• To login your Notion account \`/notion login\`.
    \xa0\xa0• To logout your Notion account \`/notion logout\`.
    \xa0\xa0• To check your status of Authorization with Notion \`/notion test\`.
    \xa0\xa0• To get help of Usage use \`/notion help\`.
    `;

    const messageBuilder = modify
        .getCreator()
        .startMessage()
        .setRoom(context.getRoom())
        .setGroupable(false)
        .setParseUrls(false)
        .setText(helperMessage);

    await modify
        .getNotifier()
        .notifyUser(context.getSender(), messageBuilder.getMessage());
}
