# tRPC

## Concepts trọng tâm

| Thuật ngữ        | Mô tả                                                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Procedure**    | Là API endpoint - có thể thực hiện query (truy vấn lấy dữ liệu), mutation (thêm, sửa, xóa dữ liệu), subscription (lắng nghe sự thay đổi)   |
| **Query**        | 1 **_Procedure_** (function) that get some data                                                                                            |
| **Mutation**     | Là 1 **_Procedure_** cho phé thêm, sửa, hoặc xóa dữ liệu                                                                                   |
| **Subscription** | Là 1 **_Procedure_** tạo ra các kết nối bền vững và lắng nghe sự thay đổi                                                                  |
| **Router**       | Là 1 collection các **_Procedure_** hoặc các **_Router_** khác cùng chung 1 shared namespace                                               |
| **Context**      | Những dữ liệu mà mọi **_Procedure_** đều có thể truy cập. Thường dùng trong các trường hợp như _Session state_ hoặc _Database connections_ |
| **Middleware**   | 1 **_Function_** có thể chạy trước và sau khi thực hiện 1 **_Procedure_**. Có thể thay đổi **_Context_**                                   |
| **Validation**   | Kiểm tra xem dữ liệu đầu vào có phù hợp hay không ?                                                                                        |
