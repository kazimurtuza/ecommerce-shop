import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ThemeSwitcher from "@/components/layout/ThemeSwitcher";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ThemeSwitcher />
    </>
  );
}
