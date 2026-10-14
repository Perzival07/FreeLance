import React from "react";

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="text-center py-16 px-6 card-luxury my-10 relative overflow-hidden shadow-[0_0_60px_-20px_rgba(224,36,94,0.45)] border-ruby-500/30">
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[420px] h-[200px] bg-gold-500/20 blur-3xl rounded-full animate-float"></div>
      <div className="pointer-events-none absolute -bottom-24 right-10 w-[300px] h-[200px] bg-amethyst-500/20 blur-3xl rounded-full animate-float [animation-delay:-5s]"></div>
      <p className="eyebrow-gold text-xs mb-3">STAY IN TOUCH</p>
      <p className="font-display text-3xl sm:text-5xl text-ivory-100 relative">
        Subscribe now &amp; get exciting news and offers
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-0 mx-auto mt-8 relative bg-ink-950/60 border border-gold-500/30 focus-within:border-gold-400 transition-colors"
      >
        <input
          className="w-full sm:flex-1 outline-none bg-transparent text-ivory-100 placeholder-ivory-500 pl-4 py-3"
          type="email"
          placeholder="Enter your email"
          required
        />

        <button
          type="submit"
          className="btn-gold rounded-none px-8 py-3.5"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
