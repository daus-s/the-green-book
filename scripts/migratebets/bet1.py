from bet2 import Bet2
from sb import SupabaseFactory

sb = SupabaseFactory().produce()

def idcom(cid):
    return sb.rpc('idcom', {'cid': cid}).execute().data

def parse_options(pairs, winner=""):
    if not isinstance(pairs, dict):
        return
    ls = []
    for key, _ in pairs.items():
        ls.append((key, key==winner))

    for i in range(len(ls)):
        ls[i] = (ls[i][0], ls[i][1], i)

    print(ls)
    return ls
    
def paparazi(public, group):
    if public:
        return ((group is not None), )
    else:
        return (group is None, )

class Bet1:
    def convert(self):
        bet1 = {}
        bet1['id'] = self._betID
        bet1['content'] = self._title
        bet1['creator'] = idcom(self._commissionerID)
        bet1['public'] = self._public
        bet1['open'] = self._open
        bet1['g'] = self._group
        bet1['line'] = self._line

    
        ops1 = self.options
        wgr1 = self.wagers
        return Bet2((bet1, ops1, wgr1))

    def __init__(self, json: dict):
        # deobjectify here
        self._betID = json['betID']
        self._title = json['title']
        self._open = json['open']
        self._public = json['public']
        self._group = json['groupID']
        self._commissionerID = json['commissionerID']

        _ = json['description']
        _ = json['mode']

        self._creation_time = json['creationtime']
        self._line = json['line']

        self.options = parse_options(json['odds'], winner=json['winner'])
        self.wagers = json['user_bets']

        if not paparazi(self._public, self._group):
            if self._public:
                message = "public truthy contradicts with the non-None group value"
            if self._group:
                message = "public falsy contradicts with the None group value"
            raise ValueError(message)
        pass