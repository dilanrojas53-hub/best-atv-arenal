$e="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$o="C:\Users\HP\.gemini\antigravity\brain\7bde3d6b-a6c9-4e06-bd62-ae3466578770\scratch"
$u="file:///C:/Users/HP/.gemini/antigravity/scratch/best-atv-arenal/index.html"
function Shot($url,$size,$out){ $p=Start-Process $e -ArgumentList "--headless=new","--disable-gpu","--no-first-run","--user-data-dir=$o\edgeprof","--hide-scrollbars","--allow-file-access-from-files","--virtual-time-budget=6000","--window-size=$size","--screenshot=$o\$out",$url -PassThru; $p.WaitForExit(60000) | Out-Null }
Shot $u "1440,7600" "full_desk.png"
Shot "file:///$($o -replace '\\','/')/mobile.html" "500,9000" "full_mob.png"
Add-Type -AssemblyName System.Drawing
# split tall shots into readable chunks
foreach($f in "full_desk","full_mob"){
  $img=[System.Drawing.Image]::FromFile("$o\$f.png"); $w=$img.Width; $ch= if($f -eq "full_mob"){1300}else{1500}; $i=0
  for($y=0;$y -lt $img.Height;$y+=$ch){ $h=[Math]::Min($ch,$img.Height-$y); $b=New-Object System.Drawing.Bitmap $w,$h; $g=[System.Drawing.Graphics]::FromImage($b); $g.DrawImage($img,(New-Object System.Drawing.Rectangle 0,0,$w,$h),(New-Object System.Drawing.Rectangle 0,$y,$w,$h),'Pixel'); $b.Save("$o\${f}_$i.png"); $g.Dispose(); $b.Dispose(); $i++ }
  $img.Dispose(); "$f -> $i chunks"
}
