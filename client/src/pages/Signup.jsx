import { ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
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
import { signupUser } from "../services/auth.api";

export function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signupUser({ email: form.email, password: form.password });
      navigate("/app");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

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
          <div className="p-7 sm:p-9">
            <CardHeader className="px-0 pt-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                Get started
              </p>
              <CardTitle className="mt-3 text-2xl">
                Make reading feel lighter
              </CardTitle>
              <CardDescription>
                Create a private workspace for the documents you want to
                understand.
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
                <label className="grid gap-2 text-sm font-medium text-foreground">
                  <span>Password</span>
                  <span className="relative">
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={form.password}
                      onChange={(event) =>
                        setForm({ ...form, password: event.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </span>
                </label>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button
                  size="lg"
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full"
                >
                  <span>
                    {loading ? "Creating account..." : "Create account"}
                  </span>
                  <ArrowRight />
                </Button>
              </form>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Log in
                </Link>
              </p>
            </CardContent>
          </div>
        </Card>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Private by design · Your documents stay yours
        </p>
      </div>
    </main>
  );
}
