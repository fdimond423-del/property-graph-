@echo off
echo ===================================================
echo Pushing Brochure Changes to GitHub...
echo ===================================================
echo.
echo If a popup/browser page opens, please sign in to authenticate.
echo.
git push origin main
git push origin main:gh-pages
echo.
echo ===================================================
echo Done! Please check https://fdimond423-del.github.io/property-graph-/
echo ===================================================
pause
