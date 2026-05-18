import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/content/InfoPage";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with bookings, payments, and your account.",
};

export default function SupportPage() {
  return (
    <InfoPage
      title="Support"
      description="We are here to help with reservations, changes, and account questions."
    >
      <p>
        For demo purposes, use the contact page or email{" "}
        <a href="mailto:EbrahimElkinani@gmail.com" className="text-primary-600 hover:underline">
          EbrahimElkinani@gmail.com
        </a>
        .
      </p>
      <p>
        <Link href="/contact" className="text-primary-600 hover:underline">
          Go to Contact →
        </Link>
      </p>
    </InfoPage>
  );
}
