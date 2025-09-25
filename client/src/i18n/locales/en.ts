export default {
  // Common
  common: {
    next: 'Next',
    previous: 'Previous',
    cancel: 'Cancel',
    confirm: 'Confirm',
    execute: 'Execute',
    close: 'Close',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    retry: 'Retry',
    comingSoon: 'Coming Soon'
  },

  // Navigation & Steps
  navigation: {
    previousStep: 'Previous Step',
    campaignObjectiveSetting: 'Campaign Objective Setting',
    customerSegmentation: 'Customer Segmentation',
    performanceAnalysis: 'Performance Analysis',
    channelDistribution: 'Channel Distribution',
    finalCampaignReview: 'Final Campaign Review'
  },

  // Campaign Objective
  objective: {
    title: 'Campaign Objective Setting',
    label: 'Campaign Objective',
    placeholder: 'Please describe your campaign objectives and target audience in detail...',
    aiAnalyzing: 'AI is analyzing...',
    button: 'AI Analysis'
  },

  // Customer Segmentation
  segmentation: {
    title: 'Customer Segment Selection',
    subtitle: 'Select the target groups that best fit your campaign objectives from the AI-analyzed customer segments. You can review the characteristics and scale of each segment.',
    selectedSegments: 'Selected segments',
    totalTargetCustomers: 'Total target customers',
    people: 'people',
    goToPerformanceAnalysis: 'Go to Performance Analysis',
    analyzing: 'Analyzing...',
    noTagsAvailable: 'No tags available for this segment',
    more: 'more'
  },

  // Performance Metrics
  metrics: {
    title: 'Overall Expected Performance',
    subtitle: 'Review the expected performance metrics for your selected customer segments. Predict campaign performance through key metrics such as LTV, conversion rate, etcs.',
    conversionRate: 'Conversion Rate',
    conversionDesc: 'Expected conversion rate for the target segment',
    targetRevisitRate: 'Target Revisit Rate',
    targetRevisitDesc: 'Expected customer revisit frequency',
    profitability: 'Profitability',
    profitabilityDesc: 'Expected revenue per customer',
    selectedTargetSegment: 'Selected Target Segment',
    performanceMetricsInfo: 'The above performance metrics are based on analysis of the selected segment.',
    goToChannelDistribution: 'Go to Channel Distribution'
  },

  // Channel Distribution
  channels: {
    title: 'Marketing Channel Distribution',
    subtitle: 'Distribute your marketing budget across channels based on expected customer preferences.',
    subtitle2: 'Review the AI-optimized budget allocation across marketing channels. Optimal distribution is suggested based on each channel\'s characteristics and expected performance.',
    channelDataError: 'Channel Data Error',
    viewOriginalResponse: 'View Original Response Data',
    aiAnalyzing: 'AI is analyzing optimized channel distribution...',
    marketingChannelRatio: 'Marketing Channel Ratio',
    reach: 'Reach',
    channelBudgetComplete: 'Channel Budget Distribution Complete',
    totalExpectedCost: 'Total Expected Cost',
    channels: 'Channels',
    totalPeopleReached: 'Total {count} People Reached',
    finalCampaignReview: 'Final Campaign Review',
    
    // Channel names
    names: {
      socialMedia: 'Social Media',
      mobile: 'Mobile',
      mobileAds: 'Mobile Ads',
      email: 'Email',
      emailMarketing: 'Email Marketing',
      search: 'Search',
      searchAds: 'Search Ads',
      messenger: 'Messenger',
      pushNotifications: 'Push Notifications',
      inAppMessages: 'In-App Messages',
      sms: 'SMS',
      textMessage: 'Text Message'
    },

    // Channel descriptions
    descriptions: {
      pushNotifications: 'Engage users with timely push notifications to drive immediate action and increase app retention.',
      inAppMessages: 'Deliver personalized messages within your app to guide user behavior and enhance engagement.',
      messenger: 'Connect with customers through messaging platforms for direct communication and support.',
      email: 'Reach customers with targeted email campaigns for promotions, updates, and newsletters.',
      emailMarketing: 'Comprehensive email marketing campaigns to nurture leads and drive conversions.',
      sms: 'Send direct text messages for urgent notifications, promotions, and quick updates.',
      textMessage: 'Direct text messaging for immediate communication and high-impact marketing.',
      socialMedia: 'Leverage social platforms to build brand awareness and engage with your audience.',
      mobile: 'Optimize marketing efforts for mobile users across various mobile channels.',
      mobileAds: 'Display targeted advertisements on mobile devices and apps.',
      search: 'Capture users actively searching for relevant products or services.',
      searchAds: 'Run targeted advertising campaigns on search engines to drive qualified traffic.',
      default: 'Optimize marketing channel for better customer engagement and conversion rates.'
    }
  },

  // Campaign Summary
  summary: {
    title: 'Campaign Execution Confirmation',
    
    // Campaign Overview
    overview: {
      title: 'Campaign Overview',
      objective: 'Campaign Objective',
      targetSegments: 'Target Segments'
    },
    
    // Performance Metrics
    metrics: {
      title: 'Expected Performance Metrics',
      targetRevisitRate: 'Target Revisit Rate',
      conversionRate: 'Conversion Rate',
      profitability: 'Profitability',
      days: 'days'
    },
    
    // Channel Distribution
    channels: {
      title: 'Channel Distribution'
    },
    
    // Budget Summary
    budget: {
      title: 'Total Marketing Budget',
      monthlyBudgetAllocation: 'Monthly Budget Allocation',
      expectedRevenue: 'Expected Revenue'
    },
    
    // Execution
    execution: {
      startingExecution: 'Starting campaign execution...',
      executingBasicCampaign: 'Executing basic campaign...',
      basicCampaignCompleted: 'Basic campaign execution completed. Creating segments...',
      allTasksCompleted: 'All tasks completed!',
      executionSuccessful: 'Campaign execution successful!',
      executionStarted: 'Campaign execution has been started successfully.',
      executionFailed: 'Campaign execution failed'
    }
  },

  // AI Processing
  ai: {
    analyzing: 'AI is analyzing the campaign... (up to 2 minutes)',
    analyzing2: 'AI is analyzing performance of selected segments...',
    analyzing3: 'AI analysis for channel optimization in progress...',
    analysisCompleted: 'Analysis completed!',
    analyticsAnalysisCompleted: 'Analytics analysis completed!',
    channelOptimizationCompleted: 'Channel optimization completed!',
    connectionIssue: 'AI server connection issue. Please try again later.',
    errorOccurred: 'An error occurred during channel optimization.'
  },

  // App Header
  app: {
    title: 'SegMA',
    subtitle: 'Segmentum Marketing Agent'
  },

  // Labels translation
  labels: {
    // Customer segment labels
    'Non-Subscriber': 'Non-Subscriber',
    'Young Spender': 'Young Spender', 
    'High Basket Value': 'High Basket Value',
    'Young & Frequent': 'Young & Frequent',
    'Recently Active': 'Recently Active',
    'Young & Lapsing': 'Young & Lapsing',
    'Needs Reactivation': 'Needs Reactivation',
    'High-Value': 'High-Value',
    'Frequent User': 'Frequent User',
    'Premium Customer': 'Premium Customer',
    'Loyal Customer': 'Loyal Customer',
    'New Customer': 'New Customer',
    'Potential Churner': 'Potential Churner',
    'Active User': 'Active User',
    'Inactive User': 'Inactive User',
    // Channel labels
    'Cost-Effective': 'Cost-Effective',
    'High Engagement': 'High Engagement',
    'Quick Response': 'Quick Response',
    'Personal Touch': 'Personal Touch',
    'Broad Reach': 'Broad Reach',
    'Targeted': 'Targeted',
    'Instant': 'Instant',
    'Direct': 'Direct',
    'Interactive': 'Interactive',
    'Visual': 'Visual',
    // Korean labels (fallback mappings)
    '비구독자': 'Non-Subscriber',
    '젊은 소비자': 'Young Spender',
    '고액 구매자': 'High Basket Value',
    '활발한 사용자': 'Active User',
    '최근 활성': 'Recently Active',
    '이탈 위험': 'At Risk',
    '재활성화 필요': 'Needs Reactivation',
    '충성 고객': 'Loyal Customer',
    '신규 고객': 'New Customer',
    '프리미엄 고객': 'Premium Customer',
    '모바일 사용자': 'Mobile User',
    '웹 사용자': 'Web User',
    '앱 사용자': 'App User',
    '고관여 고객': 'High Engagement Customer',
    '저관여 고객': 'Low Engagement Customer',
    '잠재 고객': 'Potential Customer',
    '기존 고객': 'Existing Customer',
    'VIP 고객': 'VIP Customer',
    '일반 고객': 'Regular Customer',
    '젊은 고객': 'Young Customer',
    '중년 고객': 'Middle-aged Customer',
    '시니어 고객': 'Senior Customer',
    '남성 고객': 'Male Customer',
    '여성 고객': 'Female Customer',
    '도시 거주자': 'Urban Resident',
    '지방 거주자': 'Rural Resident',
    '온라인 선호': 'Online Preferred',
    '오프라인 선호': 'Offline Preferred',
    '가격 민감': 'Price Sensitive',
    '브랜드 충성': 'Brand Loyal',
    '얼리어답터': 'Early Adopter',
    '후기 채택자': 'Late Adopter',
    '소셜미디어 활성': 'Social Media Active',
    '이메일 활성': 'Email Active',
    '푸시 알림 선호': 'Push Notification Preferred',
    '문자 선호': 'SMS Preferred',
    '전화 선호': 'Phone Call Preferred',
    '개인화 선호': 'Personalization Preferred',
    '할인 민감': 'Discount Sensitive',
    '리뷰 의존': 'Review Dependent',
    // Channel-specific labels
    '효율적인': 'Efficient',
    '효과적인': 'Effective',
    '비용효율적': 'Cost-Effective',
    '고효율': 'High Efficiency',
    '저비용': 'Low Cost',
    '고비용': 'High Cost',
    '빠른 전달': 'Fast Delivery',
    '즉시 응답': 'Instant Response',
    '개인화된': 'Personalized',
    '대중화된': 'Mass Market',
    '타겟팅된': 'Targeted',
    '광범위한': 'Wide Reach',
    '좁은 범위': 'Narrow Reach',
    '높은 참여': 'High Engagement',
    '낮은 참여': 'Low Engagement',
    '상호작용적': 'Interactive',
    '일방향적': 'One-way',
    '시각적': 'Visual',
    '텍스트 기반': 'Text-based',
    '멀티미디어': 'Multimedia',
    '실시간': 'Real-time',
    '지연된': 'Delayed',
    '자동화된': 'Automated',
    '수동적': 'Manual',
    '측정 가능한': 'Measurable',
    '추적 가능한': 'Trackable',
    '분석 가능한': 'Analyzable',
    '확장 가능한': 'Scalable',
    '유연한': 'Flexible',
    '고정된': 'Fixed',
    '적응적': 'Adaptive',
    '정적': 'Static',
    '동적': 'Dynamic',
    '안정적인': 'Stable',
    '혁신적인': 'Innovative',
    '전통적인': 'Traditional',
    '현대적인': 'Modern',
    '클래식한': 'Classic',
    '트렌디한': 'Trendy',
    '보수적인': 'Conservative',
    '공격적인': 'Aggressive',
    '부드러운': 'Soft',
    '강력한': 'Powerful',
    '섬세한': 'Subtle',
    '직접적인': 'Direct',
    '간접적인': 'Indirect',
    '명확한': 'Clear',
    '모호한': 'Ambiguous',
    '단순한': 'Simple',
    '복잡한': 'Complex',
    '창의적인': 'Creative',
    '논리적인': 'Logical',
    '감정적인': 'Emotional',
    '이성적인': 'Rational',
    '즉흥적인': 'Spontaneous',
    '계획적인': 'Planned',
    '예측 가능한': 'Predictable',
    '예측 불가능한': 'Unpredictable'
  }
}
