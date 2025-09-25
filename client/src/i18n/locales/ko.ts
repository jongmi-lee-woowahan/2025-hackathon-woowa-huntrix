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
    analyzing: 'AI가 캠페인을 분석하고 있습니다... (최대 5분 소요)',
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
    subtitle: '세그멘텀 마케팅 에이전트'
  }
}
