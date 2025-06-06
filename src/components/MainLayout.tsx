import Navigation from "./Navigation";
import Footer from "./Footer";

// It's a good practice to explicitly type props for components.
interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
    </div>
  );
}
