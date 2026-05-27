import Image from "next/image";
import type { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden md:flex md:w-1/2 items-center justify-center bg-bg-login overflow-hidden">
        <Image
          src="/images/login/upperElipse.png"
          alt="Upper Elipse"
          width={400}
          height={400}
          className=" opacity-90 object-top absolute top-0 left-0 w-full"
        />

        <Image
          src="/images/login/bottomElipse.png"
          alt="Bottom Elipse"
          width={400}
          height={400}
          className=" opacity-90 object-bottom absolute -bottom-5 right-0 w-full"
        />

        <Image
          alt="InfinityFy Logo"
          src="/images/brand/infinityfy-logo-white.png"
          width={204}
          height={80}
          className="relative z-10"
        />
      </div>

      <div className="flex md:justify-center w-full md:w-1/2 flex-col p-6 pt-12 pb-6 bg-background-white">
        <div className="flex flex-1 flex-col items-center max-w-md w-full mx-auto md:flex-0 lg:p-6">
          <div className="flex justify-start w-full md:hidden">
            <Image
              src="/images/brand/infinityfy-logo.png"
              alt="InfinityFy Logo"
              width={103}
              height={40}
            />
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default layout;
