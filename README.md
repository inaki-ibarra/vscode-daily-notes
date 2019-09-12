# VSCode Daily Notes

A simple text-based journal extension for Visual Studio Code.

## Features

* Access your Daily Notes conveniently with a shortcut: ```Alt+N```
* Date header is generated automatically
* Made in Markdown format so VSCode preview is possible with: ```Ctrl+Shift+V```

![Feature](images/feature.gif)

## Usage

There are 2 ways to open Daily Notes file:

* VSCode Command: ```Ctrl+Shift+P``` or ```F1```, then type **Open Daily Notes**
* Shortcut Key-bind: Press ```Alt+N```

If the Daily Notes file is already open:

* Press ```Alt+N``` to generate new line of current date
* Press ```Ctrl+W``` to close the file
* Press ```Ctrl+S``` to save the file

If you don't want to save Daily Notes file in current workspace:

* Create a new file ```daily-notes.md```, copy the path and set the ```dailyNotes.filePath``` in config

## Extension Settings

This extension contributes the following settings:

* `dailyNotes.filePath`: The complete location of the file to be used. When empty the file will be created in current worspace instead.

## Known Issues

* You may get an error 'extension.open failed' when there's no open folder in your workspace. You can fix this by setting 'dailyNotes.filePath' in config or opening a folder first, then Alt + N.
* If you are using remote Windows Subsystem for Linux a.k.a WSL for VSCode, the file path format from Windows may not work.
This can be solved easily by using the file path from WSL e.g. ```/mnt/c/projects```.

## Installation

1. In VSCode, go to Extensions ```Ctrl+Shift+X```
2. Type **Daily Notes** in search box
3. Click **Install**

## License
The extension is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
