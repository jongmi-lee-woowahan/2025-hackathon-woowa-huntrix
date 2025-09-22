import { motion } from 'framer-motion';
import { Sparkles, Brain, Zap, CheckCircle } from 'lucide-react';

export type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'error';

interface AIProcessingIndicatorProps {
  status: ProcessingStatus;
  message: string;
  progress?: number;
}

export default function AIProcessingIndicator({ status, message, progress = 0 }: AIProcessingIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          icon: Sparkles,
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          pulseColor: 'bg-primary/20'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          pulseColor: 'bg-green-500/20'
        };
      case 'error':
        return {
          icon: Zap,
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          pulseColor: 'bg-red-500/20'
        };
      default:
        return {
          icon: Brain,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          pulseColor: 'bg-muted/20'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  if (status === 'idle') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center space-x-3 p-4 rounded-lg bg-card/50 border border-border"
      data-testid={`ai-indicator-${status}`}
    >
      <div className={`relative p-2 rounded-full ${config.bgColor}`}>
        <IconComponent 
          className={`h-4 w-4 ${config.color} ${status === 'processing' ? 'animate-pulse' : ''}`} 
        />
        {status === 'processing' && (
          <motion.div
            className={`absolute inset-0 rounded-full ${config.pulseColor}`}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}
      </div>
      
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium text-foreground">
          {message}
        </p>
        {status === 'processing' && progress > 0 && (
          <div className="w-full bg-muted/20 rounded-full h-1">
            <motion.div
              className="bg-primary h-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
      </div>
      
      {status === 'processing' && (
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}