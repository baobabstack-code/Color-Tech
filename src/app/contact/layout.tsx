import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Color Tech | Auto Body Repair Harare | Get Quote Today",
  description:
    "Contact Color Tech for professional auto body repair, spray painting, and panel beating services in Harare. Get your free quote today. Call +263 77 123 4567",
  keywords:
    "contact auto body repair Harare, get quote spray painting Harare, panel beating contact Harare, car repair quote Zimbabwe, auto body shop contact",
  openGraph: {
    title: "Contact Color Tech | Auto Body Repair Harare | Get Quote Today",
    description:
      "Contact Color Tech for professional auto body repair, spray painting, and panel beating services in Harare. Get your free quote today.",
    url: "https://color-tech.vercel.app/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
