import Link from 'next/link';
import LoginForm from './LoginForm';

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground font-headline">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{' '}
            <Link href="/" className="font-medium text-accent hover:text-accent/90">
              return to the homepage
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
