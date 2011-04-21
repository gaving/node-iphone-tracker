# node iphone tracker

***Note: This will send all your location information to google!***

This tool plots your iPhone location database on google maps. Only displays the
latest 50 or so for now.

## Installation

- Find your location database from somewhere under ~/Library/Application Support/MobileSync/Backup/
- Name it 'location.db' and copy it under this directory
- Run npm bundle
- Run node server.js
- Open http://localhost:8000/ and hopefully see your data displayed

## Screenshot

![map](https://github.com/gaving/node-iphone-tracker/raw/master/site/1.png)

## Resources

Obvious inspiration from iPhoneTracker[1]

[1]: https://github.com/petewarden/iPhoneTracker "iPhoneTracker"
