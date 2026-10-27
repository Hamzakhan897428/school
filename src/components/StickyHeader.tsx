import React from "react";
import { ModuleHeader, ModuleHeaderProps } from "./ModuleHeader";

export type StickyHeaderProps = ModuleHeaderProps & {
  showBack?: boolean;
  rightAction?: React.ReactNode;
  isRTL?: boolean;
  backgroundColor?: string;
  style?: any;
};

/**
 * StickyHeader Component
 *
 * Forwards to ModuleHeader with:
 * - Left side: Urdu / Language toggle icon button & Settings icon button
 * - Right side: Back navigation button & Screen title
 */
export const StickyHeader: React.FC<StickyHeaderProps> = (props) => {
  return <ModuleHeader {...props} />;
};

export default StickyHeader;

