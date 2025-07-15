import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GitCompare, Upload, FileText, Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface FileDiff {
  line: number;
  type: 'added' | 'removed' | 'modified';
  content: string;
  originalContent?: string;
}

export default function FileCompare() {
  const [file1Content, setFile1Content] = useState("");
  const [file2Content, setFile2Content] = useState("");
  const [file1Name, setFile1Name] = useState("ファイル1");
  const [file2Name, setFile2Name] = useState("ファイル2");
  const [differences, setDifferences] = useState<FileDiff[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = useCallback((fileNumber: 1 | 2, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (fileNumber === 1) {
          setFile1Content(content);
          setFile1Name(file.name);
        } else {
          setFile2Content(content);
          setFile2Name(file.name);
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const compareFiles = () => {
    if (!file1Content.trim() || !file2Content.trim()) {
      toast({
        title: "エラー",
        description: "両方のファイルの内容を入力してください",
        variant: "destructive"
      });
      return;
    }

    setIsComparing(true);
    
    // Simple diff algorithm
    const lines1 = file1Content.split('\n');
    const lines2 = file2Content.split('\n');
    const diffs: FileDiff[] = [];

    const maxLength = Math.max(lines1.length, lines2.length);
    
    for (let i = 0; i < maxLength; i++) {
      const line1 = lines1[i];
      const line2 = lines2[i];
      
      if (line1 === undefined) {
        diffs.push({
          line: i + 1,
          type: 'added',
          content: line2
        });
      } else if (line2 === undefined) {
        diffs.push({
          line: i + 1,
          type: 'removed',
          content: line1
        });
      } else if (line1 !== line2) {
        diffs.push({
          line: i + 1,
          type: 'modified',
          content: line2,
          originalContent: line1
        });
      }
    }

    setDifferences(diffs);
    setIsComparing(false);

    toast({
      title: "比較完了",
      description: `${diffs.length}件の差異が見つかりました`,
      variant: "success"
    });
  };

  const copyDifferences = async () => {
    if (differences.length === 0) {
      toast({
        title: "エラー",
        description: "コピーする差異がありません",
        variant: "destructive"
      });
      return;
    }

    const diffText = differences.map(diff => {
      let text = `行 ${diff.line}: `;
      switch (diff.type) {
        case 'added':
          text += `[追加] ${diff.content}`;
          break;
        case 'removed':
          text += `[削除] ${diff.content}`;
          break;
        case 'modified':
          text += `[変更] ${diff.originalContent} → ${diff.content}`;
          break;
      }
      return text;
    }).join('\n');

    try {
      await copyToClipboard(diffText);
      toast({
        title: "コピー完了",
        description: "差異をクリップボードにコピーしました",
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

  const reset = () => {
    setFile1Content("");
    setFile2Content("");
    setFile1Name("ファイル1");
    setFile2Name("ファイル2");
    setDifferences([]);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Tool Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-mikan-400 to-mikan-500 rounded-lg flex items-center justify-center">
            <GitCompare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ファイル比較</h1>
            <p className="text-gray-600">2つのファイルの内容を比較して差異を表示します</p>
          </div>
        </div>
      </div>

      {/* File Upload Controls */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button 
              onClick={compareFiles}
              disabled={isComparing}
              className="bg-mikan-600 hover:bg-mikan-700"
            >
              <GitCompare className="h-4 w-4 mr-2" />
              {isComparing ? "比較中..." : "比較実行"}
            </Button>
            
            <Button 
              onClick={copyDifferences}
              variant="outline"
              disabled={differences.length === 0}
            >
              <Copy className="h-4 w-4 mr-2" />
              差異をコピー
            </Button>
            
            <Button onClick={reset} variant="outline">
              リセット
            </Button>
            
            <div className="ml-auto text-sm text-gray-600">
              {differences.length > 0 && `${differences.length}件の差異`}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Input Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* File 1 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-mikan-600" />
                <Input
                  value={file1Name}
                  onChange={(e) => setFile1Name(e.target.value)}
                  className="font-medium border-none p-0 h-auto focus:ring-0"
                  placeholder="ファイル1"
                />
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept=".txt,.js,.ts,.jsx,.tsx,.html,.css,.json,.md,.py,.java,.cpp,.c,.php,.rb,.go,.rs,.sh,.sql,.xml,.yaml,.yml"
                  onChange={(e) => handleFileUpload(1, e)}
                  className="hidden"
                  id="file1-input"
                />
                <label htmlFor="file1-input">
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    <Upload className="h-4 w-4" />
                  </Button>
                </label>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              value={file1Content}
              onChange={(e) => setFile1Content(e.target.value)}
              placeholder="ファイル1の内容をここに入力するか、ファイルをアップロードしてください..."
              className="min-h-80 font-mono text-sm resize-none"
            />
          </CardContent>
        </Card>

        {/* File 2 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-mikan-600" />
                <Input
                  value={file2Name}
                  onChange={(e) => setFile2Name(e.target.value)}
                  className="font-medium border-none p-0 h-auto focus:ring-0"
                  placeholder="ファイル2"
                />
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept=".txt,.js,.ts,.jsx,.tsx,.html,.css,.json,.md,.py,.java,.cpp,.c,.php,.rb,.go,.rs,.sh,.sql,.xml,.yaml,.yml"
                  onChange={(e) => handleFileUpload(2, e)}
                  className="hidden"
                  id="file2-input"
                />
                <label htmlFor="file2-input">
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    <Upload className="h-4 w-4" />
                  </Button>
                </label>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              value={file2Content}
              onChange={(e) => setFile2Content(e.target.value)}
              placeholder="ファイル2の内容をここに入力するか、ファイルをアップロードしてください..."
              className="min-h-80 font-mono text-sm resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* Differences Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">差異</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {differences.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {file1Content && file2Content ? "差異はありません" : "ファイルを比較してください"}
              </p>
            ) : (
              differences.map((diff, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border font-mono text-sm ${
                    diff.type === 'added' ? 'bg-green-50 border-green-200' :
                    diff.type === 'removed' ? 'bg-red-50 border-red-200' :
                    'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    <span className="text-xs font-medium text-gray-500 mr-2">
                      行 {diff.line}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      diff.type === 'added' ? 'bg-green-100 text-green-800' :
                      diff.type === 'removed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {diff.type === 'added' ? '追加' : diff.type === 'removed' ? '削除' : '変更'}
                    </span>
                  </div>
                  
                  {diff.type === 'modified' && diff.originalContent && (
                    <div className="text-red-600 mb-1">
                      <span className="text-xs text-gray-500">- </span>
                      {diff.originalContent}
                    </div>
                  )}
                  
                  <div className={
                    diff.type === 'added' ? 'text-green-600' :
                    diff.type === 'removed' ? 'text-red-600' :
                    'text-yellow-600'
                  }>
                    <span className="text-xs text-gray-500">
                      {diff.type === 'removed' ? '- ' : '+ '}
                    </span>
                    {diff.content}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
