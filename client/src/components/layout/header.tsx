import { HelpCircle, Settings, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const isMobile = useIsMobile();

  return (
    <header className="bg-white shadow-sm border-b border-mikan-200 px-4 py-3 md:px-6 md:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {isMobile && onMobileMenuToggle && (
            <button
              onClick={onMobileMenuToggle}
              className="text-gray-600 hover:text-mikan-600 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <div className="flex items-center space-x-2 md:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-mikan-400 to-mikan-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">み</span>
            </div>
            <span className="font-bold text-mikan-800">みかんツール</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-mikan-600 transition-colors">
            <HelpCircle className="h-5 w-5" />
          </button>
          <button className="text-gray-600 hover:text-mikan-600 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
