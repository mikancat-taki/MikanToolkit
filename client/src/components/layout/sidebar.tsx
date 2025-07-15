import { Link, useLocation } from "wouter";
import { 
  Code, 
  FileCode, 
  Pipette, 
  Camera, 
  Thermometer, 
  Calculator, 
  GitCompare, 
  Image,
  Wrench,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

const toolCategories = [
  {
    name: "テキスト処理",
    tools: [
      { name: "SQLフォーマッター", path: "/sql-formatter", icon: Code },
      { name: "コードフォーマッター", path: "/code-formatter", icon: FileCode },
    ]
  },
  {
    name: "画像処理",
    tools: [
      { name: "カラーピッカー", path: "/color-picker", icon: Pipette },
      { name: "スクリーンキャプチャ", path: "/screen-capture", icon: Camera },
    ]
  },
  {
    name: "変換ツール",
    tools: [
      { name: "温度変換", path: "/temperature-converter", icon: Thermometer },
      { name: "計算機", path: "/calculator", icon: Calculator },
    ]
  },
  {
    name: "ファイル操作",
    tools: [
      { name: "ファイル比較", path: "/file-compare", icon: GitCompare },
      { name: "写真メタデータ", path: "/photo-metadata", icon: Image },
    ]
  }
];

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-mikan-400 to-mikan-500 rounded-full flex items-center justify-center">
          <Wrench className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-mikan-800">みかんツール</h1>
          <p className="text-sm text-gray-600">便利ツール集</p>
        </div>
      </div>

      <nav className="space-y-2">
        {toolCategories.map((category) => (
          <div key={category.name} className="mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {category.name}
            </h3>
            <div className="space-y-1">
              {category.tools.map((tool) => {
                const Icon = tool.icon;
                const isActive = location === tool.path;
                return (
                  <Link
                    key={tool.path}
                    href={tool.path}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "text-mikan-700 bg-mikan-100"
                        : "text-gray-700 hover:text-mikan-700 hover:bg-mikan-100"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className={cn(
                      "mr-3 h-4 w-4",
                      isActive ? "text-mikan-600" : "text-gray-400 group-hover:text-mikan-600"
                    )} />
                    {tool.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("w-64 bg-white shadow-lg border-r border-mikan-200 hidden md:block", className)}>
        <SidebarContent />
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 text-gray-600 hover:text-mikan-600 transition-colors bg-white rounded-md shadow-md"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
