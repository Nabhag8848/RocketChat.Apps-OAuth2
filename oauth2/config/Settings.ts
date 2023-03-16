import { ISetting } from "@rocket.chat/apps-engine/definition/settings";
// import { OAuth2Setting } from "../enums/oauth2";
import { SettingType } from "@rocket.chat/apps-engine/definition/settings";

export enum OAuth2Setting {
    CLIENT_ID = "notion-client-id",
    CLIENT_SECRET = "notion-client-secret",
    REDIRECT_URI = "redirect-uri",
}
export const settings: Array<ISetting> = [
    {
        id: OAuth2Setting.CLIENT_ID,
        type: SettingType.STRING,
        packageValue: "",
        required: true,
        public: false,
        section: "Authorization Credentials",
        i18nLabel: "notion-client-id",
        i18nPlaceholder: "paste your clientid",
    },
    {
        id: OAuth2Setting.CLIENT_SECRET,
        type: SettingType.STRING,
        packageValue: "",
        required: true,
        public: false,
        section: "Authorization Credentials",
        i18nLabel: "notion-client-secret",
        i18nPlaceholder: "paste your secret",
    },
    {
        id: OAuth2Setting.REDIRECT_URI,
        type: SettingType.STRING,
        packageValue: "",
        required: true,
        public: false,
        section: "Authorization Credentials",
        i18nLabel: "redirect-uri",
        i18nPlaceholder: "paste your redirect-uri",
    },
];
