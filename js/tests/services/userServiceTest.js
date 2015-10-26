/**
 * Created by stu on 10/6/15.
 */
describe( "User Service Tests", function() {

    var httpBackend;
    var itemService;
    var userService;
    var httpService;
    var qService;

    var email = "testemail@test.com";
    var authResponseObj = {
            accessToken:"ya29.GALcX-ju1e5xdyfVg1yaDYVq8bmLYIWSxkSqPBITyx_xW8Um33sGsVddk8dmLbiPub2M",
            expiry:"3599",
            idToken:"eyJhbGciOiJSUzI1NiIsImtpZCI6ImFlMzg2N2VkMDI0ZTEwOWE5YTUxNTBmMGRkOTU2OTI0YWRiZmJlNjYifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXRfaGFzaCI6InFtWkdMM2VHU1JrRlkzMy1BNHI2M1EiLCJhdWQiOiI3MjY4Mzc4NjUzNTctdHFzMjB1Nmx1cWM5b2F2MWJwM3ZiOG5kZ2F2am5ya2YuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDMyMzA0Mjc2NDM0OTE2Nzk4NzgiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXpwIjoiNzI2ODM3ODY1MzU3LXRxczIwdTZsdXFjOW9hdjFicDN2YjhuZGdhdmpucmtmLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiZW1haWwiOiJzdHUyNnRlc3RAZ21haWwuY29tIiwiaWF0IjoxNDQ1ODgwNzkyLCJleHAiOjE0NDU4ODQzOTJ9.OFuEQ2LDTbXox9frL1kogFquy7hBEuMhUzuR-YLNygqOV-iQ8oCrRW0vkyN6jZOFRREAzHzAPd-VQbLnIK0iUlNuz8KJ_qqC4bDEerq9SbkadtKgJSak96JJsYE7T5YW41VR3O7LL79S0xN9Nd9RgiNRsCcOvMfce4_f67nTgmdpcHblWjxD0Yz1O5pDiyKvbH5PETew7obMPZ42xv7xB3UWqUNvp1QJc4LmYhXM6ntr0wfzFiT2cKJOPp5D4U9junBzqIc9nBCTST-A73gocRwWVrxAVdHit563AKY5P1RMDYhv3K5bxzL6q-hS8JCmLTrUSe_Pqq2PJodU66lCDQ",
            idTokenBody:{
                iss:"accounts.google.com",
                sub:"103230427643491679878",
                azp:"726837865357-tqs20u6luqc9oav1bp3vb8ndgavjnrkf.apps.googleusercontent.com",
                email:"stu26test@gmail.com",
                at_hash:"qmZGL3eGSRkFY33-A4r63Q",
                email_verified:"true",
                aud:"726837865357-tqs20u6luqc9oav1bp3vb8ndgavjnrkf.apps.googleusercontent.com",
                iat:"1445880792",
                exp:"1445884392"
            },
            id:"103230427643491679878"
    };
    var filelistResponseObject =  [
        {
            "itemLocation": "/stu26test@gmail.com/103230427643491679878/image/pctechsupportcat.jpg",
            "previewLocation": "/stu26test@gmail.com/103230427643491679878/preview_image/pctechsupportcat.jpg",
            "type": "image",
            "attr": {
                "altText": "Preview of pctechsupportcat.jpg"
            }
        },
        {
            "itemLocation": "/stu26test@gmail.com/103230427643491679878/unknown/TestUpload.txt",
            "type": "unknown",
            "attr": {}
        }
    ];

    beforeEach( function() {
        module("ng");
        module("itemModule");
        module("userModule");

        inject(function ( $injector, _$http_, _$q_, _$itemService_, _$user_ ) {
            httpBackend = $injector.get("$httpBackend");
            httpService = _$http_;
            qService = _$q_;
            itemService = _$itemService_;
            userService = _$user_;

            var email = authResponseObj.idTokenBody.email;
            var userId = authResponseObj.idTokenBody.sub;
            httpBackend.expectPOST("api/access_token").respond( JSON.stringify(authResponseObj) );
            var filelistUrl = "api/file/" + email + "/" + userId + "/filelist";
            var fileUrl = /api\/file\/.+\/.+\/preview_image\/.+/;
            httpBackend.expectGET( filelistUrl ).respond( JSON.stringify(filelistResponseObject) );
            httpBackend.expectGET( fileUrl,  {"Accept":"application/json, text/plain, */*"} ).respond( "" );
        });
    });

    var userInfoSuccessCallback = function( done ) {
        return function( userInfo ) {
            console.log(JSON.stringify(userInfo));
            done();
        }
    };

    /** Test basically works: User info is set, but we can't verify the item list or preview cache
     * As (I think) it can still be outstanding when this finishes.
     * TODO: tests for item list & preview cache & working templates of data urls
     * TODO: but first - start on deployment for split UI/API setup
     */
    it( "Sets the user info", function(done) {
        var credentials = {};
        credentials.username = email;
        credentials.password = "password";
        userService.loginUser(credentials);
        var userInfoPromise = userService.getCurrentUser();
        if(  typeof userInfoPromise === "undefined" ) {
            console.log("User info undefined?");
            done();
        } else {
            userInfoPromise.then(
                userInfoSuccessCallback(done),
                function error( error ) {
                    console.log(error);
                    done();
                }
            );
        }
        httpBackend.flush();
    })
});