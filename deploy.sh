#!/bin/bash

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

APP_NAME="huntrix-app"

echo -e "${YELLOW}🚀 Starting deployment process...${NC}"

# 1. 기존 PM2 프로세스 중지 및 삭제
echo -e "${YELLOW}📋 Stopping existing PM2 process...${NC}"
pm2 stop $APP_NAME 2>/dev/null || true
pm2 delete $APP_NAME 2>/dev/null || true

# 2. 의존성 설치
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ npm install failed${NC}"
    exit 1
fi

# 3. 프로젝트 빌드
echo -e "${YELLOW}🔨 Building project...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# 4. PM2로 애플리케이션 시작
echo -e "${YELLOW}🏃 Starting application with PM2...${NC}"
pm2 start npm --name "$APP_NAME" -- start
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ PM2 start failed${NC}"
    exit 1
fi

# 5. PM2 상태 확인
echo -e "${YELLOW}📊 Application status:${NC}"
pm2 status

# 6. 로그 확인 안내
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${YELLOW}📝 To view logs: pm2 logs $APP_NAME${NC}"
echo -e "${YELLOW}🔄 To restart: pm2 restart $APP_NAME${NC}"
echo -e "${YELLOW}⏹️  To stop: pm2 stop $APP_NAME${NC}"
echo -e "${YELLOW}📊 To monitor: pm2 monit${NC}"