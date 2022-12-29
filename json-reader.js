const fs = require('fs');
const async = require('async');
const filesDir = './pruebas/';


let providersModulesFromJSON = {
    auth_module: {},
    content_module: {}
}

fs.readdir(filesDir, function (err, data) {
    if (err) throw err;

    data.forEach(function (fileName) {
        fs.readFile(filesDir + fileName, "utf8", (err, jsonString) => {
            if (err) {
                console.log("Error reading file from disk:", err);
                return;
            }
            try {
                const newJSON = JSON.parse(jsonString);

                providersModulesFromJSON.auth_module[newJSON.provider.auth_module] ?
                    providersModulesFromJSON.auth_module[newJSON.provider.auth_module].push(fileName) :
                    providersModulesFromJSON.auth_module[newJSON.provider.auth_module] = [fileName]

                providersModulesFromJSON.content_module[newJSON.provider.content_module] ?
                    providersModulesFromJSON.content_module[newJSON.provider.content_module].push(fileName) :
                    providersModulesFromJSON.content_module[newJSON.provider.content_module] = [fileName]

                    console.log(providersModulesFromJSON)
            } catch (err) {
                console.log("Error parsing JSON string:", err);
            }
        })
    });
});