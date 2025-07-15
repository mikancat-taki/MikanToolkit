import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Download, RotateCcw, Monitor, Square, Maximize } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type CaptureMode = "screen" | "window" | "area";

export default function ScreenCapture() {
  const [captureMode, setCaptureMode] = useState<CaptureMode>("screen");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const startCapture = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      toast({
        title: "エラー",
        description: "画面キャプチャがサポートされていません",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCapturing(true);
      
      const constraints: MediaStreamConstraints = {
        video: {
          mediaSource: captureMode === "screen" ? "screen" : "window"
        } as MediaTrackConstraints
      };

      const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      
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
            
            // Convert to data URL
            const dataURL = canvas.toDataURL('image/png');
            setCapturedImage(dataURL);
            
            toast({
              title: "キャプチャ完了",
              description: "画面のキャプチャが完了しました",
              variant: "success"
            });
          }
        }
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        setIsCapturing(false);
      };
    } catch (error) {
      toast({
        title: "キャプチャエラー",
        description: "画面キャプチャに失敗しました",
        variant: "destructive"
      });
      setIsCapturing(false);
    }
  };

  const downloadImage = () => {
    if (!capturedImage) return;
    
    const link = document.createElement('a');
    link.download = `screen-capture-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
    link.href = capturedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "ダウンロード完了",
      description: "画像がダウンロードされました",
      variant: "success"
    });
  };

  const resetCapture = () => {
    setCapturedImage(null);
  };

  const getCaptureIcon = () => {
    switch (captureMode) {
      case "screen":
        return <Monitor className="h-4 w-4" />;
      case "window":
        return <Maximize className="h-4 w-4" />;
      case "area":
        return <Square className="h-4 w-4" />;
      default:
        return <Camera className="h-4 w-4" />;
    }
  };

  const getCaptureModeText = () => {
    switch (captureMode) {
      case "screen":
        return "画面全体";
      case "window":
        return "ウィンドウ";
      case "area":
        return "選択範囲";
      default:
        return "画面全体";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tool Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-mikan-400 to-mikan-500 rounded-lg flex items-center justify-center">
            <Camera className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">スクリーンキャプチャ</h1>
            <p className="text-gray-600">画面のスクリーンショットを撮影してダウンロードできます</p>
          </div>
        </div>
      </div>

      {/* Capture Controls */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">キャプチャモード:</label>
              <Select value={captureMode} onValueChange={(value) => setCaptureMode(value as CaptureMode)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="screen">画面全体</SelectItem>
                  <SelectItem value="window">ウィンドウ</SelectItem>
                  <SelectItem value="area">選択範囲</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-2 ml-auto">
              <Button 
                onClick={startCapture}
                disabled={isCapturing}
                className="bg-mikan-600 hover:bg-mikan-700"
              >
                {getCaptureIcon()}
                <span className="ml-2">
                  {isCapturing ? "キャプチャ中..." : `${getCaptureModeText()}をキャプチャ`}
                </span>
              </Button>
              
              {capturedImage && (
                <>
                  <Button 
                    onClick={downloadImage}
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    ダウンロード
                  </Button>
                  <Button 
                    onClick={resetCapture}
                    variant="outline"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    リセット
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Captured Image Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">キャプチャ結果</CardTitle>
        </CardHeader>
        <CardContent>
          {capturedImage ? (
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src={capturedImage} 
                  alt="Captured screen" 
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={downloadImage}
                  className="bg-mikan-600 hover:bg-mikan-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PNG形式でダウンロード
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">キャプチャされた画像はここに表示されます</p>
              <p className="text-gray-400 text-sm">
                上の「キャプチャ」ボタンをクリックしてスクリーンショットを撮影してください
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">使用方法</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">キャプチャモード</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• <strong>画面全体:</strong> モニター全体をキャプチャ</li>
                <li>• <strong>ウィンドウ:</strong> 特定のウィンドウをキャプチャ</li>
                <li>• <strong>選択範囲:</strong> 画面の一部を選択してキャプチャ</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">操作手順</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• 1. キャプチャモードを選択</li>
                <li>• 2. 「キャプチャ」ボタンをクリック</li>
                <li>• 3. ブラウザの画面共有許可を承認</li>
                <li>• 4. キャプチャしたい画面またはウィンドウを選択</li>
                <li>• 5. 「ダウンロード」ボタンで画像を保存</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>注意:</strong> この機能を使用するには、ブラウザが画面共有APIをサポートしている必要があります。
              また、HTTPSまたはlocalhostでのアクセスが必要です。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
