import { Link } from "wouter";
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
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const featuredTools = [
  {
    name: "SQLフォーマッター",
    description: "SQLコードを整形してより読みやすくします",
    path: "/sql-formatter",
    icon: Code,
    color: "bg-blue-100 text-blue-600"
  },
  {
    name: "カラーピッカー",
    description: "画面上の色を取得し、カラーコードを確認",
    path: "/color-picker",
    icon: Pipette,
    color: "bg-purple-100 text-purple-600"
  },
  {
    name: "温度変換",
    description: "摂氏、華氏、ケルビンの温度変換",
    path: "/temperature-converter",
    icon: Thermometer,
    color: "bg-red-100 text-red-600"
  },
  {
    name: "計算機",
    description: "基本的な計算機能とコピー機能",
    path: "/calculator",
    icon: Calculator,
    color: "bg-green-100 text-green-600"
  },
  {
    name: "ファイル比較",
    description: "2つのファイルの内容を比較",
    path: "/file-compare",
    icon: GitCompare,
    color: "bg-yellow-100 text-yellow-600"
  },
  {
    name: "写真メタデータ",
    description: "画像ファイルのメタデータを表示",
    path: "/photo-metadata",
    icon: Image,
    color: "bg-pink-100 text-pink-600"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-mikan-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-mikan-500 to-mikan-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Wrench className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">みかんツール</h1>
          <p className="text-xl md:text-2xl text-mikan-100 mb-8">便利ツールを集めた統合ユーティリティ</p>
          <p className="text-lg text-mikan-200 max-w-2xl mx-auto">
            日常の作業を効率化する様々なツールを一つのアプリケーションで。
            SQLフォーマッター、カラーピッカー、温度変換など、必要な機能がすべて揃っています。
          </p>
        </div>
      </div>

      {/* Featured Tools */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">主要ツール</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.path} href={tool.path}>
                <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tool.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {tool.description}
                    </CardDescription>
                    <div className="mt-4 flex items-center text-mikan-600 text-sm font-medium">
                      使用する
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-900">特徴</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-mikan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">高速処理</h3>
              <p className="text-gray-600">最適化されたアルゴリズムで素早い処理を実現</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-mikan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">レスポンシブ対応</h3>
              <p className="text-gray-600">PC、タブレット、スマートフォンで快適に使用可能</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-mikan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">豊富な機能</h3>
              <p className="text-gray-600">様々な用途に対応した多彩なツール</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
