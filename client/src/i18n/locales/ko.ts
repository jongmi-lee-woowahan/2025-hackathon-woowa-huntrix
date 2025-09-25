export default {
  // Common
  common: {
    next: '다음',
    previous: '이전',
    cancel: '취소',
    confirm: '확인',
    execute: '실행',
    close: '닫기',
    loading: '로딩 중...',
    error: '오류',
    success: '성공',
    retry: '재시도',
    comingSoon: '준비 중'
  },

  // Navigation & Steps
  navigation: {
    previousStep: '이전 단계',
    campaignObjectiveSetting: '캠페인 목표 설정',
    customerSegmentation: '고객 세분화',
    performanceAnalysis: '성과 분석',
    channelDistribution: '채널 분배',
    finalCampaignReview: '최종 캠페인 검토'
  },

  // Campaign Objective
  objective: {
    title: '캠페인 목표 설정',
    label: '캠페인 목표',
    placeholder: '캠페인 목표와 타겟 고객에 대해 자세히 설명해주세요...',
    aiAnalyzing: 'AI가 분석 중...',
    button: 'AI 분석'
  },

  // Customer Segmentation
  segmentation: {
    title: '고객 세그먼트 선택',
    subtitle: 'AI가 분석한 고객 세그먼트에서 캠페인 목표에 가장 적합한 타겟 그룹을 선택하세요. 각 세그먼트의 특성과 규모를 검토할 수 있습니다.',
    selectedSegments: '선택된 세그먼트',
    totalTargetCustomers: '총 타겟 고객',
    people: '명',
    goToPerformanceAnalysis: '성과 분석으로 이동',
    analyzing: '분석 중...',
    noTagsAvailable: '이 세그먼트에 사용 가능한 태그가 없습니다',
    more: '개 더'
  },

  // Performance Metrics
  metrics: {
    title: '전체 예상 성과',
    subtitle: '선택한 고객 세그먼트의 예상 성과 지표를 검토하세요. CTR, 전환율, ROI 등 주요 지표를 통해 캠페인 성과를 예측하세요.',
    conversionRate: '전환율',
    conversionDesc: '타겟 세그먼트의 예상 전환율',
    targetRevisitRate: '타겟 재방문수',
    targetRevisitDesc: '예상 고객 재방문 빈도',
    profitability: '수익성',
    profitabilityDesc: '고객당 예상 수익',
    selectedTargetSegment: '선택된 타겟 세그먼트',
    performanceMetricsInfo: '위의 성과 지표는 선택된 세그먼트 분석을 바탕으로 합니다.',
    goToChannelDistribution: '채널 분배로 이동'
  },

  // Channel Distribution
  channels: {
    title: '마케팅 채널 분배',
    subtitle: '예상되는 고객 선호도를 바탕으로 채널 간 마케팅 예산을 분배하세요.',
    subtitle2: 'AI가 최적화한 마케팅 채널 간 예산 배분을 검토하세요. 각 채널의 특성과 예상 성과를 바탕으로 최적 분배가 제안됩니다.',
    channelDataError: '채널 데이터 오류',
    viewOriginalResponse: '원본 응답 데이터 보기',
    aiAnalyzing: 'AI가 최적화된 채널 분배를 분석하고 있습니다...',
    marketingChannelRatio: '마케팅 채널 비율',
    reach: '도달',
    channelBudgetComplete: '채널 예산 분배 완료',
    totalExpectedCost: '총 예상 비용',
    channels: '채널',
    totalPeopleReached: '총 {count}명에게 도달',
    finalCampaignReview: '최종 캠페인 검토',
    
    // Channel names
    names: {
      socialMedia: '소셜미디어',
      mobile: '모바일',
      mobileAds: '모바일 광고',
      email: '이메일',
      emailMarketing: '이메일 마케팅',
      search: '검색',
      searchAds: '검색 광고',
      messenger: '메신저',
      pushNotifications: '푸시 알림',
      inAppMessages: '인앱 메시지',
      sms: '문자',
      textMessage: '문자 메시지'
    },

    // Channel descriptions
    descriptions: {
      pushNotifications: '적시에 푸시 알림을 통해 사용자의 즉각적인 행동을 유도하고 앱 리텐션을 높입니다.',
      inAppMessages: '앱 내에서 개인화된 메시지를 전달하여 사용자 행동을 유도하고 참여도를 높입니다.',
      messenger: '메시징 플랫폼을 통해 고객과 직접 소통하고 지원을 제공합니다.',
      email: '프로모션, 업데이트, 뉴스레터를 위한 타겟팅된 이메일 캠페인으로 고객에게 도달합니다.',
      emailMarketing: '리드를 육성하고 전환을 유도하는 종합적인 이메일 마케팅 캠페인입니다.',
      sms: '긴급 알림, 프로모션, 빠른 업데이트를 위한 직접적인 문자 메시지를 전송합니다.',
      textMessage: '즉각적인 커뮤니케이션과 임팩트 높은 마케팅을 위한 직접 문자 메시지입니다.',
      socialMedia: '소셜 플랫폼을 활용하여 브랜드 인지도를 구축하고 고객과 소통합니다.',
      mobile: '다양한 모바일 채널에서 모바일 사용자를 위한 마케팅 활동을 최적화합니다.',
      mobileAds: '모바일 기기와 앱에서 타겟팅된 광고를 표시합니다.',
      search: '관련 제품이나 서비스를 적극적으로 검색하는 사용자를 포착합니다.',
      searchAds: '검색 엔진에서 타겟팅 광고 캠페인을 실행하여 qualified 트래픽을 유도합니다.',
      default: '더 나은 고객 참여와 전환율을 위해 마케팅 채널을 최적화합니다.'
    }
  },

  // Campaign Summary
  summary: {
    title: '캠페인 실행 확인',
    
    // Campaign Overview
    overview: {
      title: '캠페인 개요',
      objective: '캠페인 목표',
      targetSegments: '타겟 세그먼트'
    },
    
    // Performance Metrics
    metrics: {
      title: '예상 성과 지표',
      targetRevisitRate: '타겟 재방문수',
      conversionRate: '전환율',
      profitability: '수익성',
      days: '일'
    },
    
    // Channel Distribution
    channels: {
      title: '채널 분배'
    },
    
    // Budget Summary
    budget: {
      title: '총 마케팅 예산',
      monthlyBudgetAllocation: '월간 예산 배정',
      expectedRevenue: '예상 수익'
    },
    
    // Execution
    execution: {
      startingExecution: '캠페인 실행을 시작합니다...',
      executingBasicCampaign: '기본 캠페인 실행 중...',
      basicCampaignCompleted: '기본 캠페인 실행 완료. 세그먼트 생성 중...',
      allTasksCompleted: '모든 작업 완료!',
      executionSuccessful: '캠페인 실행 성공!',
      executionStarted: '캠페인 실행이 성공적으로 시작되었습니다.',
      executionFailed: '캠페인 실행 실패'
    }
  },

  // AI Processing
  ai: {
    analyzing: 'AI가 캠페인을 분석하고 있습니다... (최대 2분 소요)',
    analyzing2: 'AI가 선택된 세그먼트의 성과를 분석하고 있습니다...',
    analyzing3: '채널 최적화를 위한 AI 분석이 진행 중입니다...',
    analysisCompleted: '분석 완료!',
    analyticsAnalysisCompleted: '분석 완료!',
    channelOptimizationCompleted: '채널 최적화 완료!',
    connectionIssue: 'AI 서버 연결에 문제가 있습니다. 나중에 다시 시도해주세요.',
    errorOccurred: '채널 최적화 중 오류가 발생했습니다.'
  },

  // App Header
  app: {
    title: 'SegMA',
    subtitle: 'Segmentum Marketing Agent'
  },

  // Labels translation
  labels: {
    // Customer segment labels
    'Non-Subscriber': '비구독자',
    'Young Spender': '젊은 소비자',
    'High Basket Value': '고액 구매자',
    'Young & Frequent': '젊고 활발한 고객',
    'Recently Active': '최근 활성 고객',
    'Young & Lapsing': '젊은 이탈 고객',
    'Needs Reactivation': '재활성화 필요',
    'High-Value': '고가치 고객',
    'Frequent User': '빈번한 사용자',
    'Premium Customer': '프리미엄 고객',
    'Loyal Customer': '충성 고객',
    'New Customer': '신규 고객',
    'Potential Churner': '이탈 가능 고객',
    'Active User': '활성 사용자',
    'Inactive User': '비활성 사용자',
    // Channel labels
    'Cost-Effective': '비용 효율적',
    'High Engagement': '높은 참여도',
    'Quick Response': '빠른 응답',
    'Personal Touch': '개인적 접촉',
    'Broad Reach': '넓은 도달범위',
    'Targeted': '타겟팅',
    'Instant': '즉시',
    'Direct': '직접',
    'Interactive': '상호작용',
    'Visual': '시각적',
    // Korean labels (identity mappings)
    '비구독자': '비구독자',
    '젊은 소비자': '젊은 소비자',
    '고액 구매자': '고액 구매자',
    '활발한 사용자': '활발한 사용자',
    '최근 활성': '최근 활성',
    '이탈 위험': '이탈 위험',
    '재활성화 필요': '재활성화 필요',
    '충성 고객': '충성 고객',
    '신규 고객': '신규 고객',
    '프리미엄 고객': '프리미엄 고객',
    '모바일 사용자': '모바일 사용자',
    '웹 사용자': '웹 사용자',
    '앱 사용자': '앱 사용자',
    '고관여 고객': '고관여 고객',
    '저관여 고객': '저관여 고객',
    '잠재 고객': '잠재 고객',
    '기존 고객': '기존 고객',
    'VIP 고객': 'VIP 고객',
    '일반 고객': '일반 고객',
    '젊은 고객': '젊은 고객',
    '중년 고객': '중년 고객',
    '시니어 고객': '시니어 고객',
    '남성 고객': '남성 고객',
    '여성 고객': '여성 고객',
    '도시 거주자': '도시 거주자',
    '지방 거주자': '지방 거주자',
    '온라인 선호': '온라인 선호',
    '오프라인 선호': '오프라인 선호',
    '가격 민감': '가격 민감',
    '브랜드 충성': '브랜드 충성',
    '얼리어답터': '얼리어답터',
    '후기 채택자': '후기 채택자',
    '소셜미디어 활성': '소셜미디어 활성',
    '이메일 활성': '이메일 활성',
    '푸시 알림 선호': '푸시 알림 선호',
    '문자 선호': '문자 선호',
    '전화 선호': '전화 선호',
    '개인화 선호': '개인화 선호',
    '할인 민감': '할인 민감',
    '리뷰 의존': '리뷰 의존',
    // Channel-specific labels
    '효율적인': '효율적인',
    '효과적인': '효과적인',
    '비용효율적': '비용효율적',
    '고효율': '고효율',
    '저비용': '저비용',
    '고비용': '고비용',
    '빠른 전달': '빠른 전달',
    '즉시 응답': '즉시 응답',
    '개인화된': '개인화된',
    '대중화된': '대중화된',
    '타겟팅된': '타겟팅된',
    '광범위한': '광범위한',
    '좁은 범위': '좁은 범위',
    '높은 참여': '높은 참여',
    '낮은 참여': '낮은 참여',
    '상호작용적': '상호작용적',
    '일방향적': '일방향적',
    '시각적': '시각적',
    '텍스트 기반': '텍스트 기반',
    '멀티미디어': '멀티미디어',
    '실시간': '실시간',
    '지연된': '지연된',
    '자동화된': '자동화된',
    '수동적': '수동적',
    '측정 가능한': '측정 가능한',
    '추적 가능한': '추적 가능한',
    '분석 가능한': '분석 가능한',
    '확장 가능한': '확장 가능한',
    '유연한': '유연한',
    '고정된': '고정된',
    '적응적': '적응적',
    '정적': '정적',
    '동적': '동적',
    '안정적인': '안정적인',
    '혁신적인': '혁신적인',
    '전통적인': '전통적인',
    '현대적인': '현대적인',
    '클래식한': '클래식한',
    '트렌디한': '트렌디한',
    '보수적인': '보수적인',
    '공격적인': '공격적인',
    '부드러운': '부드러운',
    '강력한': '강력한',
    '섬세한': '섬세한',
    '직접적인': '직접적인',
    '간접적인': '간접적인',
    '명확한': '명확한',
    '모호한': '모호한',
    '단순한': '단순한',
    '복잡한': '복잡한',
    '창의적인': '창의적인',
    '논리적인': '논리적인',
    '감정적인': '감정적인',
    '이성적인': '이성적인',
    '즉흥적인': '즉흥적인',
    '계획적인': '계획적인',
    '예측 가능한': '예측 가능한',
    '예측 불가능한': '예측 불가능한'
  }
}
