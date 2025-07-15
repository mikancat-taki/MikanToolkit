import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Thermometer, ArrowRightLeft, Copy } from "lucide-react";
import { 
  celsiusToFahrenheit, 
  fahrenheitToCelsius, 
  celsiusToKelvin, 
  kelvinToCelsius,
  copyToClipboard 
} from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function TemperatureConverter() {
  const [celsius, setCelsius] = useState<number>(0);
  const [fahrenheit, setFahrenheit] = useState<number>(32);
  const [kelvin, setKelvin] = useState<number>(273.15);
  const { toast } = useToast();

  const updateFromCelsius = (value: number) => {
    setCelsius(value);
    setFahrenheit(celsiusToFahrenheit(value));
    setKelvin(celsiusToKelvin(value));
  };

  const updateFromFahrenheit = (value: number) => {
    setFahrenheit(value);
    const celsiusValue = fahrenheitToCelsius(value);
    setCelsius(celsiusValue);
    setKelvin(celsiusToKelvin(celsiusValue));
  };

  const updateFromKelvin = (value: number) => {
    setKelvin(value);
    const celsiusValue = kelvinToCelsius(value);
    setCelsius(celsiusValue);
    setFahrenheit(celsiusToFahrenheit(celsiusValue));
  };

  const copyTemperature = async (value: number, unit: string) => {
    try {
      await copyToClipboard(`${value.toFixed(2)}${unit}`);
      toast({
        title: "コピー完了",
        description: `${value.toFixed(2)}${unit}をクリップボードにコピーしました`,
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

  const resetValues = () => {
    updateFromCelsius(0);
  };

  const commonTemperatures = [
    { name: "絶対零度", celsius: -273.15 },
    { name: "水の凝固点", celsius: 0 },
    { name: "室温", celsius: 20 },
    { name: "体温", celsius: 37 },
    { name: "水の沸点", celsius: 100 },
    { name: "真夏日", celsius: 30 },
    { name: "猛暑日", celsius: 35 },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tool Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-mikan-400 to-mikan-500 rounded-lg flex items-center justify-center">
            <Thermometer className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">温度変換</h1>
            <p className="text-gray-600">摂氏、華氏、ケルビンの温度変換を行います</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Converter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <ArrowRightLeft className="h-5 w-5 mr-2" />
              温度変換
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Celsius */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">摂氏 (°C)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={celsius}
                  onChange={(e) => updateFromCelsius(parseFloat(e.target.value) || 0)}
                  className="flex-1 font-mono"
                  step="0.1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyTemperature(celsius, "°C")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Fahrenheit */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">華氏 (°F)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={fahrenheit}
                  onChange={(e) => updateFromFahrenheit(parseFloat(e.target.value) || 0)}
                  className="flex-1 font-mono"
                  step="0.1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyTemperature(fahrenheit, "°F")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Kelvin */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">ケルビン (K)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={kelvin}
                  onChange={(e) => updateFromKelvin(parseFloat(e.target.value) || 0)}
                  className="flex-1 font-mono"
                  step="0.1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyTemperature(kelvin, "K")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button 
              onClick={resetValues}
              variant="outline"
              className="w-full"
            >
              リセット
            </Button>
          </CardContent>
        </Card>

        {/* Common Temperatures */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">よく使われる温度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {commonTemperatures.map((temp, index) => (
                <button
                  key={index}
                  onClick={() => updateFromCelsius(temp.celsius)}
                  className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-mikan-50 hover:border-mikan-300 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{temp.name}</span>
                    <div className="text-sm text-gray-600">
                      <span className="font-mono">{temp.celsius}°C</span>
                      <span className="mx-1">|</span>
                      <span className="font-mono">{celsiusToFahrenheit(temp.celsius).toFixed(1)}°F</span>
                      <span className="mx-1">|</span>
                      <span className="font-mono">{celsiusToKelvin(temp.celsius).toFixed(1)}K</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Formula */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">変換式</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">摂氏 → 華氏</h4>
              <p className="font-mono bg-gray-50 p-2 rounded">°F = (°C × 9/5) + 32</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">華氏 → 摂氏</h4>
              <p className="font-mono bg-gray-50 p-2 rounded">°C = (°F - 32) × 5/9</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">摂氏 → ケルビン</h4>
              <p className="font-mono bg-gray-50 p-2 rounded">K = °C + 273.15</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">ケルビン → 摂氏</h4>
              <p className="font-mono bg-gray-50 p-2 rounded">°C = K - 273.15</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
