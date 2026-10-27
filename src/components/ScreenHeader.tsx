import React from "react";
import { ModuleHeader, ModuleHeaderProps } from "./ModuleHeader";

export type ScreenHeaderProps = ModuleHeaderProps;
export const ScreenHeader: React.FC<ScreenHeaderProps> = (props) => {
  return <ModuleHeader {...props} />;
};

export default ScreenHeader;
