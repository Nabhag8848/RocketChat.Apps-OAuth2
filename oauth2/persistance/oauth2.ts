import {
    IPersistence,
    IPersistenceRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";
import { IUser } from "@rocket.chat/apps-engine/definition/users";

export class OAuth2Storage {
    constructor(
        private readonly persistence: IPersistence,
        private readonly persistenceRead: IPersistenceRead
    ) {}

    public async connectUserToClient(clientId: string, user: IUser) {
        const id = await this.persistence.updateByAssociations(
            [
                new RocketChatAssociationRecord( // user association
                    RocketChatAssociationModel.USER,
                    user.id
                ),
                new RocketChatAssociationRecord(
                    RocketChatAssociationModel.MISC, // client association
                    clientId
                ),
            ],
            { uid: user.id },
            true
        );
        // id of the updated/created record
        return id;
    }

    public async getUserIdsByClient(clientId: string): Promise<string> {
        const [result] = await this.persistenceRead.readByAssociation(
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.MISC, // client association
                clientId
            )
        );
        return result ? (result as any).uid : undefined;
    }
}
