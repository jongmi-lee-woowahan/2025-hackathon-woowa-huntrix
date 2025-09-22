import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export type StepStatus = 'pending' | 'active' | 'completed';

interface Step {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
}

interface StepProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepProgressIndicator({ steps, currentStep }: StepProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto py-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex flex-col items-center space-y-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                step.status === 'completed' 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : step.status === 'active'
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'bg-background border-muted-foreground/30 text-muted-foreground'
              }`}
            >
              {step.status === 'completed' ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <Circle className={`h-6 w-6 ${step.status === 'active' ? 'fill-current' : ''}`} />
              )}
              {step.status === 'active' && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </motion.div>
            <div className="text-center space-y-1">
              <h3 className={`text-sm font-semibold ${
                step.status === 'active' ? 'text-primary' : 
                step.status === 'completed' ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground max-w-24">
                {step.description}
              </p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 mx-4">
              <motion.div
                className={`h-0.5 rounded-full transition-all duration-500 ${
                  steps[index + 1].status === 'completed' || 
                  (steps[index + 1].status === 'active' && step.status === 'completed')
                    ? 'bg-primary' 
                    : 'bg-muted-foreground/20'
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: currentStep > index ? 1 : 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}