function translate-from-videos {
    Param(
    [string] $videoDir = "./",
    [string] $sourceLang = "EN",
    [string] $targetLang = "FR"
  )

    $files = (Get-Item "$videoDir/*")
    $files | ForEach-Object { ffmpeg -n -i "$_" -map 0:s:0  (Join-Path $videoDir "$($_.BaseName).srt") }

    $srt = (Get-Item (Join-Path $videoDir "*.srt"))

    $srt | ForEach-Object { node ./index.js "$_" "$sourceLang" "$targetLang"; Start-Sleep 2 }

  <#
        .SYNOPSIS
        Traduction des sous-titres de plusieurs fichiers vidéos à la fois.

        .PARAMETER videoDir
        Répertoire dans lequel se trouvent les fichiers vidéos dont on veut
        convertir les sous-titres d'une langue $sourceLang à une $targetLang

        .PARAMETER sourceLang
        Langue d'origine des sous-titres.

        .PARAMETER targetLang
        Langue cible des sous-titres.

        .OUTPUTS
        None.

        .EXAMPLE
        PS> translate-from-videos ../vids "FR" "EN"
        File.doc
    #>

}