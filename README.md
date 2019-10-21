# Conditional-settings

> A small extension to conditionally set the settings for vscode and allows you to run a script at the startup.

## Features

Easily turn off the settings which are not required for the opened workspace based on some conditions. Run shell commands at the startup.

## Extension Settings

Use the following settings for the extension
```
"conditionalConfig.configs": [
        {
            "conditions": {
                "hasFile": "package-lock.json"
            },
            "settingsToChange": {
                "sonarqube-inject.enableLinter": false
            },
            "runShellCommand": ["ls"]
        }
    ]
"conditionalConfig.disable": false  // default value is false
```

## Release Notes

### 0.1.0
Added functionality to update settings based on conditions(only two conditions **hasFile** and **always**).

-----------------------------------------------------------------------------------------------------------
## Maintainers
- [Ashok Nailwal](mailto:ashoknailwal@gmail.com)


**Enjoy!**
