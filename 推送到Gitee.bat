@echo off
setlocal
cd /d "%~dp0"
set "PATH=E:\Program Files\Git\cmd;%PATH%"

rem Allow Git to work in this folder (fixes "dubious ownership")
set "REPO=%~dp0"
set "REPO=%REPO:\=/%"
set "REPO=%REPO:~0,-1%"
git config --global --add safe.directory "%REPO%"

rem Point to the Gitee repository (backup)
git remote add gitee https://gitee.com/cai-hengli/biographical-notes.git 2>nul
git remote set-url gitee https://gitee.com/cai-hengli/biographical-notes.git

echo ============================================
echo  Step 1/3: Save local changes
echo ============================================
git add -A
git commit -m "Update personal homepage" >nul 2>nul
echo Done.

echo.
echo ============================================
echo  Step 2/3: Merge with files already on Gitee
echo  (If asked, enter your Gitee username and
echo   password or personal access token)
echo ============================================
git pull gitee master --allow-unrelated-histories -X ours --no-edit
if errorlevel 1 goto :pullfail
echo Done.

echo.
echo ============================================
echo  Step 3/3: Push everything to Gitee
echo ============================================
git push -u gitee main:master
if errorlevel 1 goto :pushfail

echo.
echo [OK] Your website files are backed up on Gitee.
echo.
pause
exit /b 0

:pullfail
echo.
echo [FAIL] Merge failed. Close this window and
echo tell Codex the exact error message shown.
echo.
pause
exit /b 1

:pushfail
echo.
echo [FAIL] Push failed. Common reasons:
echo  - Wrong username or password/token
echo  - No internet connection
echo.
echo Close this window and tell Codex the exact
echo error message shown.
echo.
pause
exit /b 1
