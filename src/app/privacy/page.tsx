import type { Metadata } from "next";

import { LegalPage, LegalSection } from "../legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for the Fable Trader conversational messaging program.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        Richard Alvarez operates Fable Trader as a sole proprietor. This policy
        explains how the Fable Trader conversational text-messaging program
        collects, uses, and protects your information.
      </p>

      <LegalSection title="Information we collect">
        <p>
          We may collect your mobile number, display name, consent status and
          timestamp, messages you exchange with Fable Trader, delivery
          information, and basic system logs needed to operate and secure the
          service. This website may also collect limited, aggregate usage
          information through Vercel Analytics.
        </p>
      </LegalSection>

      <LegalSection title="How we use information">
        <p>
          We use this information to deliver and respond to messages, provide
          requested Alpaca paper-portfolio and system-status information, send
          operational or risk alerts, maintain conversation continuity, prevent
          abuse, troubleshoot delivery, and comply with applicable carrier and
          legal requirements.
        </p>
      </LegalSection>

      <LegalSection title="Mobile information and sharing">
        <p>
          We do not sell, rent, or share mobile numbers, SMS opt-in data, or
          consent records with third parties or affiliates for marketing or
          promotional purposes. Mobile information may be disclosed only to
          messaging carriers, aggregators, Twilio, hosting providers, and other
          service providers as necessary to operate and deliver the messaging
          program, or when required by law. Text-messaging originator opt-in
          data and consent will not be shared with third parties for their own
          purposes.
        </p>
      </LegalSection>

      <LegalSection title="Messaging disclosures">
        <p>
          Message frequency varies based on your conversations and relevant
          system events. Message and data rates may apply. Consent to receive
          messages is not a condition of purchase. You may text STOP at any time
          to stop receiving messages or HELP for assistance.
        </p>
      </LegalSection>

      <LegalSection title="Retention and security">
        <p>
          We retain messaging and consent records only as long as reasonably
          necessary to operate the program, maintain security and audit history,
          resolve disputes, and meet legal or carrier requirements. We use
          reasonable administrative and technical safeguards, but no internet or
          messaging system can be guaranteed completely secure.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <p>
          You may opt out of text messages by texting STOP. You may also request
          access, correction, or deletion of personal information by emailing
          rawalvarez731@gmail.com. Some records may be retained where required
          for security, compliance, or legal obligations.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about this policy or the Fable Trader messaging program can
          be sent to rawalvarez731@gmail.com.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
