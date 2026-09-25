import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Button from '../../../components/Button';
import { useAuth } from '../AuthContext';

export default function LoginPage() {
  const { user, isLoading, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      await login({ email: email.trim(), password });
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to log in.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p className="p-6">Checking your session...</p>;
  }

  if (user) {
    return <Navigate to="/ingredients" replace />;
  }

  return (
    <main className="mx-auto w-full max-w-md p-6">
      <h1 className="mb-6 text-3xl font-semibold">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-border p-2"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            maxLength={128}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-border p-2"
          />
        </div>

        {formError && (
          <p role="alert" className="text-red-700">
            {formError}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-muted">
        No account?{' '}
        <Link
          to="/register"
          className="font-semibold text-primary underline hover:text-primary-hover"
        >
          Register here.
        </Link>
      </div>
    </main>
  );
}
