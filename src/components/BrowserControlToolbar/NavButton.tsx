import * as React from "react";
import { Button, Spinner, Tooltip } from "@patternfly/react-core";

// An icon button for back, forward or reload, showing a spinner while its action runs.
export const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isDisabled: boolean;
  isLoading: boolean;
  onClick: () => void;
}> = ({ label, icon, isDisabled, isLoading, onClick }) => (
  <Tooltip content={label}>
    <Button
      aria-label={label}
      isDisabled={isDisabled}
      onClick={onClick}
      icon={isLoading ? <Spinner size="sm" /> : icon}
      variant="plain"
    />
  </Tooltip>
);
