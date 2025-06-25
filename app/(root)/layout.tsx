import Header from "@/components/_header";
import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <main className="root-container">
      <Header />
      {children}
    </main>
  );
};

export default Layout;
