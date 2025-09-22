import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

import CampaignObjectiveInput from './CampaignObjectiveInput';
import StepProgressIndicator from './StepProgressIndicator';
import CustomerSegmentation from './CustomerSegmentation';
import PerformanceMetrics from './PerformanceMetrics';
import ChannelDistribution from './ChannelDistribution';
import AIProcessingIndicator from './AIProcessingIndicator';
import CampaignSummaryModal from './CampaignSummaryModal';

type PipelineStep = 'objective' | 'segmentation' | 'metrics' | 'channels' | 'summary';
type StepStatus = 'pending' | 'active' | 'completed';
type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'error';

interface Segment {
  id: string;
  name: string;
  size: number;
  description: string;
  tags: string[];
  selected: boolean;
}

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

export default function CampaignPipeline() {
  const [currentStep, setCurrentStep] = useState<PipelineStep>('objective');
  const [objective, setObjective] = useState('');
  const [selectedSegments, setSelectedSegments] = useState<Segment[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [aiStatus, setAiStatus] = useState<ProcessingStatus>('idle');
  const [aiMessage, setAiMessage] = useState('');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  
  const steps = [
    {
      id: 1,
      title: '고객 세분화',
      description: '타겟 고객 선택',
      status: getStepStatus('segmentation')
    },
    {
      id: 2,
      title: '성과 분석',
      description: '지표 시각화',
      status: getStepStatus('metrics')
    },
    {
      id: 3,
      title: '채널 배분',
      description: '마케팅 채널 설정',
      status: getStepStatus('channels')
    }
  ];

  function getStepStatus(step: PipelineStep): StepStatus {
    const stepOrder: PipelineStep[] = ['segmentation', 'metrics', 'channels'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  }

  const simulateAIProcessing = (message: string, duration = 2000) => {
    setAiStatus('processing');
    setAiMessage(message);
    
    setTimeout(() => {
      setAiStatus('completed');
      setAiMessage('분석이 완료되었습니다!');
      
      setTimeout(() => {
        setAiStatus('idle');
      }, 1500);
    }, duration);
  };

  const handleObjectiveSet = (newObjective: string) => {
    setObjective(newObjective);
    simulateAIProcessing('AI가 목표를 분석하고 있습니다...');
    setTimeout(() => {
      setCurrentStep('segmentation');
    }, 3500);
  };

  const handleSegmentsSelected = (segments: Segment[]) => {
    setSelectedSegments(segments);
    simulateAIProcessing('선택된 세그먼트의 성과를 예측하고 있습니다...');
    setTimeout(() => {
      setCurrentStep('metrics');
    }, 3500);
  };

  const handleMetricsNext = () => {
    simulateAIProcessing('채널 최적화를 위한 AI 분석 중...');
    setTimeout(() => {
      setCurrentStep('channels');
    }, 3500);
  };

  const handleChannelsConfigured = (configuredChannels: Channel[]) => {
    setChannels(configuredChannels);
    setShowSummaryModal(true);
  };

  const handleCampaignExecute = () => {
    setShowSummaryModal(false);
    simulateAIProcessing('캠페인을 실행하고 있습니다...', 3000);
    // todo: remove mock functionality - integrate with real campaign execution
  };

  const goBack = () => {
    const stepOrder: PipelineStep[] = ['objective', 'segmentation', 'metrics', 'channels'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const canGoBack = currentStep !== 'objective';

  const getCampaignSummaryData = () => ({
    objective,
    segments: selectedSegments.map(s => s.name),
    metrics: {
      expectedCTR: '3.4%',
      expectedConversion: '2.8%',
      expectedROI: '340%'
    },
    channels: channels.map(c => ({
      name: c.name,
      allocation: c.allocation,
      cost: c.cost
    })),
    totalBudget: '₩1.0M',
    expectedRevenue: '₩12.4M'
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground">
            마케팅 캠페인 파이프라인
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI 기반 3단계 마케팅 캠페인 생성 및 최적화 도구
          </p>
        </motion.div>

        {/* Back Button */}
        <AnimatePresence>
          {canGoBack && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mb-6"
            >
              <Button
                variant="outline"
                onClick={goBack}
                className="flex items-center space-x-2"
                data-testid="button-go-back"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>이전 단계</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Processing Indicator */}
        <div className="mb-8">
          <AIProcessingIndicator status={aiStatus} message={aiMessage} />
        </div>

        {/* Campaign Objective Input */}
        <AnimatePresence mode="wait">
          {currentStep === 'objective' && (
            <motion.div
              key="objective"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <CampaignObjectiveInput
                onObjectiveSet={handleObjectiveSet}
                isProcessing={aiStatus === 'processing'}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Progress Indicator */}
        {currentStep !== 'objective' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12"
          >
            <StepProgressIndicator 
              steps={steps} 
              currentStep={['segmentation', 'metrics', 'channels'].indexOf(currentStep) + 1}
            />
          </motion.div>
        )}

        {/* Step Content */}
        <div className="space-y-12">
          <AnimatePresence mode="wait">
            {currentStep === 'segmentation' && (
              <motion.div
                key="segmentation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <CustomerSegmentation
                  onSegmentsSelected={handleSegmentsSelected}
                  isProcessing={aiStatus === 'processing'}
                />
              </motion.div>
            )}

            {currentStep === 'metrics' && (
              <motion.div
                key="metrics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <PerformanceMetrics
                  segmentName={selectedSegments.map(s => s.name).join(', ')}
                />
                <div className="flex justify-center">
                  <Button
                    onClick={handleMetricsNext}
                    disabled={aiStatus === 'processing'}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-metrics-next"
                  >
                    채널 배분 단계로
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === 'channels' && (
              <motion.div
                key="channels"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ChannelDistribution
                  onChannelsConfigured={handleChannelsConfigured}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Campaign Summary Modal */}
        <CampaignSummaryModal
          open={showSummaryModal}
          onClose={() => setShowSummaryModal(false)}
          onExecute={handleCampaignExecute}
          campaignData={getCampaignSummaryData()}
        />
      </div>
    </div>
  );
}