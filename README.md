# Cách chạy code demo
1. Tải cơ sở dữ liệu [Postgresql](https://www.postgresql.org/download/).

2. Sau khi cài đặt, tạo ra một cơ sở dữ liệu 

3. Clone dự án về máy tính 

4. Mở file `.env ` trong đó sẽ thêm đoạn code sau :
    ```nodejs 
    DB_USER=
    DB_PASSWORD=
    DB_HOST=
    DB_PORT=
    DB_DATABASE=
    ```
    Sau đó điền thông tin vào các biến, ví dụ :  
    ```
    DB_USER=postgres  
    DB_PASSWORD=15112002  
    DB_HOST=localhost  
    DB_PORT=5432  
    DB_DATABASE=FirstWeb  
    ```
5. Chạy các câu lệnh sau :   

    ```
    npm init  
    npm install express body-parser pg jsonwebtoken dotenv cors
    ```
6. Tải nodemon để tự động khởi động lại server Node.js mỗi khi thực hiện một thay đổi trong mã nguồn:
    ```
    npm install nodemon --save-dev
    ```
7. Chạy chương trình :
    ```
    nodemon index.js
    ```
8. Tải [Postman](https://www.postman.com/downloads/) để dễ dàng test API hơn.









