# todo before launching mobile
god mode can wait

titles of pages
formatted as
`Betties.app | <title>`

user bet history plus architecture design for updates
- viewed bool OR insert into when viewed
- cashed time for timed balance tracking 

userbet anchored table

include one for public bets 
create bet has nav when no groups
deprecate this feature when public bets exist //done

commssioner shields on all pfps
verfied for me

title width 284 px
https://css-tricks.com/viewport-sized-typography/

BRANCH GOLF

well at least we have testing

- your task is to find every location that takes tourney as an object... 
	- pretty much the entire GolfFunctions suite
- and refactor "tourney" to be a json like
const tourney = { 
		  tournament_metadata: { tournament supabase object },
		  golfers: [/*golfers via getGolfers function with new params*/],
		}
