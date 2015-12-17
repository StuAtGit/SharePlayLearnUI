/**
 * Created by stu on 8/30/15.
 *
 * TODO: load user items asynchronously in this service -
 * compose this object into the user service & begin loading the filelist after login.
 */

var itemModule = angular.module( "itemModule", ["ng"]);

var $itemService = itemModule.service( "$itemService", ["$http", "$q", function( $http, $q ) {

    this.itemListDeferred = $q.defer();

    this.setItemList = function( data, status, headers, config, statusText ) {
        if( status == 200 ) {
            this.itemList = data;
            this.itemListDeferred.resolve(this.itemList);
        } else if( status == 401 ) {
            this.itemListDeferred.reject(
                "Not authorized to access your files? Did your login expire? " +
                "(Try logging out and logging in)"
            );
        }
        else if( status != 400 ) {
            this.itemListDeferred.reject(status + " " + statusText);
        }
    };

    this.getItemList = function( userEmail, userId, accessToken ) {
        if( typeof this.itemList === "undefined" ) {
            $http.get(apiLocation + "api/file/" + userEmail + "/" + userId + "/filelist",
                {
                    headers: {'Authorization':'Bearer ' + accessToken}
                }).
                success(
                    this.setItemList.bind(this)
                ).error(
                    this.setItemList.bind(this)
                );
        } else {
                this.itemListDeferred.resolve(this.itemList);
        }
        return this.itemListDeferred.promise;
    };

    //TODO: finish off modal dialog, update tomcat web.xml with CORS options on Digital Ocean,
    //TODO: and deploy to nginx and tomcat. Might be time for salt :O.
    //TODO: Write unit/functional tests for services that
    //TODO: validate they do the right thing (once we're sure we know what that is..

    /**
     * Returns a JSON object that contains the itemLocation (echoed back),
     * and the entire response from the server. To get the data back out, use:
     * var itemData = itemResponse.response.data
     * @param accessToken
     * @param itemLocation
     * @returns {Function}
     */
    this.getItem = function( accessToken, itemLocation, encoding ) {
        if( typeof encoding === "undefined" ) {
            encoding = "base64";
        }
        var itemDataDeferred = $q.defer();
        $http.get(apiLocation + "api/file" + itemLocation + "?encode=" + encoding, {
            headers : {'Authorization' : 'Bearer ' + accessToken}
        }).then(
            function( response ) {
                var itemResponse = {};
                itemResponse.itemLocation = itemLocation;
                itemResponse.response = response;
                itemDataDeferred.resolve( itemResponse );
            }, function( response ) {
                itemDataDeferred.reject( response.status + "/" + response.statusText + " " + response.data );
            }
        );
        return itemDataDeferred.promise;
    }

}]);
