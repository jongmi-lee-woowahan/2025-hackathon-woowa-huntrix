import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Share2, Smartphone, Mail, Search, MessageCircle, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Channel {
  id: string;
  name: string;
  icon: any;
  affinity: number;
  allocation: number;
  cost: string;
  reach: string;
  color: string;
}

interface ChannelDistributionProps {
  onChannelsConfigured: (channels: Channel[]) => void;
  budget?: number;
}

export default function ChannelDistribution({ onChannelsConfigured, budget = 1000000 }: ChannelDistributionProps) {
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: 'social',
      name: '소셜미디어',
      icon: Share2,
      affinity: 85,
      allocation: 35,
      cost: '₩350K',
      reach: '45.2K',
      color: 'text-chart-1'
    },
    {
      id: 'mobile',
      name: '모바일 광고',
      icon: Smartphone,
      affinity: 78,
      allocation: 25,
      cost: '₩250K',
      reach: '38.8K',
      color: 'text-chart-2'
    },
    {
      id: 'email',
      name: '이메일 마케팅',
      icon: Mail,
      affinity: 62,
      allocation: 15,
      cost: '₩150K',
      reach: '25.5K',
      color: 'text-chart-3'
    },
    {
      id: 'search',
      name: '검색 광고',
      icon: Search,
      affinity: 91,
      allocation: 20,
      cost: '₩200K',
      reach: '42.1K',
      color: 'text-chart-4'
    },
    {
      id: 'messaging',
      name: '메신저',
      icon: MessageCircle,
      affinity: 55,
      allocation: 5,
      cost: '₩50K',
      reach: '15.2K',
      color: 'text-chart-5'
    }
  ]);

  const updateAllocation = (channelId: string, newAllocation: number) => {
    const totalOther = channels
      .filter(c => c.id !== channelId)
      .reduce((sum, c) => sum + c.allocation, 0);
    
    if (totalOther + newAllocation <= 100) {
      setChannels(prev => prev.map(channel => 
        channel.id === channelId 
          ? { 
              ...channel, 
              allocation: newAllocation,
              cost: `₩${(budget * newAllocation / 100 / 1000).toFixed(0)}K`,
              reach: `${((budget * newAllocation / 100) / 25).toFixed(1)}K`
            }
          : channel
      ));
    }
  };

  const totalAllocation = channels.reduce((sum, c) => sum + c.allocation, 0);

  const handleNext = () => {
    onChannelsConfigured(channels);
  };

  const getAffinityColor = (affinity: number) => {
    if (affinity >= 80) return 'text-green-500';
    if (affinity >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl pb-2">
            <Share2 className="h-5 w-5 text-primary" />
            <span>마케팅 채널 배분</span>
          </CardTitle>
          <p className="text-muted-foreground">
            고객 선호도를 기반으로 마케팅 예산을 채널별로 배분해보세요.
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {channels.map((channel, index) => {
          const IconComponent = channel.icon;
          
          return (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`h-5 w-5 ${channel.color}`} />
                        <div>
                          <h4 className="font-semibold text-foreground">{channel.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            고객 선호도: 
                            <span className={`ml-1 font-medium ${getAffinityColor(channel.affinity)}`}>
                              {channel.affinity}%
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="secondary" className="text-xs">
                          {channel.cost}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          도달: {channel.reach}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">예산 배분</span>
                        <span className="font-medium text-foreground">{channel.allocation}%</span>
                      </div>
                      <Slider
                        value={[channel.allocation]}
                        onValueChange={(value) => updateAllocation(channel.id, value[0])}
                        max={100}
                        step={5}
                        className="w-full"
                        data-testid={`slider-${channel.id}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-foreground">
                총 예산 배분
              </h4>
              <p className="text-sm text-muted-foreground">
                전체 예산: ₩{(budget / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="text-right space-y-1">
              <div className={`text-2xl font-bold ${totalAllocation === 100 ? 'text-green-500' : 'text-yellow-500'}`}>
                {totalAllocation}%
              </div>
              <div className="text-sm text-muted-foreground">
                {totalAllocation === 100 ? '완료' : `${100 - totalAllocation}% 남음`}
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {totalAllocation === 100 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-border"
              >
                <Button 
                  onClick={handleNext}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-finalize-campaign"
                >
                  캠페인 최종 확인
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}