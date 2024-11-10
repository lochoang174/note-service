# Bước 1: Chọn image của Node.js làm base image
FROM node:20-alpine3.19

# Bước 2: Thiết lập thư mục làm việc trong container
WORKDIR /app

# Bước 3: Copy package.json và package-lock.json trước để cài đặt dependencies
COPY package*.json .

# Bước 4: Cài đặt các dependency
RUN npm install

# Bước 5: Sao chép toàn bộ nội dung của thư mục hiện tại vào container
COPY . .

# Mở cổng cho ứng dụng
EXPOSE 3005
CMD ["node", "server.js"]
