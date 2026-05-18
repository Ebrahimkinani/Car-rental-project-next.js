import type { Metadata } from "next";
import { InfoPage } from "@/components/content/InfoPage";

export const metadata: Metadata = {
  title: "Blog",
  description: "News and updates from our car rental team.",
};

export default function BlogPage() {
  return (
    <InfoPage
      title="Blog"
      description="Stories, tips, and product updates — demo content for the client preview."
    >
      <p>
        We are preparing articles on road-trip planning, fleet highlights, and seasonal offers.
        Check back soon or contact us for partnership inquiries.
      </p>
    </InfoPage>
  );
}
