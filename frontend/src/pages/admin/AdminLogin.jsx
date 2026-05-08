import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { SparkleIcon } from "../../components/Icons";

const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await login(email, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    showToast("Welcome back to ZentoMart Admin", "success");
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-navy via-navy to-charcoal text-cream relative overflow-hidden">
        <div className="absolute -top-40 -left-20 w-96 h-96 rounded-full bg-rosegold/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-rosegold/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" aria-label="ZentoMart home" className="inline-block">
            <div className="h-16 w-16 rounded-full overflow-hidden">
              <img
                src="/logo.jpeg"
                alt="ZentoMart"
                className="h-full w-full object-cover scale-110 mix-blend-multiply"
              />
            </div>
          </Link>

          <div>
            <SparkleIcon className="w-10 h-10 text-rosegold mb-6" />
            <h2 className="font-serif text-5xl leading-tight mb-4">
              Welcome to your <span className="italic text-rosegold">atelier.</span>
            </h2>
            <p className="text-cream/70 max-w-md">
              The control center for everything ZentoMart — orders, inventory,
              customers, and the stories behind every stitch.
            </p>
          </div>

          <p className="text-xs text-cream/40">
            © {new Date().getFullYear()} ZentoMart Inc. — Designed in Paris, made in Italy.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link to="/" aria-label="ZentoMart home" className="lg:hidden mb-8 inline-block">
            <div className="h-14 w-14 rounded-full overflow-hidden">
              <img
                src="/logo.jpeg"
                alt="ZentoMart"
                className="h-full w-full object-cover scale-110 mix-blend-multiply"
              />
            </div>
          </Link>

          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-rosegold mb-2">Admin Sign In</p>
            <h1 className="font-serif text-4xl text-navy">Back to your bag.</h1>
            <p className="text-charcoal/60 text-sm mt-2">
              Sign in to manage products, orders, and the rest of your store.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="block text-xs uppercase tracking-widest text-charcoal/60 mb-2">
                Email Address
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@zentomart.com"
                className="input"
              />
            </label>

            <label className="block">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-widest text-charcoal/60">
                  Password
                </span>
                <button type="button" className="text-xs text-rosegold hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-rosegold hover:underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-sm text-charcoal/70">
              <input type="checkbox" className="w-4 h-4 accent-rosegold rounded" />
              Keep me signed in
            </label>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-full bg-rosegold hover:bg-rosegold-dark text-white font-medium tracking-wide transition shadow-luxury disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign In to Admin"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-charcoal/50">
            Not an admin? <Link to="/" className="text-rosegold hover:underline">Back to storefront</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
