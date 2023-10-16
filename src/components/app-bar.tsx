import ModeToggle from "@/components/mode-toggle";

import { UserButton } from "@clerk/nextjs";

function AppBar() {
  return (
    <header className="text-lg font-semibold border-neutral-200 dark:border-neutral-800 border-b-2">
      <div className="px-4 flex justify-between items-center h-12">
        <div className="flex items-center mt-[3px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="currentColor"
            stroke="none"
            className="h-6"
          >
            <path d="M0,20.69H3.5c1.14,3.2,6.14,4.52,9.17,2.75a2.11,2.11,0,0,0,1-1.55,2.19,2.19,0,0,0-1.09-1.57c-1.45-.6-1-2.22-2.5-2.68-.79-.24-1.59-.47-2.35-.77-1.55-.63-3.84-1-3.64-2.77.15-1.25-.87-1.65-1.72-2.56-1.89-2-1.72-3.73.49-5.43C4.36,4.93,7.35-.06,15.13,4.77c3.47,2.16-.05-6.1,3.72-4.58C21.32,1.19,22.63,8.76,21,11a1.12,1.12,0,0,1-.78.45c-1.36-.05-.44,0-1.8-.1.19-1.93-2.44-2.69-4.29-2.88a20.92,20.92,0,0,0-4.68.05c-1.36.17-1.62,1.11-.55,1.94,1.43,1.1,3.05,1.94,4.57,2.93A41.55,41.55,0,0,1,17.38,16a6.39,6.39,0,0,1,1.69,8C17.38,27.58,5,33.14,1.1,32.4c-1.68-.32,4-3.94,2.74-5.15C1.66,25.09.24,22.73,0,20.69Z" />
          </svg>
          <span className="ml-[-15px]">penditor</span>
        </div>
        <div className="flex items-center justify-end space-x-3">
          <ModeToggle></ModeToggle>
          <UserButton afterSignOutUrl="/"></UserButton>
        </div>
      </div>
    </header>
  );
}

export default AppBar;
