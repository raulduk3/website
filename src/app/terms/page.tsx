import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage, LegalSection } from "../legal-page";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms for the Fable Trader conversational messaging program.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms and Conditions">
      <p>
        These terms govern participation in the Fable Trader conversational
        text-messaging program, operated by Richard Alvarez as a sole
        proprietor.
      </p>

      <LegalSection title="Program description">
        <p>
          Fable Trader is an experimental interface to an automated Alpaca
          paper-trading system. Messages may include conversational replies,
          paper-portfolio summaries, explanations of simulated decisions,
          system-health updates, and operational or risk alerts. Messages may
          appear in an approved private Group MMS conversation.
        </p>
      </LegalSection>

      <LegalSection title="Consent and message frequency">
        <p>
          You opt in by texting START to the Fable Trader number after receiving
          it directly from the operator, or through another clearly documented
          consent process. Each group participant must consent individually. By
          opting in, you agree to receive recurring conversational and
          informational text messages from Fable Trader. Message frequency
          varies according to your interactions and relevant system events.
          Message and data rates may apply. Consent is not a condition of
          purchase.
        </p>
      </LegalSection>

      <LegalSection title="Opt-out and help">
        <p>
          Text STOP at any time to stop receiving messages. Text HELP for
          assistance or email rawalvarez731@gmail.com. After opting out, you may
          receive one final confirmation message. You must opt in again before
          receiving additional Fable Trader messages.
        </p>
      </LegalSection>

      <LegalSection title="Paper trading and financial disclaimer">
        <p>
          Fable Trader currently reports experimental paper-trading activity
          only. Its messages are for informational and research purposes and are
          not financial, investment, tax, or legal advice. A chat message cannot
          authorize, place, cancel, or modify a trade or change the
          system&apos;s risk controls. Do not rely on this service for
          emergency, time-sensitive, or real-money trading decisions.
        </p>
      </LegalSection>

      <LegalSection title="Availability and delivery">
        <p>
          Message delivery and response times are not guaranteed. Wireless
          carriers are not liable for delayed or undelivered messages. The
          program may be changed, suspended, or ended at any time, including for
          maintenance, security, compliance, or carrier requirements.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>
          Do not use the program to send unlawful, abusive, deceptive,
          confidential, or malicious content. Messages from participants are
          treated as untrusted conversational input and do not override Fable
          Trader&apos;s operating boundaries.
        </p>
      </LegalSection>

      <LegalSection title="Privacy and changes">
        <p>
          Use of the program is also governed by the{" "}
          <Link
            href="/privacy"
            className="font-medium text-orange hover:text-white"
          >
            Privacy Policy
          </Link>
          . These terms may be updated when the service or legal requirements
          change. The updated date above identifies the current version.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>Questions can be sent to rawalvarez731@gmail.com.</p>
      </LegalSection>
    </LegalPage>
  );
}
