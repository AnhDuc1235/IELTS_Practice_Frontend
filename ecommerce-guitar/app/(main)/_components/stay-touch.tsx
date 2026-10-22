"use client";

import * as React from "react";

export default function StayInTouch() {
  const [email, setEmail] = React.useState("");
  const hasInput = email.trim().length > 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasInput) {
      return;
    }

    alert("Subcribe complete, we will reach out to you soon.");
    setEmail("");
  };

  return (
    <section className="mx-auto max-w-[1180px] px-4 pb-10 pt-12 text-black">
      <div className="text-center">
        <h2 className="text-[26px] font-semibold leading-tight text-black">Stay In Touch</h2>
        <p className="mx-auto mt-2 max-w-[640px] text-[12px] leading-5 text-black">
          Sign up for our newsletter to receive customized product news, updates and special invites
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-4 flex w-full max-w-[620px] flex-col gap-2 sm:flex-row">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="your@address.com"
          className="h-20 flex-1 border border-[#dddddd] bg-[#f8f8f8] px-4 text-[18px] text-[#666] outline-none transition-colors focus:border-[#b7b7b7] sm:h-11 sm:text-[14px]"
        />
        <button
          type="submit"
          className={`h-11 cursor-pointer border px-5 text-[12px] font-semibold uppercase tracking-[0.06em] transition-colors sm:h-11 ${
            hasInput
              ? "border-[#bb9b69] bg-[#bb9b69] text-black hover:bg-[#b19364]"
              : "border-[#cfcfcf] bg-[#efefef] text-[#8f8f8f] hover:bg-[#e5e5e5]"
          }`}
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}
