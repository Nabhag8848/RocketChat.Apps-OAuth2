export interface ITokenInfo {
    access_token: string;
    token_type: string;
    bot_id: string;
    workspace_name: string;
    workspace_icon: string;
    workspace_id: string;
    owner: any; // make the type of this later
    duplicated_template_id: string | null;
}
