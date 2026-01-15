import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Super soft cotton button-downs from Bangkok, sold in New Orleans. The story behind Black Cat.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
