param(
  [string]$EnvFilePath = ".\.env",
  [string]$Project = $env:VERCEL_PROJECT,
  [string]$Org = $env:VERCEL_ORG,
  [string]$DatabaseUrl,
  [string]$DirectUrl
)

function Read-DotEnv([string]$path) {
  $map = @{}
  if (Test-Path $path) {
    Get-Content $path | ForEach-Object {
      $line = $_.Trim()
      if ($line -and -not $line.StartsWith("#")) {
        $idx = $line.IndexOf("=")
        if ($idx -gt 0) {
          $k = $line.Substring(0, $idx).Trim()
          $v = $line.Substring($idx + 1).Trim()
          if ($v.StartsWith("'") -and $v.EndsWith("'")) { $v = $v.Substring(1, $v.Length - 2) }
          if ($v.StartsWith('"') -and $v.EndsWith('"')) { $v = $v.Substring(1, $v.Length - 2) }
          $map[$k] = $v
        }
      }
    }
  }
  return $map
}

function Invoke-VercelRm {
  param(
    [string]$Key, [string]$EnvName, [string]$Token, [string]$Project, [string]$Org
  )
  $args = @("env","rm",$Key,$EnvName,"--yes","--token",$Token)
  if ($Org) { $args += @("--scope",$Org) }
  & npx "-y" "vercel" @args
}

function Invoke-VercelAdd {
  param(
    [string]$Key, [string]$EnvName, [string]$Token, [string]$Project, [string]$Org, [string]$Value
  )
  $args = @("env","add",$Key,$EnvName,"--token",$Token)
  if ($Org) { $args += @("--scope",$Org) }
  $tmp = New-TemporaryFile
  Set-Content -Path $tmp -Value $Value -NoNewline
  Get-Content -Path $tmp | & npx "-y" "vercel" @args
  Remove-Item $tmp -Force -ErrorAction SilentlyContinue
}

function Add-VercelVar([string]$key, [string]$value, [string]$envName, [string]$token, [string]$project, [string]$org) {
  if ([string]::IsNullOrWhiteSpace($value)) { return }
  $projFlag = ""
  if ($project) { $projFlag = "--project `"$project`"" }
  $orgFlag = ""
  if ($org) { $orgFlag = "--scope `"$org`"" }
  vercel env rm $key $envName --yes --token $token $projFlag $orgFlag 2>$null | Out-Null
  $secured = $value | vercel env add $key $envName --token $token $projFlag $orgFlag
}

if ([string]::IsNullOrWhiteSpace($env:VERCEL_TOKEN)) {
  Write-Error "VERCEL_TOKEN tidak ditemukan di environment."
  exit 1
}

$dotenv = Read-DotEnv $EnvFilePath

$required = @{}
$required["JWT_SECRET"] = $dotenv["JWT_SECRET"]
$required["SESSION_SECRET"] = $dotenv["SESSION_SECRET"]
$required["USE_SUPABASE"] = "true"
$required["SUPABASE_URL"] = $dotenv["SUPABASE_URL"]
$required["SUPABASE_SERVICE_ROLE_KEY"] = $dotenv["SUPABASE_SERVICE_ROLE_KEY"]
if ($dotenv.ContainsKey("SUPABASE_ANON_KEY")) { $required["SUPABASE_ANON_KEY"] = $dotenv["SUPABASE_ANON_KEY"] }
$required["COMPRESSION_ENABLED"] = "true"
$required["HELMET_ENABLED"] = "true"
$required["CORS_ORIGIN"] = $dotenv["CORS_ORIGIN"]
if (-not $required["CORS_ORIGIN"]) { $required["CORS_ORIGIN"] = "https://ridhi-porto.vercel.app" }

$dbUrl = $DatabaseUrl
if (-not $dbUrl) { $dbUrl = $env:DATABASE_URL }
if (-not $dbUrl) { $dbUrl = $dotenv["DATABASE_URL"] }
if ($dbUrl) { $required["DATABASE_URL"] = $dbUrl }

$dirUrl = $DirectUrl
if (-not $dirUrl) { $dirUrl = $env:DIRECT_URL }
if (-not $dirUrl) { $dirUrl = $dotenv["DIRECT_URL"] }
if ($dirUrl) { $required["DIRECT_URL"] = $dirUrl }

foreach ($envName in @("production","preview","development")) {
  foreach ($pair in $required.GetEnumerator()) {
    try {
      Invoke-VercelRm -Key $pair.Key -EnvName $envName -Token $env:VERCEL_TOKEN -Project $Project -Org $Org | Out-Null
    } catch {}
    Invoke-VercelAdd -Key $pair.Key -EnvName $envName -Token $env:VERCEL_TOKEN -Project $Project -Org $Org -Value $pair.Value | Out-Null
  }
}

Write-Output "Selesai menambahkan environment variables ke Vercel untuk Production, Preview, Development."
