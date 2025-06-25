# UStudy Frontend

## :book: Giới thiệu
UStudy là một nền tảng học tập trực tuyến với giao diện người dùng hiện đại và đầy đủ tính năng. Dự án này là phần frontend được xây dựng bằng Next.js.

## :wrench: Yêu cầu hệ thống
- Node.js (>= 14.0.0)
- npm hoặc yarn
- Git

## :rocket: Cài đặt và Chạy

### 1. Clone dự án
```bash
git clone <repository_url>
cd UStudy-frontend
```

### 2. Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
```

### 3. Cấu hình môi trường

#### 3.1. Tạo file môi trường
Tạo file `.env` từ file mẫu `.env.example`:
```bash
cp .env.example .env
```

#### 3.2. Tạo các secret keys

##### NEXT_PUBLIC_COOKIES_SECRET_LOGIN_KEY
Key này được sử dụng để mã hóa thông tin đăng nhập (remember me) phía client.
```bash
# Chạy lệnh sau để tạo key (32 bytes, base64)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

##### COOKIES_SECRET_KEY
Key này được sử dụng để mã hóa cookies phía server.
```bash
# Tạo key tương tự
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### 3.3. Cấu hình URLs
Trong file `.env`:
```env
# URL của frontend (development)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# URL của backend API
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### 4. Chạy dự án

#### Development mode
```bash
npm run dev
# hoặc
yarn dev
```

#### Production build
```bash
npm run build
npm start
# hoặc
yarn build
yarn start
```

## :lock: Bảo mật

### Cookie Encryption
Dự án sử dụng hai lớp mã hóa cookie:

1. **Client-side encryption (Remember Me)**
   - Sử dụng `NEXT_PUBLIC_COOKIES_SECRET_LOGIN_KEY`
   - Mã hóa thông tin đăng nhập khi người dùng chọn "Ghi nhớ đăng nhập"
   - Sử dụng AES-GCM với IV ngẫu nhiên
   - Cookie được lưu riêng biệt cho admin và user thường

2. **Server-side encryption**
   - Sử dụng `COOKIES_SECRET_KEY`
   - Mã hóa các thông tin nhạy cảm như session, user data
   - Không expose ra client

### Cookie Names
- User thường:
  - `user_rememberedLogin`: Thông tin đăng nhập đã mã hóa
  - `user_rememberedLogin_iv`: Vector khởi tạo (IV)

- Admin:
  - `admin_rememberedLogin`: Thông tin đăng nhập đã mã hóa
  - `admin_rememberedLogin_iv`: Vector khởi tạo (IV)

## :warning: Lưu ý quan trọng

1. **Không bao giờ commit file `.env`** vào repository
2. **Không sử dụng các secret keys mặc định** trong production
3. **Luôn tạo keys mới** cho mỗi môi trường (development, staging, production)
4. Đảm bảo `COOKIES_SECRET_KEY` được giữ bí mật và chỉ được sử dụng ở phía server
5. `NEXT_PUBLIC_COOKIES_SECRET_LOGIN_KEY` sẽ được expose ra client, nhưng vẫn nên được thay đổi định kỳ

## :warning: Xử lý lỗi thường gặp

### 1. Memory Allocation Error

Nếu gặp lỗi `memory allocation failed` khi compile, thực hiện một trong các cách sau:

#### Cách 1: Tăng Node.js memory limit
```bash
# Windows (PowerShell hoặc CMD)
set NODE_OPTIONS=--max-old-space-size=4096
# hoặc
$env:NODE_OPTIONS="--max-old-space-size=4096"

# Linux/Mac
export NODE_OPTIONS="--max-old-space-size=4096"
```

#### Cách 2: Thêm script trong package.json
```json
{
  "scripts": {
    "dev": "cross-env NODE_OPTIONS='--max-old-space-size=4096' next dev",
    "build": "cross-env NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```
Cài đặt cross-env:
```bash
npm install --save-dev cross-env
```

#### Cách 3: Tạo file .npmrc
Tạo file `.npmrc` trong thư mục gốc của dự án:
```
node_options=--max-old-space-size=4096
```

### 2. Kiểm tra bộ nhớ hệ thống
- Đảm bảo máy tính có đủ RAM trống (khuyến nghị tối thiểu 8GB)
- Đóng các ứng dụng không cần thiết để giải phóng bộ nhớ
- Xóa cache của Next.js:
```bash
# Xóa thư mục .next
rm -rf .next
# hoặc trên Windows
rmdir /s /q .next
```

<!-- 
## :page_facing_up: License
[MIT License](LICENSE)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details. -->
