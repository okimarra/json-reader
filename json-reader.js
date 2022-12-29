const fs = require('fs');
const filesDir = './pruebas/';

const readDir = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const providersModulesFromJSON = {
                auth_module: {},
                content_module: {}
            }
            const data = await fs.promises.readdir(filesDir);

            for (const fileName of data) {
                const jsonString = await fs.promises.readFile(filesDir + fileName, "utf8");
                const newJSON = JSON.parse(jsonString);
                providersModulesFromJSON.auth_module[newJSON.provider.auth_module] ?
                    providersModulesFromJSON.auth_module[newJSON.provider.auth_module].push(fileName) :
                    providersModulesFromJSON.auth_module[newJSON.provider.auth_module] = [fileName]

                providersModulesFromJSON.content_module[newJSON.provider.content_module] ?
                    providersModulesFromJSON.content_module[newJSON.provider.content_module].push(fileName) :
                    providersModulesFromJSON.content_module[newJSON.provider.content_module] = [fileName]
            }
            resolve(providersModulesFromJSON);
        } catch (error) {
            console.error('ERROR: ', error);
            reject(error);
        }
    });

};

(async () => {
    const result = await readDir();
    console.log('RESULT: ', result);
})();
