@echo off
rem T1-S1 test inventory tool. Usage: count_tests.bat <repoRoot> <outDir>
setlocal enabledelayedexpansion
set ROOT=%~1
set OUT=%~2
set DUMP=%OUT%\_tests_dump.txt
if exist "%DUMP%" del "%DUMP%" >nul
dir /s /b "%ROOT%\packages\core\src\*.test.ts" >>"%DUMP%" 2>nul
dir /s /b "%ROOT%\packages\core\src\*.spec.ts" >>"%DUMP%" 2>nul
dir /s /b "%ROOT%\tests\*.test.ts" >>"%DUMP%" 2>nul
dir /s /b "%ROOT%\tests\*.spec.ts" >>"%DUMP%" 2>nul
dir /s /b "%ROOT%\src\*.test.ts" >>"%DUMP%" 2>nul
echo === per-system test file counts (packages\core\src + tests + src)
for %%s in (bazi ba_zhai birth calendar capabilities compatibility direction divination foundation ganzhi huangji-jingshi location profile qi_zheng residential_fengshui shared shensha synthesis taiyi types vedic wuxing wuyun-liuqi xuan_kong ziwei zodiac) do (
  set CNT=0
  for /f %%c in ('findstr /i /c:"\%%s\\" "%DUMP%" ^| find /c /v ""') do set CNT=%%c
  echo %%s !CNT!
)
echo === divination methods (substring match, liuren includes xiaoliuren)
for %%s in (liuyao meihua xiaoliuren jinkoujue qimen liuren tarot lenormand ssgw almanac astrolabe) do (
  set CNT=0
  for /f %%c in ('findstr /i /c:"%%s" "%DUMP%" ^| find /c /v ""') do set CNT=%%c
  echo %%s !CNT!
)
echo === TOTAL
find /c /v "" <"%DUMP%"
endlocal
