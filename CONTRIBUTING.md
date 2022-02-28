### How to contribute

- Fork this repo
- Add new module in `data/ubuntu.js` or `data/centos.json`. Use `<br>` tag to change line in command.
```json
{
    "name" : "Module_Name",
    "versions" : [
        {
            "version" : "version_1",
            "cmd" : "command_to_install<br>command_to_install<br>"
        },
        {
            "version" : "version_2",
            "cmd" : "command_to_install<br>command_to_install<br>"
        }
    ]    
}
```
- Push you code and genrate pull request in master.