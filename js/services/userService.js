/**
 * Copyright 2015-2016 Stuart Smith
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version. Or under the the Eclipse Public License v1.0
 * as published by the Eclipse Foundation or (per the licensee's choosing)
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * If you modify this Program, or any covered work, by linking or combining
 * it with the paho MQTT client library (or a modified version of that library),
 * containing parts covered by the terms of EPL,
 * the licensors of this Program grant you additional permission to convey the resulting work.
 */

var userService = angular.module("userModule",["ng","itemModule"]);

/**
 * This class handles two main aspects of a user:
 *   - logging in and authentication
 *   - retrieval of the users items
 */
userService.service("$user",["$http", "$q", "$itemService", function($http, $q, $itemService) {

    /**
     * This will likely be the most frequently used method of this class.
     * It handles checking if the user is already logged in,
     * if the login data has been cached in session storage, and
     * triggers the initialization of user items, if necessary.
     *
     * @returns {*}
     */
    this.getCurrentUser = function() {
        //TODO: Validate token, otherwise user will just get a random popup that tells them
        //that they should logout and login again

        /** If the user info isn't already populated, check
         * to see if they're already logging in, and, if not,
         * check session storage for the information, and if not there,
         * they're not logged in anymore. **/
        if( typeof this.userInfo === "undefined" ) {
            if( typeof this.userInfoPromise !== "undefined" ) {
                return this.userInfoPromise.promise;
            }
            this.userInfo = {};
            this.userInfoPromise = $q.defer();
            this.userInfo.access_token = window.sessionStorage.getItem("access_token");
            this.userInfo.token_expiration = window.sessionStorage.getItem("expires_in");
            this.userInfo.apiLocation = apiLocation;
            if( !this.isValidToken() ) {
                this.logout();
                return undefined;
            }
            this.userInfo.user_id = window.sessionStorage.getItem("user_id");
            this.userInfo.user_email = window.sessionStorage.getItem("user_email");
            this.userInfo.user_name = window.sessionStorage.getItem("user_name");

            //check to make sure the session storage had valid values
            if( typeof this.userInfo.access_token !== "undefined" &&
                this.userInfo.access_token != null &&
                typeof this.userInfo.user_name !== "undefined" &&
                this.userInfo.user_name != null ) {

                this.setUserInfo(this.userInfo.access_token, this.userInfo.user_id,
                    this.userInfo.user_email, this.userInfo.user_name, this.userInfo.token_expiration);
                return this.userInfoPromise.promise;
            } else {
                this.logout();
                return undefined;
            }
        } else {
            this.setUserInfo(this.userInfo.access_token, this.userInfo.user_id,
                this.userInfo.user_email, this.userInfo.user_name, this.userInfo.token_expiration);
            return this.userInfoPromise.promise;
        }
    };

    this.base64urlDecode  = function(str) {
        return atob(str.replace(/\-/g, '+').replace(/_/g, '/'));
    };

    this.setPreview = function( data ) {
        this.userInfo.previewCache[data.itemLocation] = data.response.data;
    };

    this.setItemData = function( data ) {
        this.userInfo.itemCache[data.itemLocation] = data.response.data;
    };

    this.handleItemListResolve = function( itemList ) {
        this.userInfo.itemList = itemList;
        for( var itemIndex in this.userInfo.itemList ) {
            if( !this.userInfo.itemList.hasOwnProperty(itemIndex) ) {
                continue;
            }
            var item = this.userInfo.itemList[itemIndex];
            if( typeof item.previewLocation !== "undefined" ) {
                this.userInfo.previewCache[item.previewLocation.fullPath] = "loading";
                //As far as I can see, previews will be loaded via an href,
                //and hrefs need base64 for authenticated data urls
                console.log()
                $itemService.getItem(
                    this.userInfo.access_token,
                    this.userInfo.itemList[itemIndex].previewLocation.fullPath,
                    "base64"
                ).then(
                    this.setPreview.bind(this)
                )
            }
            this.userInfo.itemCache[item.preferredLocation.fullPath] = "loading";
            $itemService.getItem(
                this.userInfo.access_token,
                item.preferredLocation.fullPath,
                "base64"
            ).then(
                this.setItemData.bind(this)
            )
        }
        this.userInfoPromise.resolve(this.userInfo);
    };

    this.handleItemListReject = function( msg ) {
        this.logout();
        this.userInfoPromise.reject("Failed to load item list: " + msg);
    };

    this.initializeItemList = function( userEmail, userId, accessToken ) {
        if( typeof this.userInfo.itemList === "undefined" ) {
            this.userInfo.itemList = [];
            this.userInfo.previewCache = {};
            this.userInfo.itemCache = {};
            $itemService.getItemList(userEmail, userId, accessToken).then(
                this.handleItemListResolve.bind(this),
                this.handleItemListReject.bind(this)
            );
        }
    };

    this.setUserInfo = function( accessToken, userId, email, userName, tokenExpiration )
    {
        if( typeof this.userInfo === "undefined") {
            this.userInfo = {};
        }
        this.userInfo.access_token = accessToken;
        this.userInfo.user_id = userId;
        this.userInfo.user_email = email;
        this.userInfo.user_name = userName;
        this.userInfo.token_expiration = tokenExpiration;
        this.userInfo.apiServer = apiLocation;
        this.initializeItemList(
            this.userInfo.user_email,
            this.userInfo.user_id,
            this.userInfo.access_token);

        sessionStorage.setItem("access_token", this.userInfo.access_token);
        sessionStorage.setItem("expires_in", this.userInfo.token_expiration);
        sessionStorage.setItem("user_id", this.userInfo.user_id);
        sessionStorage.setItem("user_email", this.userInfo.user_email);
        sessionStorage.setItem("user_name",this.userInfo.user_name);
    };

    /**
     * This, along with getModalItem, is used to pass an item selected by the user from the share controller
     * to the modal controller.
     * @param item
     */
    this.setModalItem = function( item ) {
        this.item = item;
    };

    /**
     * This, along with setModalItem, is used to pass an item selected by the user from the share controller
     * to the modal controller.
     * @param item
     */
    this.getModalItem = function() {
        return this.item;
    };

    //while tempting to return cached user, what if we want to login a new user?
    /**
     * This handles logins that were conducted directly from the site,
     * using the back-end access_token api to handle all the oauth stuff
     * @param credentials
     * @returns {*}
     */
    this.loginUser = function(credentials) {
        this.userInfoPromise = $q.defer();
        var tokenLocation = apiLocation + "api/access_token";
        console.log("Posting to: " + tokenLocation);
        $http.post(tokenLocation, null,
            {
                headers: {
                    'Authorization': btoa(credentials.username + ":" + credentials.password)
                }
            }
        ).then(
            this.handleLoginResponse.bind(this),
            this.handleLoginReject.bind(this)
        );

        return this.userInfoPromise.promise;
    };

    this.handleLoginResponse = function( response ) {
        var data = response.data;
        var accessToken = data.accessToken;
        var userId = data.idTokenBody.sub;
        var email = data.idTokenBody.email;
        var userName = data.idTokenBody.email.split('@')[0];
        var expiration = data.expiry;

        this.setUserInfo(accessToken, userId, email, userName, expiration);
        console.log("Logged in user: " + JSON.stringify(this.userInfo));
    };

    this.handleLoginReject = function( response ) {
        var message = "User login failed due to network issue: " + JSON.stringify(response);
        this.userInfoPromise.reject( message );
        console.log(message);
    };

    /**
     * This handles the information returned from a Oauth provider,
     * when someone logs in via the provider.
     * @param accessToken
     * @param expiresIn
     * @param idToken
     */
    this.handleOauth = function( accessToken, expiresIn, idToken ) {
        this.userInfo.access_token = accessToken;
        this.userInfo.token_expiration = expiresIn;
        this.userInfo.id_token = idToken;

        window.sessionStorage.setItem("access_token", $scope.user_info.access_token);
        //might want to calculate expiration as soon as it gets back, so I can have it anchored to a time?
        //will need to be UTC, etc.
        window.sessionStorage.setItem("expires_in", $scope.user_info.token_expiration);
        /**
         * The access token (not the id_token) is what is used to authorize with google.
         * For, now delaying jwt authorization because we talk SSL to google.
         * But jsjws has been pulled in for that purpose.
         */
        var id_token_elements = this.userInfo.id_token.split('.');
        var header = this.base64urlDecode(id_token_elements[0]);
        /**This is turned into a JSON object that maps to the JWT fields in google**/
        var payload = JSON.parse(this.base64urlDecode(id_token_elements[1]));
        //do we need to escape this? Gibberish either way.. (coz binary sig)
        var signature = this.base64urlDecode(id_token_elements[2]);

        /**
         * The first three items are for debugging any jwt parsing issues
         */
        this.userInfo.id_token_header = header;
        this.userInfo.id_token_payload = payload;
        this.userInfo.id_token_signature = signature;
        this.userInfo.email = payload.email;
        this.userInfo.user_name = payload.email.split('@')[0];
        this.userInfo.user_id = payload.sub;

        this.setUserInfo(this.userInfo.access_token, this.userInfo.user_id,
            this.userInfo.email, this.userInfo.user_name, this.userInfo.token_expiration);
    };

    this.logout = function() {
        if( typeof this.userInfo !== "undefined" ) {
            this.userInfo.access_token = undefined;
            this.userInfo.user_id = undefined;
            this.userInfo.itemList = undefined;
            this.userInfo.user_name = undefined;
            this.userInfo = undefined;
        }
        window.sessionStorage.removeItem('user_id');
        window.sessionStorage.removeItem('access_token');
        window.sessionStorage.removeItem('user_email');
        window.sessionStorage.removeItem('user_name');
    };

    this.isValidToken = function() {
        return true;
    };
}]);