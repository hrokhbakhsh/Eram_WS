Set WshShell = WScript.CreateObject("WScript.Shell")
Return = WshShell.Run("cmd.exe /C forever stopAll", 0, true)
