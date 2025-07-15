import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileCode, Copy, RotateCcw, Wand2, FileText, Type, Clock } from "lucide-react";
import { formatSQL, formatJSON, formatJavaScript, formatCSS, formatHTML, type FormatOptions } from "@/lib/formatters";
import { copyToClipboard } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function CodeFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState<FormatOptions['language']>("javascript");
  const [indent, setIndent] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState({
    lines: 0,
    characters: 0,
    processingTime: 0
  });
  const { toast } = useToast();

  const handleFormat = async () => {
    if (!input.trim()) {
      toast({
        title: "エラー",
        description: "コードを入力してください",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    const startTime = performance.now();

    try {
      let formatted = "";
      
      switch (language) {
        case "sql":
        case "mysql":
        case "postgresql":
        case "sqlite":
          formatted = formatSQL(input, { language, indent, uppercase: false });
          break;
        case "json":
          formatted = formatJSON(input, indent);
          break;
        case "javascript":
        case "typescript":
          formatted = formatJavaScript(input, { language, indent });
          break;
        case "css":
          formatted = formatCSS(input, indent);
          break;
        case "html":
          formatted = formatHTML(input, indent);
          break;
        default:
          formatted = input;
      }

      setOutput(formatted);
      
      const endTime = performance.now();
      const processingTime = (endTime - startTime) / 1000;
      
      setStats({
        lines: formatted.split('\n').length,
        characters: formatted.length,
        processingTime: Math.round(processingTime * 100) / 100
      });

      toast({
        title: "成功",
        description: "コードが正常にフォーマットされました",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "フォーマットエラー",
        description: error instanceof Error ? error.message : "不明なエラーが発生しました",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    setStats({ lines: 0, characters: 0, processingTime: 0 });
  };

  const handleCopy = async () => {
    if (!output) {
      toast({
        title: "エラー",
        description: "コピーする内容がありません",
        variant: "destructive"
      });
      return;
    }

    try {
      await copyToClipboard(output);
      toast({
        title: "コピー完了",
        description: "フォーマットされたコードをクリップボードにコピーしました",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "コピーエラー",
        description: "クリップボードへのコピーに失敗しました",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Tool Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-mikan-400 to-mikan-500 rounded-lg flex items-center justify-center">
            <FileCode className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">コードフォーマッター</h1>
            <p className="text-gray-600">様々なプログラミング言語のコードを整形します</p>
          </div>
        </div>
      </div>

      {/* Tool Controls */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">言語:</label>
              <Select value={language} onValueChange={(value) => setLanguage(value as FormatOptions['language'])}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="sql">SQL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">インデント:</label>
              <Select value={indent.toString()} onValueChange={(value) => setIndent(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2スペース</SelectItem>
                  <SelectItem value="4">4スペース</SelectItem>
                  <SelectItem value="8">タブ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-2 ml-auto">
              <Button 
                onClick={handleFormat}
                disabled={isProcessing}
                className="bg-mikan-600 hover:bg-mikan-700"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isProcessing ? "処理中..." : "フォーマット"}
              </Button>
              <Button 
                onClick={handleReset}
                variant="outline"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                リセット
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Input Panel */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">入力</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  navigator.clipboard.readText().then(text => {
                    setInput(text);
                    toast({
                      title: "貼り付け完了",
                      description: "クリップボードの内容を貼り付けました",
                      variant: "success"
                    });
                  }).catch(() => {
                    toast({
                      title: "貼り付けエラー",
                      description: "クリップボードの読み取りに失敗しました",
                      variant: "destructive"
                    });
                  });
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="コードをここに入力してください..."
              className="min-h-96 font-mono text-sm resize-none"
            />
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">出力</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleCopy}
                disabled={!output}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="min-h-96 p-4 bg-gray-50 rounded-md border">
              <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
                {output || "フォーマットされたコードがここに表示されます"}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tool Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-8 h-8 bg-mikan-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-mikan-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">行数</p>
                <p className="text-lg font-semibold text-gray-900">{stats.lines}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-8 h-8 bg-mikan-100 rounded-full flex items-center justify-center">
                <Type className="h-4 w-4 text-mikan-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">文字数</p>
                <p className="text-lg font-semibold text-gray-900">{stats.characters}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-8 h-8 bg-mikan-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-mikan-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">処理時間</p>
                <p className="text-lg font-semibold text-gray-900">{stats.processingTime}秒</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
