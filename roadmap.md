BETTIES.APP TODO
v1.0
- idk MVP?

v2.2
"golf and pga support"
- i take care
- notifications
- docker container to run the scrapers and scorekeepers for the pga tour
  - right now scripts are in python i am willing to let this be changed if someone wants to use another language (deadline 6/9)

v3.0
"social features"
- friends feature
- new login workflow (2 hours)
  - 3 screens 
  - identification, then password & confirm password
  - display name and pic pfp
- live odd bets (2 days)
  - change perccent filled to be porportional
- QR code invites (encoder)
   - build this as a component and modal
- public/private bets
  - private bets to groups still
- username & display only available via public_users
- new dynamic routing
- improve session management

UI 
hide the form/idea better 
abstract from the user

implementaion details

/bets (1 week)
new bet creator at the top
percentage based tickers? indicators
click 100, 20, 5, 1 and add that to the wager
maybe an custom amount option make a modal

/history (???)
better ui and cooler features
incluyding dollar value over time or balance history over time
include stimmys (influx of cash) 
use a graphing library

/balance (2 hours)
make it look better (ingeneral)
request money
give money
add money

/social (1 week)
new searrch feauture 
migrate path to search
instructions for various pages

/create-group (4 days) *for all dynamism stuff
might get deprecated move to dynamic group route

/groups *
/groups/[id] use encode decode function

bookkeeping
newbets will be managed form tyhe bets tab and bets will be managed based on dynamic routing such as
/bets/[id] use our encdec

/profile 
have a friends sidebar/menu
accept/reject requests

notifications schema (1 week)
type char? byte? 256 options
-> map to a message
amount, otherUser
amount is null for friend/join requests
move commisioner requests into this
src, dst, amount, type 
can make effienct but dont preoptimize
backups and logs up into free dynamodb 25GB

alone - v3.0 = (~1 month)

v4.0
"infra"
 - logging aws DDB
 - verfied judges/verfied sources
 - caching
FIXES 
- fix login workflow expeditously --fixed issues

use branches based on features
search
- i wanna use rust for this 
- host some api
- build with rust
- dockerize
