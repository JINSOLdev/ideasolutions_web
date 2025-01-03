# 1. 빌드 스테이지
FROM node:lts AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. 배포 스테이지
FROM nginx:alpine
# Nginx 설정 복사 (옵션)
COPY ./nginx.conf /etc/nginx/nginx.conf
# 빌드된 결과물 복사
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


