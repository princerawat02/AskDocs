import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/Input";
import { loginUser } from "../services/auth.api";

export function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginUser(form);
      navigate("/app");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <CardHeader className="px-0 pt-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
          Welcome back
        </p>
        <CardTitle className="mt-3 text-2xl">Continue your reading</CardTitle>
        <CardDescription>
          Pick up where you left off with your documents.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            size="lg"
            type="submit"
            disabled={loading}
            className="mt-2 w-full"
          >
            <span>{loading ? "Logging in..." : "Log in"}</span>
            <ArrowRight />
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardContent>
    </AuthShell>
  );
}

function AuthShell({ children }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2.5 text-foreground">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles size={17} />
          </span>
          <span className="text-lg font-semibold tracking-tight">ChatPDF</span>
        </div>
        <Card className="border-border/70 bg-card/90 shadow-2xl shadow-black/20">
          <div className="p-7 sm:p-9">{children}</div>
        </Card>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Private by design · Your documents stay yours
        </p>
      </div>
    </main>
  );
}
