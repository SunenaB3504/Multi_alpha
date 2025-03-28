@echo off
echo Creating sounds directory and placeholder sound files...

mkdir sounds 2>nul
cd sounds

echo Creating placeholder MP3 files...
copy NUL click.mp3 >nul
copy NUL complete.mp3 >nul
copy NUL correct.mp3 >nul
copy NUL error.mp3 >nul
copy NUL incorrect.mp3 >nul
copy NUL points.mp3 >nul
copy NUL card-flip.mp3 >nul
copy NUL match.mp3 >nul
copy NUL mismatch.mp3 >nul
copy NUL victory.mp3 >nul
copy NUL background.mp3 >nul

echo Sound files created successfully!
pause
