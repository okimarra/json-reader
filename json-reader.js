const fs = require('fs');

const fileNames = process.argv.splice(2);

let providersModulesFromJSON = {
    auth_module: {},
    content_module: {}
}

console.log('fileNames', fileNames)

fileNames.forEach(fileName => {
    fs.readFile(fileName, "utf8", (err, jsonString) => {
        if (err) {
            console.log("Error reading file from disk:", err);
            return;
        }
        try {
            const newJSON = JSON.parse(jsonString);
            if (providersModulesFromJSON.auth_module[newJSON.provider.auth_module]) {
                providersModulesFromJSON.auth_module[newJSON.provider.auth_module].push(fileName)
            } else {
                providersModulesFromJSON.auth_module[newJSON.provider.auth_module] = [fileName]
            }
            if (providersModulesFromJSON.content_module[newJSON.provider.content_module]) {
                providersModulesFromJSON.content_module[newJSON.provider.content_module].push(fileName)
            } else {
                providersModulesFromJSON.content_module[newJSON.provider.content_module] = [fileName]
            }
            console.log('providersModulesFromJSON', providersModulesFromJSON)
        } catch (err) {
            console.log("Error parsing JSON string:", err);
        }
    });
});