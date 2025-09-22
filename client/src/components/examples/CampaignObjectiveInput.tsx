import CampaignObjectiveInput from '../CampaignObjectiveInput';

export default function CampaignObjectiveInputExample() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <CampaignObjectiveInput 
        onObjectiveSet={(objective) => console.log('Campaign objective set:', objective)}
        isProcessing={false}
      />
    </div>
  );
}