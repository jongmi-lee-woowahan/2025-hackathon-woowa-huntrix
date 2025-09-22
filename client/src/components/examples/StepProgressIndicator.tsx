import StepProgressIndicator from '../StepProgressIndicator';

export default function StepProgressIndicatorExample() {
  const steps = [
    {
      id: 1,
      title: '고객 세분화',
      description: '타겟 고객 선택',
      status: 'completed' as const
    },
    {
      id: 2,
      title: '성과 분석',
      description: '지표 시각화',
      status: 'active' as const
    },
    {
      id: 3,
      title: '채널 배분',
      description: '마케팅 채널 설정',
      status: 'pending' as const
    }
  ];

  return (
    <div className="p-6">
      <StepProgressIndicator steps={steps} currentStep={2} />
    </div>
  );
}