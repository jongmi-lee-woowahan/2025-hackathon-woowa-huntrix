import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Target, Users, BarChart3, Share2, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

interface CampaignData {
  objective: string;
  segments: string[];
  metrics: {
    expectedCTR: string;
    expectedConversion: string;
    expectedROI: string;
  };
  channels: {
    name: string;
    allocation: number;
    cost: string;
  }[];
  totalBudget: string;
  expectedRevenue: string;
}

interface CampaignSummaryModalProps {
  open: boolean;
  onClose: () => void;
  onExecute: () => void;
  campaignData: CampaignData;
}

export default function CampaignSummaryModal({ open, onClose, onExecute, campaignData }: CampaignSummaryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-2xl">
            <Rocket className="h-6 w-6 text-primary" />
            <span>캠페인 실행 확인</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Campaign Objective */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Target className="h-5 w-5 text-primary" />
                  <span>캠페인 목표</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  {campaignData.objective}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Target Segments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Users className="h-5 w-5 text-primary" />
                  <span>타겟 세그먼트</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {campaignData.segments.map((segment) => (
                    <Badge 
                      key={segment} 
                      variant="secondary"
                      className="flex items-center space-x-1"
                    >
                      <CheckCircle className="h-3 w-3" />
                      <span>{segment}</span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>예상 성과</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {campaignData.metrics.expectedCTR}
                    </div>
                    <div className="text-sm text-muted-foreground">클릭률</div>
                  </div>
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {campaignData.metrics.expectedConversion}
                    </div>
                    <div className="text-sm text-muted-foreground">전환율</div>
                  </div>
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {campaignData.metrics.expectedROI}
                    </div>
                    <div className="text-sm text-muted-foreground">ROI</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Channel Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Share2 className="h-5 w-5 text-primary" />
                  <span>채널 배분</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {campaignData.channels.map((channel) => (
                    <div key={channel.name} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <span className="font-medium text-foreground">{channel.name}</span>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{channel.allocation}%</Badge>
                        <span className="text-sm font-medium text-primary">{channel.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Budget Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-0 bg-primary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      총 마케팅 예산
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      월간 예산 배정
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-3xl font-bold text-primary">
                      {campaignData.totalBudget}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      예상 수익: {campaignData.expectedRevenue}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} data-testid="button-cancel-execution">
            취소
          </Button>
          <Button 
            onClick={onExecute}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-execute-campaign"
          >
            <Rocket className="h-4 w-4 mr-2" />
            캠페인 실행
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}