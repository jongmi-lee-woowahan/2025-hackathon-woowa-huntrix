# 🔗 API 연결 가이드

CampaignPilot 애플리케이션의 API 연결 구조 및 사용 방법에 대한 가이드입니다.

## 📁 구조 개요

```
client/src/
├── services/
│   └── campaignApi.ts        # API 서비스 레이어
├── components/
│   ├── CampaignSummaryModal.vue   # API 연결된 모달
│   └── CampaignPipeline.vue       # 메인 파이프라인
└── ...
```

## 🛠️ API 서비스 레이어

### 주요 기능
- **타입 안전성**: TypeScript로 완전한 타입 정의
- **에러 처리**: 통합된 에러 핸들링
- **로딩 상태**: 자동 로딩 상태 관리
- **Mock API**: 개발 중 사용할 수 있는 Mock 데이터

### 환경 설정

**1. 환경 변수 설정**
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:5173/api
VITE_USE_MOCK_API=true
```

**2. 프로덕션 환경**
```bash
# .env.production  
VITE_API_BASE_URL=https://your-api-server.com/api
VITE_USE_MOCK_API=false
```

## 🔌 API 엔드포인트

### 캠페인 관리
```typescript
// 캠페인 조회
GET /api/campaigns/{campaignId}

// 캠페인 생성
POST /api/campaigns
{
  "objective": "캠페인 목표",
  "segments": ["세그먼트1", "세그먼트2"],
  "channels": [...],
  "totalBudget": "₩1.0M"
}

// 캠페인 실행
POST /api/campaigns/execute
{
  "campaignId": "campaign_123",
  "objective": "캠페인 목표",
  "selectedSegments": ["젊은 전문직"],
  "channelAllocation": [...],
  "totalBudget": 1000000
}
```

### AI 기능
```typescript
// 성과 예측
POST /api/campaigns/predict-performance
{
  "segments": ["젊은 전문직", "Z세대"],
  "budget": 1000000
}

// 채널 최적화
POST /api/campaigns/optimize-channels  
{
  "segments": ["젊은 전문직"],
  "budget": 1000000
}
```

## 💻 컴포넌트 사용법

### CampaignSummaryModal

**기본 사용법 (Props로 데이터 전달)**
```vue
<template>
  <CampaignSummaryModal
    :open="showModal"
    :campaign-data="campaignData"
    @close="showModal = false"
    @execute="handleExecute"
    @error="handleError"
  />
</template>
```

**API 연동 사용법 (자동 데이터 로딩)**
```vue
<template>
  <CampaignSummaryModal
    :open="showModal"
    :campaign-id="'campaign_123'"
    :auto-load="true"
    @close="showModal = false"
    @execute="handleExecute"
    @loaded="handleDataLoaded"
    @error="handleError"
  />
</template>
```

### 이벤트 핸들링
```typescript
const handleExecute = (response: CampaignExecutionResponse) => {
  console.log('캠페인 실행됨:', response.executionId)
}

const handleError = (error: string) => {
  console.error('오류 발생:', error)
}

const handleDataLoaded = (data: CampaignData) => {
  console.log('데이터 로드됨:', data)
}
```

## 🎯 실제 API 연결 방법

### 1. Mock API 비활성화
```bash
# .env.production
VITE_USE_MOCK_API=false
```

### 2. 실제 API 서버 구현 필요
```typescript
// server/routes.ts에 실제 엔드포인트 구현
app.get('/api/campaigns/:id', async (req, res) => {
  const { id } = req.params
  // 데이터베이스에서 캠페인 조회
  const campaign = await getCampaignById(id)
  res.json({
    data: campaign,
    success: true
  })
})

app.post('/api/campaigns/execute', async (req, res) => {
  const payload = req.body
  // 캠페인 실행 로직
  const result = await executeCampaign(payload)
  res.json({
    data: result,
    success: true
  })
})
```

## 📊 상태 관리

### 로딩 상태
```vue
<template>
  <div v-if="isLoading">데이터 로딩 중...</div>
  <div v-else-if="error">오류: {{ error }}</div>
  <div v-else><!-- 정상 컨텐츠 --></div>
</template>
```

### 에러 처리
- 자동 에러 감지 및 사용자 친화적 메시지 표시
- 재시도 기능 제공
- 에러 로깅 및 모니터링

## 🔄 데이터 플로우

```
1. 사용자 액션 (캠페인 실행 버튼 클릭)
     ↓
2. API 호출 (campaignApi.executeCampaign)
     ↓ 
3. 로딩 상태 표시
     ↓
4. 서버 응답 처리
     ↓
5. 성공/실패에 따른 UI 업데이트
     ↓
6. 사용자에게 결과 피드백
```

## 🚀 확장 가능한 구조

### 새로운 API 엔드포인트 추가
```typescript
// services/campaignApi.ts에 추가
export const campaignApi = {
  // 기존 메서드들...
  
  // 새로운 기능 추가
  async getCampaignAnalytics(campaignId: string): Promise<ApiResponse<AnalyticsData>> {
    return apiClient.get<AnalyticsData>(`/campaigns/${campaignId}/analytics`)
  }
}
```

### 새로운 컴포넌트 API 연동
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/services/campaignApi'

const data = ref(null)
const isLoading = ref(false)

const loadData = async () => {
  isLoading.value = true
  try {
    const response = await api.getCampaignAnalytics('campaign_123')
    data.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadData)
</script>
```

## ✅ 체크리스트

실제 API 연결 시 확인사항:

- [ ] 환경 변수 설정 (`VITE_USE_MOCK_API=false`)
- [ ] API 서버 엔드포인트 구현
- [ ] 인증/보안 설정 (JWT, CORS 등)
- [ ] 에러 핸들링 테스트
- [ ] 로딩 상태 테스트
- [ ] 데이터 검증 및 타입 체크
- [ ] 성능 최적화 (캐싱, 페이지네이션 등)

---

이 가이드를 참고하여 실제 백엔드 API와 연결하시면 됩니다! 🎯
