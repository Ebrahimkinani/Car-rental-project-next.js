import type { Metadata } from "next";
import { InfoPage } from "@/components/content/InfoPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we handle your personal information.",
};

export default function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy Policy"
      description="Placeholder policy for the UI preview — replace with legal copy before production."
    >
      <p>
        This demo application stores session and booking data in memory when mock mode is enabled.
        When connected to a database, your privacy practices should be documented here.
      </p>
    </InfoPage>
  );
}
