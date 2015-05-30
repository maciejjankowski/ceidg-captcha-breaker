IF NOT EXIST tmp\tmp-%1 mkdir tmp\tmp-%1 
curl.exe -k -s https://prod.ceidg.gov.pl/CEIDG/CEIDG.Public.UI/captcha2.ashx?id=%1^&asmp3=1^&t=210^&part=%3 -H "Cookie: ASP.NET_SessionId=%2;" | sox -t mp3 - tmp\tmp-%1\%3-%1_.wav silence 1 0.1 1%% 1 0.5 1%% : newfile : restart
sox tmp\tmp-%1\%3-%1_002.wav tmp\tmp-%1\%3-%1_002a.wav reverse silence 1 0.1 1%% reverse
del tmp\tmp-%1\%3-%1_002.wav
ren tmp\tmp-%1\%3-%1_002a.wav %3-%1_002.wav