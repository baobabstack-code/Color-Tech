import Navigation from "./Navigation";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
} 