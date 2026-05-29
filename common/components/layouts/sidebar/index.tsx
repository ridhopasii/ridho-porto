import React from "react";

import { MENU_ITEMS } from "@/common/constants/menu";

import Copyright from "../../elements/Copyright";
import Breakline from "../../elements/Breakline";
import Profile from "./Profile";
import Menu from "./Menu";
import ThemeToggle from "./ThemeToggle";
import IntlToggle from "./IntlToggle";

export default function Sidebar() {
  const filteredMenu = MENU_ITEMS?.filter((item) => item?.isShow);
  
  // Categorize navigation lists beautifully matching the screenshot
  const mainNav = filteredMenu.filter(item => 
    ["Home", "Resume", "Projects", "Social Media", "Blog", "Guestbook", "Chats", "Contact"].includes(item.title)
  );
  
  const appNav = filteredMenu.filter(item => 
    ["Dashboard", "Links", "Changelog", "Smart Talk"].includes(item.title)
  );

  return (
    <header className="lg:w-[260px] flex-shrink-0">
      <div className="sticky top-8 z-10 flex flex-col transition-all duration-300 space-y-6 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Profile />
        
        <div className="hidden lg:block space-y-6">
          <Breakline />
          
          {/* Main Navigation */}
          <Menu list={mainNav} />
          
          {/* Application Group */}
          {appNav.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-900">
              <Menu title="Application" list={appNav} />
            </div>
          )}
          
          {/* Theming & Language Group at the bottom */}
          <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
            <div className="space-y-2">
              <div className="mb-2 ml-2 text-xs font-semibold uppercase tracking-[0.1em] text-neutral-400 dark:text-neutral-500">
                Theming & Lang
              </div>
              
              {/* Premium Dark Mode Switch */}
              <div className="flex items-center justify-between py-2 px-4 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900/50 text-neutral-700 dark:text-neutral-400 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <span className="text-neutral-500">
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                  </span>
                  <span className="text-sm font-semibold">Dark Mode</span>
                </div>
                <ThemeToggle />
              </div>

              {/* Language Switch */}
              <div className="flex items-center justify-between py-2 px-4 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900/50 text-neutral-700 dark:text-neutral-400 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <span className="text-neutral-500">
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                  </span>
                  <span className="text-sm font-semibold">Language</span>
                </div>
                <IntlToggle />
              </div>
            </div>
          </div>
          
          <Breakline />
          <Copyright />
        </div>
      </div>
    </header>
  );
}
