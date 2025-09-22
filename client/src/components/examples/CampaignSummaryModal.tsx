import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CampaignSummaryModal from '../CampaignSummaryModal';

export default function CampaignSummaryModalExample() {
  const [open, setOpen] = useState(false);

  const mockData = {
    objective: "신제품 런칭을 위한 브랜드 인지도 향상 및 초기 고객 확보를 통해 시장 점유율을 확대하고, 타겟 고객층에게 제품의 가치를 효과적으로 전달하여 지속 가능한 성장 기반을 마련합니다.",
    segments: ["젊은 전문직", "Z세대"],
    metrics: {
      expectedCTR: "3.4%",
      expectedConversion: "2.8%",
      expectedROI: "340%"
    },
    channels: [
      { name: "소셜미디어", allocation: 35, cost: "₩350K" },
      { name: "모바일 광고", allocation: 25, cost: "₩250K" },
      { name: "검색 광고", allocation: 20, cost: "₩200K" },
      { name: "이메일 마케팅", allocation: 15, cost: "₩150K" },
      { name: "메신저", allocation: 5, cost: "₩50K" }
    ],
    totalBudget: "₩1.0M",
    expectedRevenue: "₩12.4M"
  };

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>
        캠페인 요약 보기
      </Button>
      <CampaignSummaryModal
        open={open}
        onClose={() => setOpen(false)}
        onExecute={() => {
          console.log('Campaign executed!');
          setOpen(false);
        }}
        campaignData={mockData}
      />
    </div>
  );
}