import clsx from "clsx";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import ProfileHeader from "./ProfileHeader";
import ThemeToggle from "./ThemeToggle";
import IntlToggle from "./IntlToggle";
import { MENU_ITEMS } from "@/common/constants/menu";

const Profile = () => {
  const [width, setWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  const imageSize = isMobile ? 40 : 100;

  useEffect(() => {
    setWidth(window.innerWidth);
    setIsMobile(window.innerWidth < 1024);

    const handleResize = () => {
      setWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const filteredMenu = MENU_ITEMS?.filter((item) => item?.isShow);

  return (
    <div
      className={clsx(
        "fixed z-20 w-full bg-neutral-50 shadow-sm dark:border-b dark:border-neutral-800 dark:bg-neutral-900 lg:relative lg:border-none lg:!bg-transparent lg:p-0 xl:shadow-none",
      )}
    >
      <div className="p-5 lg:p-0">
        <div className="flex items-center justify-between md:px-2 lg:flex-col lg:space-y-4">
          <ProfileHeader expandMenu={false} imageSize={imageSize} />
          {isMobile && (
            <div className="mt-1 flex items-center gap-5 lg:hidden">
              <div className="flex gap-4">
                <div className="transition-all duration-300">
                  <IntlToggle />
                </div>
                <ThemeToggle />
              </div>
            </div>
          )}
        </div>
      </div>

      {isMobile && (
        <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm overflow-x-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            <ul className="flex items-center whitespace-nowrap px-4 py-2 md:py-3 gap-6 md:gap-10 justify-start md:justify-center">
              {filteredMenu.map((item, index) => {
                // Strip locale prefix for matching, assume locale like /en or /id or no prefix
                const isActive = item.href === "/" 
                  ? pathname === "/" || pathname === "/en" || pathname === "/id" 
                  : pathname.includes(item.href);
                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={clsx(
                        "text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-2",
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                      )}
                    >
                      {item.icon}
                      {t(item.title)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
