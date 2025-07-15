import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pipette, Copy, Palette, Target } from "lucide-react";
import { hexToRgb, rgbToHex, copyToClipboard } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState("#ff6b35");
  const [hexInput, setHexInput] = useState("#ff6b35");
  const [rgbValues, setRgbValues] = useState({ r: 255, g: 107, b: 53 });
  const [hslValues, setHslValues] = useState({ h: 19, s: 100, l: 60 });
  const [isPickingColor, setIsPickingColor] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const updateColorValues = (hex: string) => {
    setSelectedColor(hex);
    setHexInput(hex);
    
    const rgb = hexToRgb(hex);
    if (rgb) {
      setRgbValues(rgb);
      
      // Convert RGB to HSL
      const r = rgb.r / 255;
      const g = rgb.g / 255;
      const b = rgb.b / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const diff = max - min;
      
      let h = 0;
      if (diff !== 0) {
        switch (max) {
          case r: h = ((g - b) / diff) % 6; break;
          case g: h = (b - r) / diff + 2; break;
          case b: h = (r - g) / diff + 4; break;
        }
      }
      h = Math.round(h * 60);
      if (h < 0) h += 360;
      
      const l = (max + min) / 2;
      const s = diff === 0 ? 0 : diff / (1 - Math.abs(2 * l - 1));
      
      setHslValues({
        h: h,
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      });
    }
  };

  const handleHexChange = (value: string) => {
    setHexInput(value);
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      updateColorValues(value);
    }
  };

  const handleRgbChange = (component: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgbValues, [component]: value };
    setRgbValues(newRgb);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    updateColorValues(hex);
  };

  const copyColor = async (format: 'hex' | 'rgb' | 'hsl') => {
    let text = "";
    switch (format) {
      case 'hex':
        text = selectedColor;
        break;
      case 'rgb':
        text = `rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})`;
        break;
      case 'hsl':
        text = `hsl(${hslValues.h}, ${hslValues.s}%, ${hslValues.l}%)`;
        break;
    }
    
    try {
      await copyToClipboard(text);
      toast({
        title: "コピー完了",
        description: `${format.toUpperCase()}値をクリップボードにコピーしました`,
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

  const handleScreenCapture = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      toast({
        title: "エラー",
        description: "画面キャプチャがサポートされていません",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsPickingColor(true);
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' }
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.onloadedmetadata = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            
            canvas.style.display = 'block';
            canvas.style.cursor = 'crosshair';
            
            const handleCanvasClick = (e: MouseEvent) => {
              const rect = canvas.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              
              // Scale coordinates to canvas size
              const scaleX = canvas.width / rect.width;
              const scaleY = canvas.height / rect.height;
              
              const imageData = ctx.getImageData(x * scaleX, y * scaleY, 1, 1);
              const pixel = imageData.data;
              
              const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
              updateColorValues(hex);
              
              canvas.removeEventListener('click', handleCanvasClick);
              canvas.style.display = 'none';
              setIsPickingColor(false);
              
              stream.getTracks().forEach(track => track.stop());
              
              toast({
                title: "色を取得しました",
                description: `選択した色: ${hex}`,
                variant: "success"
              });
            };
            
            canvas.addEventListener('click', handleCanvasClick);
          }
        }
      };
    } catch (error) {
      toast({
        title: "キャプチャエラー",
        description: "画面キャプチャに失敗しました",
        variant: "destructive"
      });
      setIsPickingColor(false);
    }
  };

  const colorPalette = [
    "#ff6b35", "#f7931e", "#ffd700", "#90ee90", "#00ced1",
    "#4169e1", "#8a2be2", "#dc143c", "#ff1493", "#32cd32",
    "#ff4500", "#daa520", "#8b4513", "#2f4f4f", "#800080"
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tool Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-mikan-400 to-mikan-500 rounded-lg flex items-center justify-center">
            <Pipette className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">カラーピッカー</h1>
            <p className="text-gray-600">画面上の色を取得し、カラーコードを確認できます</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Display */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">選択した色</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="w-full h-48 rounded-lg border-2 border-gray-200 mb-4 shadow-inner"
              style={{ backgroundColor: selectedColor }}
            />
            
            <div className="flex space-x-2 mb-4">
              <Button 
                onClick={handleScreenCapture}
                disabled={isPickingColor}
                className="flex-1 bg-mikan-600 hover:bg-mikan-700"
              >
                <Target className="h-4 w-4 mr-2" />
                {isPickingColor ? "画面をクリック" : "画面から色を取得"}
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Label className="w-12 text-sm font-medium">HEX:</Label>
                <Input 
                  value={hexInput}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="flex-1 font-mono"
                  placeholder="#000000"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyColor('hex')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Label className="w-12 text-sm font-medium">RGB:</Label>
                <div className="flex-1 flex space-x-1">
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={rgbValues.r}
                    onChange={(e) => handleRgbChange('r', parseInt(e.target.value) || 0)}
                    className="w-16 font-mono text-center"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={rgbValues.g}
                    onChange={(e) => handleRgbChange('g', parseInt(e.target.value) || 0)}
                    className="w-16 font-mono text-center"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={rgbValues.b}
                    onChange={(e) => handleRgbChange('b', parseInt(e.target.value) || 0)}
                    className="w-16 font-mono text-center"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyColor('rgb')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Label className="w-12 text-sm font-medium">HSL:</Label>
                <div className="flex-1 font-mono text-sm py-2">
                  {hslValues.h}°, {hslValues.s}%, {hslValues.l}%
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyColor('hsl')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              カラーパレット
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {colorPalette.map((color, index) => (
                <button
                  key={index}
                  className={`w-12 h-12 rounded-lg border-2 hover:scale-110 transition-transform ${
                    selectedColor === color ? 'border-gray-400' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateColorValues(color)}
                  title={color}
                />
              ))}
            </div>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">カラーピッカー</Label>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => updateColorValues(e.target.value)}
                  className="w-full h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                />
              </div>
              
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <p className="font-medium mb-1">使用方法:</p>
                <ul className="space-y-1 text-xs">
                  <li>• 「画面から色を取得」をクリックして画面キャプチャ</li>
                  <li>• 取得したい色の部分をクリック</li>
                  <li>• カラーパレットまたは入力フィールドで色を選択</li>
                  <li>• コピーボタンで各フォーマットの値をコピー</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Hidden canvas for color picking */}
      <canvas
        ref={canvasRef}
        className="hidden fixed inset-0 z-50 w-full h-full"
        style={{ display: 'none' }}
      />
    </div>
  );
}
