import Link from 'next/link';

export function Footer(){
    return( 
        <footer className="mx-auto mt-auto min-h-8 py-3">
          <p className="text-center">by <Link href="https://andrecrjr.github.io/" className="underline underline-offset-2">Acjunior</Link></p>
          <p>User data from{' '} 
            <Link href={'https://developer.valvesoftware.com/wiki/Steam_Web_API'} className="underline underline-offset-2">Steam Web API</Link> and Game Data from{' '}
            <Link href="https://steamspy.com/" className="underline underline-offset-2">Steam Spy</Link>
          </p>
        </footer>
    );
}