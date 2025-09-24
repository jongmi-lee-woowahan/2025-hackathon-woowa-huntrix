import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Segment {
  id: string;
  name: string;
  size: number;
  description: string;
  tags: string[];
  selected: boolean;
}

interface CustomerSegmentationProps {
  onSegmentsSelected: (segments: Segment[]) => void;
  isProcessing?: boolean;
}

export default function CustomerSegmentation({ onSegmentsSelected, isProcessing }: CustomerSegmentationProps) {
  const [segments, setSegments] = useState<Segment[]>([
    {
      id: '1',
      name: '젊은 전문직',
      size: 15420,
      description: '25-35세 직장인, 높은 구매력, 디지털 네이티브',
      tags: ['높은소득', '온라인활성', '브랜드충성'],
      selected: false
    },
    {
      id: '2', 
      name: '중년 가족층',
      size: 23150,
      description: '35-50세 가정 주 구매자, 실용성 중시',
      tags: ['가족중심', '실용성', '안정추구'],
      selected: false
    },
    {
      id: '3',
      name: '시니어층',
      size: 8900,
      description: '50세 이상, 신중한 구매 패턴, 품질 중시',
      tags: ['품질중시', '신중구매', '경험중요'],
      selected: false
    },
    {
      id: '4',
      name: 'Z세대',
      size: 19800,
      description: '18-25세, SNS 활용도 높음, 트렌드 민감',
      tags: ['소셜미디어', '트렌드', '개성추구'],
      selected: false
    }
  ]);

  const toggleSegment = (id: string) => {
    setSegments(prev => prev.map(segment => 
      segment.id === id 
        ? { ...segment, selected: !segment.selected }
        : segment
    ));
  };

  const selectedSegments = segments.filter(s => s.selected);

  const handleNext = () => {
    onSegmentsSelected(selectedSegments);
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl pb-2">
            <Users className="h-5 w-5 text-primary" />
            <span>고객 세그먼트 선택</span>
          </CardTitle>
          <p className="text-muted-foreground">
            타겟팅할 고객 그룹을 선택해주세요. 여러 세그먼트를 동시에 선택할 수 있습니다.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {segments.map((segment, index) => (
              <motion.div
                key={segment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover-elevate ${
                    segment.selected 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleSegment(segment.id)}
                  data-testid={`card-segment-${segment.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <span>{segment.name}</span>
                        {segment.selected && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </CardTitle>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {segment.size.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      {segment.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {segment.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {selectedSegments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      선택된 세그먼트: {selectedSegments.length}개
                    </p>
                    <p className="text-sm text-muted-foreground">
                      총 타겟 고객 수: {selectedSegments.reduce((sum, s) => sum + s.size, 0).toLocaleString()}명
                    </p>
                  </div>
                  <Button 
                    onClick={handleNext}
                    disabled={isProcessing}
                    data-testid="button-next-step"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        분석 중...
                      </>
                    ) : (
                      '성과 분석 단계로'
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}