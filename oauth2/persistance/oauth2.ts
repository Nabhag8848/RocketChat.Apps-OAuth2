import {
    IPersistence,
    IPersistenceRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { ITokenInfo } from "../definations/oauth2";

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

    public async getUserIdByClient(clientId: string): Promise<string> {
        const [result] = await this.persistenceRead.readByAssociation(
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.MISC, // client association
                clientId
            )
        );
        return result ? (result as any).uid : undefined;
    }

    public async connectUserToTokenInfo(
        tokenInfo: ITokenInfo,
        userId: string
    ): Promise<string> {
        const id = await this.persistence.updateByAssociations(
            [
                new RocketChatAssociationRecord( // user association
                    RocketChatAssociationModel.USER,
                    userId
                ),
                new RocketChatAssociationRecord(
                    RocketChatAssociationModel.MISC, // access_info association
                    "access_token with info"
                ),
            ],
            tokenInfo,
            true
        );
        // id of the updated/created record
        return id;
    }
}
