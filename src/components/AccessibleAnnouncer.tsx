import {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
} from "react";
import type { ReactNode } from "react";

interface AnnouncerContextType {
  announce: (message: string, priority?: "polite" | "assertive") => void;
}

const AnnouncerContext = createContext<AnnouncerContextType | undefined>(
  undefined,
);

export const useAnnouncer = () => {
  const context = useContext(AnnouncerContext);
  if (context === undefined) {
    throw new Error(
      "useAnnouncer must be used within an AccessibleAnnouncerProvider",
    );
  }
  return context;
};

interface AnnouncerProviderProps {
  children: ReactNode;
}

export const AccessibleAnnouncerProvider: React.FC<AnnouncerProviderProps> = ({
  children,
}) => {
  const [politeMessage, setPoliteMessage] = useState("");
  const [assertiveMessage, setAssertiveMessage] = useState("");

  const announce = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      if (priority === "assertive") {
        setAssertiveMessage(message);
        setTimeout(() => setAssertiveMessage(""), 1000);
      } else {
        setPoliteMessage(message);
        setTimeout(() => setPoliteMessage(""), 1000);
      }
    },
    [],
  );

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}

      <div
        aria-live="polite"
        aria-atomic="true"
        role="status"
        className="sr-only"
      >
        {politeMessage}
      </div>

      <div
        aria-live="assertive"
        aria-atomic="true"
        role="alert"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
    </AnnouncerContext.Provider>
  );
};

export const usePageAnnouncement = (pageTitle: string) => {
  const { announce } = useAnnouncer();

  useEffect(() => {
    announce(`Navigated to ${pageTitle}`);
  }, [pageTitle, announce]);
};

export const useLoadingAnnouncement = (
  isLoading: boolean,
  itemName: string,
) => {
  const { announce } = useAnnouncer();

  useEffect(() => {
    if (isLoading) {
      announce(`Loading ${itemName}...`);
    } else {
      announce(`${itemName} loaded`);
    }
  }, [isLoading, itemName, announce]);
};

export const useActionAnnouncement = () => {
  const { announce } = useAnnouncer();

  return {
    announceSuccess: (action: string) =>
      announce(`${action} completed successfully`),
    announceError: (action: string) =>
      announce(`${action} failed`, "assertive"),
    announceInfo: (message: string) => announce(message),
  };
};
