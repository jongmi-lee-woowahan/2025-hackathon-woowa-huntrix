import { useState, useEffect } from 'react';
import AIProcessingIndicator, { ProcessingStatus } from '../AIProcessingIndicator';

export default function AIProcessingIndicatorExample() {
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [progress, setProgress] = useState(0);

  const statuses: { status: ProcessingStatus; message: string }[] = [
    { status: 'idle', message: 'AI 대기 중...' },
    { status: 'processing', message: '고객 데이터 분석 중...' },
    { status: 'completed', message: '분석 완료!' },
    { status: 'error', message: '오류가 발생했습니다.' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(prev => {
        const currentIndex = statuses.findIndex(s => s.status === prev);
        const nextIndex = (currentIndex + 1) % statuses.length;
        return statuses[nextIndex].status;
      });
      
      if (status === 'processing') {
        setProgress(prev => (prev + 10) % 100);
      } else {
        setProgress(0);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [status]);

  const currentMessage = statuses.find(s => s.status === status)?.message || '';

  return (
    <div className="p-6 max-w-md mx-auto">
      <AIProcessingIndicator 
        status={status}
        message={currentMessage}
        progress={status === 'processing' ? progress : 0}
      />
    </div>
  );
}