import type { Metadata } from "next";
import { InfoPage } from "@/components/content/InfoPage";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Cancellation and refund guidelines.",
};

export default function RefundsPage() {
  return (
    <InfoPage
      title="Refund Policy"
      description="Placeholder refund terms for the client demo."
    >
      <p>
        Cancellations made more than 24 hours before pickup may qualify for a full refund in the
        production system. In this preview, cancelling a booking updates its status in mock storage.
      </p>
    </InfoPage>
  );
}
