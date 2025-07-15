import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator as CalcIcon, Copy, RotateCcw } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
      
      // Add to history
      const calculation = `${currentValue} ${operation} ${inputValue} = ${newValue}`;
      setHistory(prev => [calculation, ...prev.slice(0, 9)]);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return firstValue / secondValue;
      case "=":
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      const calculation = `${previousValue} ${operation} ${inputValue} = ${newValue}`;
      
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
      
      setHistory(prev => [calculation, ...prev.slice(0, 9)]);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearAll = () => {
    clear();
    setHistory([]);
  };

  const copyResult = async () => {
    try {
      await copyToClipboard(display);
      toast({
        title: "コピー完了",
        description: `計算結果 ${display} をクリップボードにコピーしました`,
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

  const buttonClass = "h-12 text-lg font-medium";
  const operatorClass = "h-12 text-lg font-medium bg-mikan-600 hover:bg-mikan-700 text-white";
  const numberClass = "h-12 text-lg font-medium bg-white hover:bg-gray-50 border border-gray-200";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tool Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-mikan-400 to-mikan-500 rounded-lg flex items-center justify-center">
            <CalcIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">計算機</h1>
            <p className="text-gray-600">基本的な計算機能とコピー機能を提供します</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">計算機</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Display */}
            <div className="mb-4">
              <Input
                value={display}
                readOnly
                className="text-right text-2xl font-mono h-16 bg-gray-50 border-2"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Button onClick={copyResult} variant="outline" className={buttonClass}>
                <Copy className="h-4 w-4 mr-2" />
                コピー
              </Button>
              <Button onClick={clear} variant="outline" className={buttonClass}>
                C
              </Button>
              <Button onClick={clearAll} variant="outline" className={buttonClass}>
                <RotateCcw className="h-4 w-4 mr-2" />
                リセット
              </Button>
            </div>

            {/* Calculator Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {/* Row 1 */}
              <Button onClick={() => inputNumber("7")} className={numberClass}>7</Button>
              <Button onClick={() => inputNumber("8")} className={numberClass}>8</Button>
              <Button onClick={() => inputNumber("9")} className={numberClass}>9</Button>
              <Button onClick={() => inputOperation("÷")} className={operatorClass}>÷</Button>

              {/* Row 2 */}
              <Button onClick={() => inputNumber("4")} className={numberClass}>4</Button>
              <Button onClick={() => inputNumber("5")} className={numberClass}>5</Button>
              <Button onClick={() => inputNumber("6")} className={numberClass}>6</Button>
              <Button onClick={() => inputOperation("×")} className={operatorClass}>×</Button>

              {/* Row 3 */}
              <Button onClick={() => inputNumber("1")} className={numberClass}>1</Button>
              <Button onClick={() => inputNumber("2")} className={numberClass}>2</Button>
              <Button onClick={() => inputNumber("3")} className={numberClass}>3</Button>
              <Button onClick={() => inputOperation("-")} className={operatorClass}>−</Button>

              {/* Row 4 */}
              <Button onClick={() => inputNumber("0")} className={`${numberClass} col-span-2`}>0</Button>
              <Button onClick={inputDecimal} className={numberClass}>.</Button>
              <Button onClick={() => inputOperation("+")} className={operatorClass}>+</Button>

              {/* Row 5 */}
              <Button onClick={performCalculation} className={`${operatorClass} col-span-4`}>=</Button>
            </div>
          </CardContent>
        </Card>

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">計算履歴</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-gray-500 text-center py-8">計算履歴がありません</p>
              ) : (
                history.map((calculation, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg font-mono text-sm border"
                  >
                    {calculation}
                  </div>
                ))
              )}
            </div>
            
            {history.length > 0 && (
              <Button
                onClick={() => setHistory([])}
                variant="outline"
                className="w-full mt-4"
              >
                履歴をクリア
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Usage Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">使用方法</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">基本操作</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• 数字ボタンで数値を入力</li>
                <li>• 演算子ボタンで計算を実行</li>
                <li>• = ボタンで計算結果を表示</li>
                <li>• C ボタンで現在の計算をクリア</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">便利機能</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• コピーボタンで結果をクリップボードにコピー</li>
                <li>• 計算履歴を自動保存</li>
                <li>• リセットボタンで全体をクリア</li>
                <li>• 小数点計算に対応</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
