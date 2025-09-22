import ChannelDistribution from '../ChannelDistribution';

export default function ChannelDistributionExample() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ChannelDistribution 
        onChannelsConfigured={(channels) => console.log('Channels configured:', channels)}
        budget={1000000}
      />
    </div>
  );
}