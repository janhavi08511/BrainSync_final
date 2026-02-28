import { Button } from "@/components/ui/button";
import { Plus, ArrowUp, History, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-2 mb-2">
          <Link to="/translate">
            <Button
              size="icon"
              className="w-12 h-12 rounded-full shadow-lg slide-in-right"
              variant="secondary"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/history">
            <Button
              size="icon"
              className="w-12 h-12 rounded-full shadow-lg slide-in-right"
              variant="secondary"
              style={{ animationDelay: "0.05s" }}
            >
              <History className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button
              size="icon"
              className="w-12 h-12 rounded-full shadow-lg slide-in-right"
              variant="secondary"
              style={{ animationDelay: "0.1s" }}
            >
              <Home className="w-5 h-5" />
            </Button>
          </Link>
          <Button
            size="icon"
            className="w-12 h-12 rounded-full shadow-lg slide-in-right"
            variant="secondary"
            style={{ animationDelay: "0.15s" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </div>
      )}

      <Button
        size="icon"
        className="w-14 h-14 rounded-full shadow-lg hover-glow"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Plus
          className={`w-6 h-6 transition-transform duration-300 ${
            isOpen ? "rotate-45" : ""
          }`}
        />
      </Button>
    </div>
  );
};
