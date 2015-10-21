/**
 * Created by stu on 10/6/15.
 */
describe( "User Service Tests", function() {

    var httpBackend;
    var itemService;
    var userService;
    var httpService;
    var qService;

    var accessToken = "testToken";
    var userId = "testId";
    var email = "testemail@test.com";
    var userName = "Mr. Test";
    var tokenExpiration = 123123131;

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
        });
    });

    it( "Sets the user info", function() {
        var credentials = {};
        credentials.username = email;
        credentials.password = "password";
        userService.loginUser(credentials);
        userService.setUserInfo( accessToken, userId, email, userName, tokenExpiration );
        httpBackend.flush();
    })
});