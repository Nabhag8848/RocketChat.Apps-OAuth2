import { IModify, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom, RoomType } from "@rocket.chat/apps-engine/definition/rooms";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { UserStatusConnection } from "@rocket.chat/apps-engine/definition/users";

export async function sendDirectNotification(
    user: IUser,
    read: IRead,
    modify: IModify,
    message: string
): Promise<void> {
    const messageStructure = modify.getCreator().startMessage();
    const appUser = (await read.getUserReader().getAppUser()) as IUser;

    let room = (await getOrCreateDirectRoom(read, modify, [
        user.username,
        appUser.username,
    ])) as IRoom;
    messageStructure.setRoom(room).setText(message);
    await modify.getNotifier().notifyRoom(room, messageStructure.getMessage());
}

export async function getOrCreateDirectRoom(
    read: IRead,
    modify: IModify,
    usernames: Array<string>,
    creator?: IUser
) {
    let room;
    try {
        room = await read.getRoomReader().getDirectByUsernames(usernames);
    } catch (error) {
        this.app.getLogger().log(error);
        return;
    }
    room
    if (room) {
        return room;
    } else {
        if (!creator) {
            creator = await read.getUserReader().getAppUser();
            if (!creator) {
                throw new Error("Error while getting AppUser");
            }
        }

        let roomId: string;
        // Create direct room
        const newRoom = modify
            .getCreator()
            .startRoom()
            .setType(RoomType.DIRECT_MESSAGE)
            .setCreator(creator)
            .setMembersToBeAddedByUsernames(usernames);
        roomId = await modify.getCreator().finish(newRoom);
        return await read.getRoomReader().getById(roomId);
    }
}
