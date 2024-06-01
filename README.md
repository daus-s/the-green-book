## theGreenBook
Daus Carmichael
#### betties.app

the-green-book is a web app that allows users to place bets with their friends like I would do in college with my roommates and friends. So here's to that little dumb and degenerate tradition! Cheers!
:beer:
### Abstract
theGreenBook, a social betting app paying homage to its humble beginnings as a green notebook shared by some friends

### Roadmap
[Roadmap](https://docs.google.com/spreadsheets/d/1FkLNLL6TE3griz7laY9ZOvyikTCCjG0tEmEv5Vk-EUA/edit#gid=0)

### Developers
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
#### Wanna see how big the project is?
`find . -path './node_modules' -prune -o -path './supabase' -prune -o -path './public' -prune -o -path './.git' -prune -o -path './scripts/.mypy_cache' -prune -o -path './scripts/pga/venv/*' -prune -o -path './.next/*' -prune -o -path './package-lock.json' -prune -o -path './.DS_Store-type' -prune -o -type f -print | xargs wc | awk 'END {print $1}'
`
