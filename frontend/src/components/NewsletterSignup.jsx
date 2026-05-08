import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { SparkleIcon } from "./Icons";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    showToast("Welcome to the ZentoMart inner circle ✨", "success");
    setEmail("");
  };

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy to-charcoal text-cream p-10 md:p-16 text-center">
        {/* Decorative gradient blobs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-rosegold/30 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-rosegold/20 blur-3xl" />

        <div className="relative">
          <SparkleIcon className="w-8 h-8 text-rosegold mx-auto mb-4" />
          <h2 className="font-serif text-3xl md:text-5xl mb-3 leading-tight">
            Join the Inner Circle
          </h2>
          <p className="text-cream/80 max-w-xl mx-auto mb-8 text-sm md:text-base">
            Be the first to receive private collection invitations, atelier stories,
            and 10% off your first order.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row max-w-md mx-auto gap-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-5 py-3.5 rounded-full text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-rosegold"
            />
            <button
              type="submit"
              className="px-7 py-3.5 rounded-full bg-rosegold hover:bg-rosegold-dark transition text-white text-sm font-medium tracking-wide"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
