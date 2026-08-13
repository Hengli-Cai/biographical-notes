@echo off
setlocal
cd /d "%~dp0"
set "PATH=E:\Program Files\Git\cmd;%PATH%"

rem Trust this folder (fixes "dubious ownership")
set "REPO=%~dp0"
set "REPO=%REPO:\=/%"
set "REPO=%REPO:~0,-1%"
git config --global --add safe.directory "%REPO%"

rem Point to the GitHub repository
git remote add github https://github.com/Hengli-Cai/biographical-notes.git 2>nul
git remote set-url github https://github.com/Hengli-Cai/biographical-notes.git

echo ============================================
echo  Step 1/3: Save local changes
echo ============================================
git add -A
git commit -m "Update personal homepage" >nul 2>nul
echo Done.

echo ============================================
echo  Step 2/3: Merge with files already on GitHub
echo  (If it says "could not find remote ref",
echo   that is fine - it means the repo is empty)
echo ============================================
git pull github main --allow-unrelated-histories -X ours --no-edit >nul 2>nul
echo Done.

echo ============================================
echo  Step 3/3: Push to GitHub
echo  (A browser window may open to sign in to
echo   GitHub - please complete the login)
echo ============================================
git push -u github main
if errorlevel 1 goto :pushfail

echo.
echo [OK] Pushed to GitHub.
echo.
echo Next steps:
echo  1. Make sure the repo is PUBLIC
echo     (repo page shows a "Public" badge)
echo  2. Open Settings - Pages
echo  3. Branch: main, folder: / (root), click Save
echo  4. Your site: https://Hengli-Cai.github.io/biographical-notes/
echo.
pause
exit /b 0

:pushfail
echo.
echo [FAIL] Push failed. Please copy the error
echo message above and send it to Codex.
echo.
pause
exit /b 1
