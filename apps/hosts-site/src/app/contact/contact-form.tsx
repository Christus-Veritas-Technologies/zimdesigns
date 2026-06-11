"use client";

import { useState, type FormEvent } from "react";

const PACKAGE_OPTIONS = [
  { value: "undecided", label: "Not sure yet — help me choose" },
  { value: "starter", label: "Starter — R7,000 once-off, R499/mo" },
  { value: "growth", label: "Growth — R15,000 once-off, R899/mo" },
  { value: "full-stack", label: "Full Stack — R30,000 once-off, R1,800/mo" },
];

interface ContactFormProps {
  whatsappNumber: string;
}

export function ContactForm({ whatsappNumber }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const phone = data.get("phone") as string;
    const propertyName = data.get("propertyName") as string;
    const propertyLocation = data.get("propertyLocation") as string;
    const roomCount = data.get("roomCount") as string;
    const packageInterest = data.get("packageInterest") as string;
    const currentSetup = data.get("currentSetup") as string;
    const message = data.get("message") as string;

    const pkgLabel =
      PACKAGE_OPTIONS.find((p) => p.value === packageInterest)?.label ??
      packageInterest;

    const lines = [
      `Hi CVT Hosts, I would like to get started.`,
      ``,
      `Name: ${name}`,
      email ? `Email: ${email}` : null,
      phone ? `Phone: ${phone}` : null,
      propertyName ? `Property: ${propertyName}` : null,
      propertyLocation ? `Location: ${propertyLocation}` : null,
      roomCount ? `Rooms: ${roomCount}` : null,
      `Package interest: ${pkgLabel}`,
      currentSetup ? `Current setup: ${currentSetup}` : null,
      message ? `Message: ${message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center gap-5 py-16">
        <div
          className="size-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(201,168,76,0.15)" }}
          aria-hidden="true"
        >
          <span
            className="font-heading font-black text-accent"
            style={{ fontSize: "28px" }}
          >
            ✓
          </span>
        </div>
        <h3 className="font-heading font-bold text-xl text-foreground">
          WhatsApp opened
        </h3>
        <p className="font-body text-sm text-muted max-w-xs leading-relaxed">
          Your message was pre-filled in WhatsApp. Send it and we will get back
          to you within a few hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="font-body text-sm text-muted hover:text-foreground underline underline-offset-2 transition-colors"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="font-heading font-bold text-xs text-foreground uppercase tracking-widest"
          style={{ fontSize: "10px" }}
        >
          Your name <span style={{ color: "var(--danger)" }}>*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Full name"
          className="w-full rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted outline-none transition-colors"
          style={{
            backgroundColor: "var(--bg-subtle)",
            border: "1px solid var(--border)",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--accent)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "var(--border)")
          }
        />
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="font-heading font-bold text-xs text-foreground uppercase tracking-widest"
            style={{ fontSize: "10px" }}
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@email.com"
            className="w-full rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted outline-none transition-colors"
            style={{
              backgroundColor: "var(--bg-subtle)",
              border: "1px solid var(--border)",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--accent)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--border)")
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="phone"
            className="font-heading font-bold text-xs text-foreground uppercase tracking-widest"
            style={{ fontSize: "10px" }}
          >
            WhatsApp / Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+27 82 000 0000"
            className="w-full rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted outline-none transition-colors"
            style={{
              backgroundColor: "var(--bg-subtle)",
              border: "1px solid var(--border)",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--accent)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--border)")
            }
          />
        </div>
      </div>

      {/* Property name + location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="propertyName"
            className="font-heading font-bold text-xs text-foreground uppercase tracking-widest"
            style={{ fontSize: "10px" }}
          >
            Property name
          </label>
          <input
            id="propertyName"
            name="propertyName"
            type="text"
            placeholder="The Hilltop Guest House"
            className="w-full rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted outline-none transition-colors"
            style={{
              backgroundColor: "var(--bg-subtle)",
              border: "1px solid var(--border)",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--accent)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--border)")
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="propertyLocation"
            className="font-heading font-bold text-xs text-foreground uppercase tracking-widest"
            style={{ fontSize: "10px" }}
          >
            City / area
          </label>
          <input
            id="propertyLocation"
            name="propertyLocation"
            type="text"
            placeholder="Johannesburg, Cape Town..."
            className="w-full rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted outline-none transition-colors"
            style={{
              backgroundColor: "var(--bg-subtle)",
              border: "1px solid var(--border)",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--accent)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--border)")
            }
          />
        </div>
      </div>

      {/* Room count + package interest */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="roomCount"
            className="font-heading font-bold text-xs text-foreground uppercase tracking-widest"
            style={{ fontSize: "10px" }}
          >
            Number of room types
          </label>
          <input
            id="roomCount"
            name="roomCount"
            type="number"
            min="1"
            placeholder="e.g. 4"
            className="w-full rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted outline-none transition-colors"
            style={{
              backgroundColor: "var(--bg-subtle)",
              border: "1px solid var(--border)",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--accent)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--border)")
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="packageInterest"
            className="font-heading font-bold text-xs text-foreground uppercase tracking-widest"
            style={{ fontSize: "10px" }}
          >
            Package interest
          </label>
          <select
            id="packageInterest"
            name="packageInterest"
            defaultValue="undecided"
            className="w-full rounded-lg px-4 py-3 font-body text-sm text-foreground outline-none transition-colors appearance-none cursor-pointer"
            style={{
              backgroundColor: "var(--bg-subtle)",
              border: "1px solid var(--border)",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--accent)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--border)")
            }
          >
            {PACKAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Current setup */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="currentSetup"
          className="font-heading font-bold text-xs text-foreground uppercase tracking-widest"
          style={{ fontSize: "10px" }}
        >
          How do guests currently book with you?
        </label>
        <input
          id="currentSetup"
          name="currentSetup"
          type="text"
          placeholder="e.g. Booking.com, phone calls, WhatsApp..."
          className="w-full rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted outline-none transition-colors"
          style={{
            backgroundColor: "var(--bg-subtle)",
            border: "1px solid var(--border)",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--accent)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "var(--border)")
          }
        />
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="message"
          className="font-heading font-bold text-xs text-foreground uppercase tracking-widest"
          style={{ fontSize: "10px" }}
        >
          Anything else <span style={{ color: "var(--danger)" }}>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Tell us anything else that is relevant — your timeline, specific requirements, questions about the packages..."
          className="w-full rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted outline-none transition-colors resize-none"
          style={{
            backgroundColor: "var(--bg-subtle)",
            border: "1px solid var(--border)",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--accent)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "var(--border)")
          }
        />
      </div>

      <button
        type="submit"
        className="w-full font-heading font-bold text-sm py-3.5 rounded-md transition-colors tracking-wide mt-1"
        style={{
          backgroundColor: "var(--accent)",
          color: "var(--text-inverse)",
        }}
      >
        Send via WhatsApp
      </button>

      <p className="font-body text-xs text-muted text-center leading-relaxed">
        This opens WhatsApp with your enquiry pre-filled. We respond within a
        few hours during business hours.
      </p>
    </form>
  );
}
