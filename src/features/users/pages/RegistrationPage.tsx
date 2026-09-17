import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { Navigate } from 'react-router-dom';
import Button from '../../../components/Button';
import { useAuth } from '../AuthContext';

export default function RegisterPage() {
  const { user, isLoading, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading || isSubmitting) return;

    setFormError(null);

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ email: email.trim(), password });
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to register.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoading && user) {
    return <Navigate to="/ingredients" replace />;
  }

  return (
    <main className="mx-auto w-full max-w-md p-6">
      <h1 className="mb-6 text-3xl font-semibold">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block-mb-1">
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
            autoComplete="new-password"
            required
            minLength={15}
            maxLength={128}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-border p-2"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block mb-1">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-border p-2"
          />
        </div>

        {formError && (
          <p role="alert" className="text-red-700">
            {formError}
          </p>
        )}

        <Button type="submit" disabled={isLoading || isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
    </main>
  );
}
