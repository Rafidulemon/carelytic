import AccountOverview from "@/components/account/AccountOverview";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-slate-50/80">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-16 lg:px-8 lg:pt-20">
        <AccountOverview />
      </main>
      <Footer />
    </div>
  );
}
