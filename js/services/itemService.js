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

var itemModule = angular.module( "itemModule", ["ng"]);

var $itemService = itemModule.service( "$itemService", ["$http", "$q", function( $http, $q ) {

    this.itemListDeferred = $q.defer();

    this.setItemList = function( data, status, headers, config, statusText ) {
        if( status == 200 ) {
            this.itemList = data;
            this.itemListDeferred.resolve(this.itemList);
        } else if( status == 401 ) {
            this.itemList = undefined;
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
            console.log("Starting load of filelist");
            $http.get(apiLocation + "file_api/file/" + userEmail + "/" + userId + "/filelist",
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
        $http.get(apiLocation + "file_api/file" + itemLocation + "?encode=" + encoding, {
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
