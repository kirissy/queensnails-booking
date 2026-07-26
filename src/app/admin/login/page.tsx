import { LoginForm } from "./LoginForm";

const ERROR_MESSAGES: Record<string, string> = {
  reset_link_invalid: "That reset link is invalid or has expired. Please request a new one.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return <LoginForm initialError={error ? (ERROR_MESSAGES[error] ?? null) : null} />;
}
