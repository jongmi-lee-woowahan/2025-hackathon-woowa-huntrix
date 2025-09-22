import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Target, Sparkles } from 'lucide-react';

interface CampaignObjectiveInputProps {
  onObjectiveSet: (objective: string) => void;
  isProcessing?: boolean;
}

export default function CampaignObjectiveInput({ onObjectiveSet, isProcessing }: CampaignObjectiveInputProps) {
  const [objective, setObjective] = useState('');

  const handleSubmit = () => {
    if (objective.trim()) {
      onObjectiveSet(objective.trim());
    }
  };

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-semibold text-foreground">
            캠페인 목표 설정
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            마케팅 캠페인의 주요 목표를 입력해주세요
          </label>
          <Textarea
            data-testid="input-campaign-objective"
            placeholder="예: 신제품 런칭을 위한 브랜드 인지도 향상 및 초기 고객 확보..."
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="min-h-[120px] bg-background/50 border-input focus:ring-primary/30"
            rows={4}
          />
        </div>
        <Button 
          data-testid="button-set-objective"
          onClick={handleSubmit}
          disabled={!objective.trim() || isProcessing}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 animate-spin" />
              <span>AI가 분석 중...</span>
            </div>
          ) : (
            '다음 단계로 진행'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}