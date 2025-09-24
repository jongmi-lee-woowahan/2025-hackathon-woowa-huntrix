import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, MousePointer, DollarSign, Target, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricData {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  description: string;
  icon: any;
  color: string;
}

interface PerformanceMetricsProps {
  segmentName?: string;
}

export default function PerformanceMetrics({ segmentName = "선택된 세그먼트" }: PerformanceMetricsProps) {
  const metrics: MetricData[] = [
    {
      id: 'ctr',
      title: '클릭률 (CTR)',
      value: '3.4%',
      change: 12.5,
      changeType: 'increase',
      description: '예상 광고 클릭률',
      icon: MousePointer,
      color: 'text-chart-1'
    },
    {
      id: 'conversion',
      title: '전환율',
      value: '2.8%',
      change: 8.2,
      changeType: 'increase',
      description: '예상 구매 전환율',
      icon: Target,
      color: 'text-chart-2'
    },
    {
      id: 'roi',
      title: '투자 수익률 (ROI)',
      value: '340%',
      change: -5.1,
      changeType: 'decrease',
      description: '예상 마케팅 ROI',
      icon: DollarSign,
      color: 'text-chart-3'
    },
    {
      id: 'reach',
      title: '도달률',
      value: '85.2%',
      change: 15.8,
      changeType: 'increase',
      description: '타겟 고객 도달률',
      icon: BarChart3,
      color: 'text-chart-4'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl pb-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>예상 성과 지표</span>
          </CardTitle>
          <p className="text-muted-foreground">
            {segmentName}의 예상 마케팅 성과를 확인해보세요.
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const TrendIcon = metric.changeType === 'increase' ? TrendingUp : TrendingDown;
          const trendColor = metric.changeType === 'increase' ? 'text-green-500' : 'text-red-500';
          
          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="border-0 bg-card/50 backdrop-blur-sm hover-elevate transition-all duration-300"
                data-testid={`card-metric-${metric.id}`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <IconComponent className={`h-4 w-4 ${metric.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-foreground">
                      {metric.value}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary"
                        className={`flex items-center space-x-1 ${trendColor}`}
                      >
                        <TrendIcon className="h-3 w-3" />
                        <span className="text-xs">
                          {Math.abs(metric.change)}%
                        </span>
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {metric.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-foreground">
                전체 예상 성과
              </h4>
              <p className="text-sm text-muted-foreground">
                선택된 세그먼트 기준 월간 예상치
              </p>
            </div>
            <div className="text-right space-y-1">
              <div className="text-2xl font-bold text-primary">
                ₩12.4M
              </div>
              <div className="text-sm text-muted-foreground">
                예상 수익
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}