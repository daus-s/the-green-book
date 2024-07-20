from math import ceil
import sys
from bet1 import Bet1
from sb import SupabaseFactory


def show_progress(current, total):
    d = current + 1 
    percent_complete = (d / total) * 100
    if percent_complete == 100:
        sys.stdout.write(f'\rMigrating ({d}/{total}) {("." * 33)}   DONE\n')
    else:
        dots = ceil(percent_complete/3)*'.'
        spaces = (33-len(dots)) * ' '
        sys.stdout.write(f'\rMigrating ({d}/{total}) {dots}{spaces} {percent_complete:.2f}%')
        sys.stdout.flush()
     

def main(args):
    print('starting migration...')
    sb = SupabaseFactory().produce()
    print('connected to database as: ', 'GOD')
    bets = sb.table('bets').select('*, user_bets(*)', count='exact').execute().data #fun fact did u know the "*" is required
    bc = len(bets)
    for i in range(bc):
        b = Bet1(bets[i])
        c = b.convert()
        c.write()
        show_progress(i, bc)

    
    


if __name__=='__main__':
      main(sys.argv)