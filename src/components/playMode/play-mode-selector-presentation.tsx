import { Keyboard, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export type PlayMode = 'keyboard' | 'touch';

interface PlayModeSelectorPresentationProps {
  onSelectMode: (mode: PlayMode) => void;
}

export function PlayModeSelectorPresentation({
  onSelectMode,
}: PlayModeSelectorPresentationProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-800">PP Karuta</h1>
          <p className="text-lg text-gray-600">入力方式を選択してください</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Keyboard Mode */}
          <Card className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader>
              <div className="mb-4 flex justify-center">
                <Keyboard className="h-16 w-16 text-indigo-600" />
              </div>
              <CardTitle className="text-center text-2xl">Keyboard</CardTitle>
              <CardDescription className="text-center">
                PC環境向け
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-center text-sm text-gray-600">
                ショートカットキーで操作します。共通のTatamiエリアを使用し、各プレイヤーに専用のキーバインドを割り当てます。
              </p>
              <Button
                onClick={() => onSelectMode('keyboard')}
                className="w-full"
                size="lg"
              >
                Keyboardで開始
              </Button>
            </CardContent>
          </Card>

          {/* Touch Mode */}
          <Card className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader>
              <div className="mb-4 flex justify-center">
                <Smartphone className="h-16 w-16 text-purple-600" />
              </div>
              <CardTitle className="text-center text-2xl">Touch</CardTitle>
              <CardDescription className="text-center">
                モバイル/タブレット向け
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-center text-sm text-gray-600">
                タップで操作します。各プレイヤーに専用のTatamiエリアを表示し、自分のエリアのみタップ可能です。
              </p>
              <Button
                onClick={() => onSelectMode('touch')}
                className="w-full"
                size="lg"
              >
                Touchで開始
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
