import * as React from "react";
import { cn } from "@/lib/utils";

export type IconProps = {
  className?: string;
  size?: number;
  strokeWidth?: number;
  "aria-hidden"?: boolean;
};

/** Build an icon component from a list of SVG child nodes (24px grid, stroke style). */
function make(name: string, children: React.ReactNode) {
  const Comp = ({ className, size = 20, strokeWidth = 1.8 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      aria-hidden
      focusable="false"
    >
      {children}
    </svg>
  );
  Comp.displayName = name;
  return Comp;
}

export const IconCalendar = make("IconCalendar", <>
  <rect x="3" y="4.5" width="18" height="16.5" rx="3" />
  <path d="M3 9.5h18M8 2.8v3.4M16 2.8v3.4" />
</>);
export const IconCalendarCheck = make("IconCalendarCheck", <>
  <rect x="3" y="4.5" width="18" height="16.5" rx="3" />
  <path d="M3 9.5h18M8 2.8v3.4M16 2.8v3.4M9 15l2 2 4-4" />
</>);
export const IconClock = make("IconClock", <>
  <circle cx="12" cy="12" r="9" />
  <path d="M12 7v5l3 2" />
</>);
export const IconUser = make("IconUser", <>
  <circle cx="12" cy="8" r="4" />
  <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
</>);
export const IconUsers = make("IconUsers", <>
  <circle cx="9" cy="8" r="3.5" />
  <path d="M2.5 20c0-3.5 2.9-5.5 6.5-5.5s6.5 2 6.5 5.5" />
  <path d="M16 4.7a3.5 3.5 0 0 1 0 6.6M18 14.8c2.2.7 3.5 2.4 3.5 5.2" />
</>);
export const IconStethoscope = make("IconStethoscope", <>
  <path d="M6 3v6a4 4 0 0 0 8 0V3" />
  <path d="M10 13v2a5 5 0 0 0 10 0v-2" />
  <circle cx="20" cy="11" r="2" />
</>);
export const IconCheck = make("IconCheck", <path d="M5 12.5l4.5 4.5L19 7.5" />);
export const IconCheckCircle = make("IconCheckCircle", <>
  <circle cx="12" cy="12" r="9" />
  <path d="M8 12.3l2.8 2.8L16 9.5" />
</>);
export const IconX = make("IconX", <path d="M6 6l12 12M18 6L6 18" />);
export const IconSearch = make("IconSearch", <>
  <circle cx="11" cy="11" r="7" />
  <path d="M20.5 20.5l-4-4" />
</>);
export const IconPlus = make("IconPlus", <path d="M12 5v14M5 12h14" />);
export const IconMinus = make("IconMinus", <path d="M5 12h14" />);
export const IconWallet = make("IconWallet", <>
  <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v1.5" />
  <rect x="3" y="8" width="18" height="12" rx="3" />
  <circle cx="16.5" cy="14" r="1.2" fill="currentColor" stroke="none" />
</>);
export const IconCard = make("IconCard", <>
  <rect x="2.5" y="5" width="19" height="14" rx="3" />
  <path d="M2.5 10h19M6.5 15h4" />
</>);
export const IconBell = make("IconBell", <>
  <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9z" />
  <path d="M10 19a2 2 0 0 0 4 0" />
</>);
export const IconMail = make("IconMail", <>
  <rect x="3" y="5" width="18" height="14" rx="3" />
  <path d="M3.5 7.5l8.5 6 8.5-6" />
</>);
export const IconPhone = make("IconPhone", <path d="M5 4h3.5l1.6 4.2-2.2 1.5a11 11 0 0 0 6.4 6.4l1.5-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5C10.7 20 4 13.3 3.5 5.6A1.5 1.5 0 0 1 5 4z" />);
export const IconSmartphone = make("IconSmartphone", <>
  <rect x="6.5" y="2.5" width="11" height="19" rx="3" />
  <path d="M11 18.5h2" />
</>);
export const IconMessage = make("IconMessage", <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5v-8z" />);
export const IconBuilding = make("IconBuilding", <>
  <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h2a2 2 0 0 1 2 2v10M2.5 21h19" />
  <path d="M8 7.5h4M8 11.5h4M8 15.5h4" />
</>);
export const IconSparkles = make("IconSparkles", <>
  <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z" />
  <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
</>);
export const IconArrowRight = make("IconArrowRight", <path d="M5 12h14M13 6l6 6-6 6" />);
export const IconArrowLeft = make("IconArrowLeft", <path d="M19 12H5M11 6l-6 6 6 6" />);
export const IconArrowUpRight = make("IconArrowUpRight", <path d="M7 17L17 7M8 7h9v9" />);
export const IconChevronRight = make("IconChevronRight", <path d="M9 5l7 7-7 7" />);
export const IconChevronLeft = make("IconChevronLeft", <path d="M15 5l-7 7 7 7" />);
export const IconChevronDown = make("IconChevronDown", <path d="M5 9l7 7 7-7" />);
export const IconRefresh = make("IconRefresh", <>
  <path d="M20 11a8 8 0 0 0-14.5-4.5L4 8M4 4v4h4" />
  <path d="M4 13a8 8 0 0 0 14.5 4.5L20 16M20 20v-4h-4" />
</>);
export const IconAlert = make("IconAlert", <>
  <path d="M10.3 4.2L2.8 17.5A2 2 0 0 0 4.5 20.5h15a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" />
  <path d="M12 9.5v4M12 17h.01" />
</>);
export const IconInfo = make("IconInfo", <>
  <circle cx="12" cy="12" r="9" />
  <path d="M12 11v5M12 8h.01" />
</>);
export const IconLayout = make("IconLayout", <>
  <rect x="3" y="3" width="7.5" height="9" rx="2" />
  <rect x="13.5" y="3" width="7.5" height="5.5" rx="2" />
  <rect x="13.5" y="11.5" width="7.5" height="9.5" rx="2" />
  <rect x="3" y="15" width="7.5" height="6" rx="2" />
</>);
export const IconGrid = make("IconGrid", <>
  <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
  <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
  <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
  <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
</>);
export const IconWalkIn = make("IconWalkIn", <>
  <circle cx="13" cy="4.5" r="2" />
  <path d="M9 21l2.5-6-2-2.5 1-4.5 3-1 2 3.5 3 1M11.5 15l3.5 2.5V21M10.5 8.5L7 11" />
</>);
export const IconMenu = make("IconMenu", <path d="M4 7h16M4 12h16M4 17h16" />);
export const IconTrash = make("IconTrash", <>
  <path d="M4 7h16M10 11v6M14 11v6" />
  <path d="M6 7l1 12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5L18 7M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7" />
</>);
export const IconEdit = make("IconEdit", <>
  <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z" />
  <path d="M13.5 6.5l4 4" />
</>);
export const IconShield = make("IconShield", <>
  <path d="M12 3l7.5 3v5.5c0 4.5-3.2 8.2-7.5 9.5-4.3-1.3-7.5-5-7.5-9.5V6L12 3z" />
  <path d="M8.8 12l2.3 2.3 4.2-4.6" />
</>);
export const IconLock = make("IconLock", <>
  <rect x="4.5" y="10.5" width="15" height="10" rx="3" />
  <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
</>);
export const IconMapPin = make("IconMapPin", <>
  <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
  <circle cx="12" cy="9.5" r="2.5" />
</>);
export const IconDownload = make("IconDownload", <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />);
export const IconCopy = make("IconCopy", <>
  <rect x="8.5" y="8.5" width="12" height="12" rx="3" />
  <path d="M15.5 8.5V6A2.5 2.5 0 0 0 13 3.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2.5" />
</>);
export const IconHome = make("IconHome", <>
  <path d="M3.5 11L12 3.5 20.5 11" />
  <path d="M5.5 9.5V20a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1V9.5" />
</>);
export const IconHeart = make("IconHeart", <path d="M12 20s-8-4.7-8-10.6A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8 2.4C20 15.3 12 20 12 20z" />);
export const IconZap = make("IconZap", <path d="M13 3L5 13.5h6L10 21l8-10.5h-6L13 3z" />);
export const IconReceipt = make("IconReceipt", <>
  <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" />
  <path d="M9 8h6M9 12h6" />
</>);
export const IconFilter = make("IconFilter", <path d="M4 5h16l-6 8v6l-4-2v-4L4 5z" />);
export const IconSettings = make("IconSettings", <>
  <circle cx="12" cy="12" r="3" />
  <path d="M19.4 14a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V20a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H4a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h0a1.6 1.6 0 0 0 1-1.5V4a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5h0a1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v0a1.6 1.6 0 0 0 1.5 1H20a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" />
</>);
export const IconList = make("IconList", <path d="M8 6h12M8 12h12M8 18h12M3.5 6h.01M3.5 12h.01M3.5 18h.01" />);
export const IconClipboard = make("IconClipboard", <>
  <rect x="5" y="4" width="14" height="17" rx="3" />
  <path d="M9 4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6H9V4.5zM9 12h6M9 16h4" />
</>);
export const IconLogOut = make("IconLogOut", <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M16 8l4 4-4 4M20 12H9" />);
export const IconRocket = make("IconRocket", <>
  <path d="M5 15c-1.5 1.2-2 4-2 6 2 0 4.8-.5 6-2" />
  <path d="M9 15l-3-3c1-4 4.5-8 12-9 0 7.5-5 11-9 12z" />
  <circle cx="15" cy="9" r="1.4" />
</>);

/** Legacy name kept for compatibility */
export const IconStar = make("IconStar", <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5z" />);
