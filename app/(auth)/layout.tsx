import Image from "next/image";
import { ReactNode } from "react";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <main className="min-h-screen flex">
      <div className="flex-1">
        <div className="w-full h-full flex-col flex justify-center items-center">
          <h1 className="text-2xl md:text-5xl font-bold text-center text-gray-400 mb-2 tracking-wide">
            Welcome to HireHub
          </h1>
          <p className="text-center text-gray-500 text-sm md:text-lg font-semibold mb-4">
            Discover, connect, and hire top talent effortlessly
          </p>
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
