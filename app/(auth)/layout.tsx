import type { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <main className="max-w-full">
      <section className="flex min-h-screen justify-center items-center">
        <div className="bg--color-background w-full max-w-md p-6 shadow-lg">
          {children}
        </div>
      </section>
    </main>
  );
};
export default Layout;
