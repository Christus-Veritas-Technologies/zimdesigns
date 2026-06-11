import type { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  WhatsappIcon,
  Mail01Icon,
  MapsLocation01Icon,
} from "@hugeicons/core-free-icons";
import { ContactForm } from "./contact-form";
import { env } from "@/env";

export const metadata: Metadata = {
  title: "Contact CVT Hosts — Get Your Direct Booking System",
  description:
    "WhatsApp us directly or send an email. Tell us about your property — rooms, location, what you currently use for bookings — and we will tell you which package fits. No forms. No ticket queues. Just a straight conversation about your property.",
  alternates: {
    canonical: "https://hosts.christusveritas.tech/contact",
  },
  openGraph: {
    url: "https://hosts.christusveritas.tech/contact",
    title: "Contact CVT Hosts",
    description:
      "No forms. No ticket queues. WhatsApp us directly and we will get back to you within a few hours. One conversation is all it takes to get started.",
  },
};

export default function ContactPage() {
  const whatsappNumber = env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <main>
      <section className="pt-24 pb-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {/* Left column */}
            <div className="flex flex-col gap-8">
              <div>
                <p
                  className="font-heading font-normal text-muted uppercase tracking-[0.2em] mb-4"
                  style={{ fontSize: "11px" }}
                >
                  Get In Touch
                </p>
                <h1
                  className="font-heading font-bold text-foreground leading-tight"
                  style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}
                >
                  Let&apos;s talk about
                  <br />
                  your property.
                </h1>
                <p className="font-body text-[17px] text-muted mt-5 leading-relaxed">
                  Tell us your rooms, your current booking setup, and what you
                  are trying to achieve. We will tell you exactly which package
                  fits and what to expect.
                </p>
              </div>

              {/* Contact methods */}
              <div className="flex flex-col gap-4">
                <Link
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-xl border transition-colors group"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div
                    className="flex-shrink-0 size-11 rounded-xl flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: "rgba(201,168,76,0.1)" }}
                  >
                    <HugeiconsIcon
                      icon={WhatsappIcon}
                      size={22}
                      strokeWidth={1.5}
                      primaryColor="var(--accent)"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="font-heading font-bold text-sm text-foreground group-hover:text-accent transition-colors">
                      WhatsApp — Fastest Response
                    </p>
                    <p className="font-body text-sm text-muted">
                      +{whatsappNumber.replace(/(\d{2})(\d{2})(\d{3})(\d{4})/, "$1 $2 $3 $4")}
                    </p>
                    <p className="font-body text-xs text-muted mt-1">
                      Typical reply within 2–4 hours during business hours
                    </p>
                  </div>
                </Link>

                <Link
                  href="mailto:hello@christusveritas.tech"
                  className="flex items-start gap-4 p-5 rounded-xl border transition-colors group"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div
                    className="flex-shrink-0 size-11 rounded-xl flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: "rgba(201,168,76,0.1)" }}
                  >
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      size={22}
                      strokeWidth={1.5}
                      primaryColor="var(--accent)"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="font-heading font-bold text-sm text-foreground group-hover:text-accent transition-colors">
                      Email
                    </p>
                    <p className="font-body text-sm text-muted">
                      hello@christusveritas.tech
                    </p>
                    <p className="font-body text-xs text-muted mt-1">
                      For detailed enquiries or if you prefer writing
                    </p>
                  </div>
                </Link>

                <div
                  className="flex items-start gap-4 p-5 rounded-xl border"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div
                    className="flex-shrink-0 size-11 rounded-xl flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: "rgba(201,168,76,0.1)" }}
                  >
                    <HugeiconsIcon
                      icon={MapsLocation01Icon}
                      size={22}
                      strokeWidth={1.5}
                      primaryColor="var(--accent)"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="font-heading font-bold text-sm text-foreground">
                      Based in South Africa
                    </p>
                    <p className="font-body text-sm text-muted">
                      Serving properties nationwide
                    </p>
                    <p className="font-body text-xs text-muted mt-1">
                      SAST (UTC+2) business hours: Mon–Fri, 8am–6pm
                    </p>
                  </div>
                </div>
              </div>

              {/* What to expect */}
              <div
                className="rounded-xl p-6 flex flex-col gap-4"
                style={{ backgroundColor: "var(--bg-subtle)" }}
              >
                <p
                  className="font-heading font-bold text-muted uppercase tracking-widest"
                  style={{ fontSize: "10px" }}
                >
                  What to expect
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    "We reply within 2–4 business hours on WhatsApp",
                    "No sales pitch — just an honest conversation about your property",
                    "We tell you which package fits before you commit to anything",
                    "If we are not the right fit, we will say so",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span
                        className="flex-shrink-0 mt-[5px] size-1.5 rounded-full"
                        style={{ backgroundColor: "var(--accent)" }}
                        aria-hidden="true"
                      />
                      <span className="font-body text-sm text-muted leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right column — form */}
            <div
              className="rounded-2xl border p-7"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border)",
              }}
            >
              <h2 className="font-heading font-bold text-lg text-foreground mb-6">
                Tell us about your property
              </h2>
              <ContactForm whatsappNumber={whatsappNumber} />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom note */}
      <section className="pb-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <div
            className="rounded-xl px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ backgroundColor: "var(--bg-subtle)" }}
          >
            <p className="font-body text-sm text-muted text-center md:text-left">
              Not ready to get in touch yet? Browse our packages or see how CVT
              Hosts compares to Booking.com.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/packages"
                className="font-heading font-medium text-sm text-foreground hover:text-accent transition-colors underline underline-offset-2"
              >
                View packages
              </Link>
              <span className="text-muted" aria-hidden="true">
                ·
              </span>
              <Link
                href="/compare"
                className="font-heading font-medium text-sm text-foreground hover:text-accent transition-colors underline underline-offset-2"
              >
                Compare vs Booking.com
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
