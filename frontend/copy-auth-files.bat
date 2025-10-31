@echo off
echo 🔐 Copying Auth System Files to Backend...

REM Copy config files
copy "JwtTokenProvider.java" "..\backend\src\main\java\com\borakgul\demo\config\JwtTokenProvider.java"
copy "SecurityConfig.java" "..\backend\src\main\java\com\borakgul\demo\config\SecurityConfig.java"
copy "JwtAuthenticationFilter.java" "..\backend\src\main\java\com\borakgul\demo\config\JwtAuthenticationFilter.java"
copy "JwtAuthenticationEntryPoint.java" "..\backend\src\main\java\com\borakgul\demo\config\JwtAuthenticationEntryPoint.java"

REM Copy model and service files
copy "User.java" "..\backend\src\main\java\com\borakgul\demo\model\User.java"
copy "UserRepository.java" "..\backend\src\main\java\com\borakgul\demo\repository\UserRepository.java"
copy "UserService.java" "..\backend\src\main\java\com\borakgul\demo\service\UserService.java"

REM Copy DTOs
copy "RegisterRequest.java" "..\backend\src\main\java\com\borakgul\demo\dto\RegisterRequest.java"
copy "LoginRequest.java" "..\backend\src\main\java\com\borakgul\demo\dto\LoginRequest.java"
copy "AuthResponse.java" "..\backend\src\main\java\com\borakgul\demo\dto\AuthResponse.java"

echo ✅ All auth files copied successfully!
echo 🚀 Next step: Update AuthController.java