#TODO list

##Current top priority
- Async file upload (no more 201 page for the user)
    - started with angular-file-upload
    - filled out skeleton from: https://github.com/nervgh/angular-file-upload/wiki/Introduction
    - now I need to test & fix it & get it working with File API
    - OR!!... maybe I should be using HTML5 at this point? http://jsfiddle.net/f8Hee/1/ ?
- Public URLs ( these can be original! )
- Can I make user@password + Basic Auth work for full-sized image links? Logout should still be possible by emptying cache.
- Share with other users
- Redis
- Figure out secure path to download original (Probably just need an app)
- Token pinging in UI (smoother token expiration?)
- Grunt task to zip up directories, ready for delivery to server
   - currently just: 
        - hand copy stuff into build_dir
        - ```zip -r build_dir.zip build_dir/*``` 
- Get share-my-stuff hub controller form talking to mqtt broker via web sockets
    - Start is very basic -> you enter hub username, password, command by hand
    - At least get a drop-down of commands before integration testing.
    - move it into service w/ login integration.

##And then...
- Decide what to do about api endpoint in conf.js (for tomcat on server, empty is fine)
- Link to non-image items (either have a request without encoding, or decode - only previews are requested encoded by default)
- Figure out install - I had to make jsjws a file, not a link to get it to work
- item.name in api, so unknown items can at least have a name

#Current Notes & Caveats
##How I currently deployed
- see above
- this is not how I want to do it - I just wanted to get the code up.