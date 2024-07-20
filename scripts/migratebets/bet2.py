from sb import SupabaseFactory
sb = SupabaseFactory().produce()

def publicize(uuid):
    return sb.rpc('publicize', {'u': uuid}).execute().data

def content2id(options=[], content=''):
    for o in options:
        print(o)
        if o[0] == content:
            return o[2]
    return None

class Bet2:
    def __init__(self, bet_tuple):
        if not isinstance(bet_tuple, tuple) or \
           not len (bet_tuple) == 3 or \
           not isinstance(bet_tuple[0], dict) or \
           not isinstance(bet_tuple[1], list) or \
           not isinstance(bet_tuple[2], list):
            # were not good
            message = f'malformed bet tuple:\n'
            if not isinstance(bet_tuple, tuple):
                message += f'  • bet_tuple: \n\tExpected: tuple \n\tReceived {type(bet_tuple)}'
            elif len(bet_tuple) != 3:
                message += f'  • bet_tuple: \n\tExpected: length 3 \n\tReceived: length {len(bet_tuple)}'
            else:
                if not isinstance(bet_tuple[0], dict):
                    message += f'  • bet_tuple[0] = bet:\n\tExpected: dict\n\tReceived: {type(bet_tuple[0])}\n'
                if not isinstance(bet_tuple[1], list):
                    message += f'  • bet_tuple[1] = options:\n\tExpected: list\n\tReceived: {type(bet_tuple[1])}\n'
                if not isinstance(bet_tuple[2], list):
                    message += f'  • bet_tuple[2] = wagers\n\tExpected: list\n\tReceived: {type(bet_tuple[2])}\n'
            raise TypeError(message)
        
        self.bet = bet_tuple[0]
        self.options = bet_tuple[1]
        self.wagers = bet_tuple[2]
        
    def write_bet(self, b):
        sb.table("bets2").insert(b).execute()

    def write_opt(self, o):
        option = {'bid':  self.bet['id'], 'winner': o[1], 'oid': o[2], 'content': o[0]}
        sb.table("options").insert(option).execute()

    def write_wgr(self, w):
        print(w)
        wager = {'bid':  self.bet['id'], 'uid': publicize(w['userID']), 'oid': content2id(self.options, w['outcome']), 'amount': w['amount']}
        print(wager)
        sb.table("wagers").insert(wager).execute()
        
    def write(self):
        self.write_bet(self.bet)
        [self.write_opt(o) for o in self.options]
        [self.write_wgr(w) for w in self.wagers] 


    