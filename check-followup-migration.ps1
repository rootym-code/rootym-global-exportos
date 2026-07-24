Write-Host "========================================="
Write-Host " ROOTYM FollowUp Migration Audit"
Write-Host "========================================="
Write-Host ""


$patterns = @(
    "FollowUpStatus\.MISSED",
    "FollowUpStatus\.CANCELLED",

    "FollowUpResult\.NO_ANSWER",
    "FollowUpResult\.BUSY",
    "FollowUpResult\.FOLLOWUP_REQUIRED",

    "isMissed",
    "isCancelled",

    "markMissed",
    "markCancelled"
)


$exclude = @(
    "node_modules",
    ".next",
    ".git",
    "lib/generated"
)


$files = Get-ChildItem `
    -Path . `
    -Recurse `
    -Include *.ts,*.tsx `
    -File |
    Where-Object {

        $path = $_.FullName

        $ignore = $false

        foreach ($folder in $exclude) {

            if ($path -like "*\$folder\*") {
                $ignore = $true
            }
        }

        -not $ignore
    }


$found = $false


foreach ($pattern in $patterns) {

    Write-Host ""
    Write-Host "Checking:"
    Write-Host $pattern -ForegroundColor Cyan


    $matches =
        $files |
        Select-String -Pattern $pattern


    if ($matches) {

        $found = $true

        foreach ($match in $matches) {

            Write-Host ""
            Write-Host (
                "{0}:{1}" -f
                $match.Path,
                $match.LineNumber
            ) -ForegroundColor Yellow

            Write-Host (
                "  {0}" -f
                $match.Line.Trim()
            )
        }
    }
}


Write-Host ""
Write-Host "========================================="


if ($found) {

    Write-Host "OLD REFERENCES FOUND" -ForegroundColor Red

}
else {

    Write-Host "CLEAN - No old FollowUp references found" -ForegroundColor Green

}


Write-Host "========================================="