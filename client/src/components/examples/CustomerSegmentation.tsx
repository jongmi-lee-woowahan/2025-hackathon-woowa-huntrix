import CustomerSegmentation from '../CustomerSegmentation';

export default function CustomerSegmentationExample() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <CustomerSegmentation 
        onSegmentsSelected={(segments) => console.log('Selected segments:', segments)}
        isProcessing={false}
      />
    </div>
  );
}