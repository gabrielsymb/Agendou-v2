import { SignInPrestador } from '../domain/use-cases/SignInPrestador';

async function main(){
  const email = process.argv[2];
  const senha = process.argv[3];
  if(!email || !senha){
    console.error('Usage: ts-node src/backend/scripts/test-login.ts <email> <senha>');
    process.exit(1);
  }

  const signIn = new SignInPrestador();
  try{
    const p = await signIn.execute({ email, senha });
    console.log('SignIn successful:', p);
  }catch(err:any){
    console.error('SignIn failed:', err && (err.message || err));
    process.exit(2);
  }
}

main().catch(e=>{ console.error(e); process.exit(1); });
