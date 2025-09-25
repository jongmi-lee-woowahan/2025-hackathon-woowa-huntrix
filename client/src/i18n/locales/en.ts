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
    subtitle: 'Review the expected performance metrics for your selected customer segments. Predict campaign performance through key metrics such as CTR, conversion rate, and ROI.',
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
    analyzing: 'AI is analyzing the campaign... (up to 5 minutes)',
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
  }
}
