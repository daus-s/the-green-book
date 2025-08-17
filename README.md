# betties.app
## theGreenBook
##### Daus Carmichael

[betties.app](betties.app), formerly known as "The Green Book", is a web app that allows users to place bets with their friends. It was inspired by a tradition my roommates and teammates had: placing bets on any given event in a green scientific notebook. 

### Abstract
[betties.app](betties.app), a social betting app paying homage to its humble beginnings as a green notebook shared by some friends. Betties provides an intuitive UI wrapped around a Supabase backend with a complete security suite to ensure bets are only accessible to users who should be able to access them. Another advantage of betties.app is its ability to be asynchronous, allowing for bets to come in from across the world. It's certainly a step up from a notebook. 

For more information on current development, reach out to me! I'm currently working on an app version and a new backend server!

### Roadmap
[Roadmap](https://docs.google.com/spreadsheets/d/1FkLNLL6TE3griz7laY9ZOvyikTCCjG0tEmEv5Vk-EUA/edit#gid=0)

#### Dependencies
- `node` install via [brew install node](https://formulae.brew.sh/formula/node) on macOS

Instructions to run locally
```
  usr$ git clone git@github.com:daus-s/the-green-book.git
  ...
  usr$ cd the-green-book
  # FIRST TIME
  npm install

  #BUILDS
  npm run build #this is for production
  npm run start #this is for development and runs
```

If you run build, proceed and run
```
  serve -s build #this runs
```

