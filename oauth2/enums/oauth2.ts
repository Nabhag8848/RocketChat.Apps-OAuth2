export enum OAuth2Locator {
    authUri = "https://api.notion.com/v1/oauth/authorize?owner=user&response_type=code&",
    accessTokenUri = "https://api.notion.com/v1/oauth/token",
    refreshTokenUri = "https://api.notion.com/v1/oauth/token",
    redirectUrlPath = "/api/apps/public/9ec4b2d8-ae1e-4c7b-88d1-3d10aa20c18d/webhook",
}

export enum OAuth2Content {
    success = '<div style="display: flex;align-items: center;justify-content: center; height: 100%;">\
                        <h1 style="text-align: center; font-family: Helvetica Neue;">\
                            Authorization went successfully<br>\
                            You can close this tab now<br>\
                        </h1>\
              </div>',
    failed = '<div style="display: flex;align-items: center;justify-content: center; height: 100%;">\
                    <h1 style="text-align: center; font-family: Helvetica Neue;">\
                        Oops, something went wrong, please try again or in case it still does not work, contact the administrator.\
                    </h1>\
             </div>',
}
