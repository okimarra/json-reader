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

const getMinimumAmountOfUsers = (modules) => {
    let auxProvidersByUser = {};
    let auxUsedProviders = new Set();
    for (const m in modules) {
        const providers = modules[m];
        for (const p in providers) {
            const usersForProvider = providers[p];
            auxUsedProviders.add(p)
            for (const u of usersForProvider) {
                auxProvidersByUser[u] ? auxProvidersByUser[u].push(p) : auxProvidersByUser[u] = [p]
            }
        }
    }

    let users = []

    for (const u in auxProvidersByUser) {
        for (const p of auxProvidersByUser[u]) {
            if (auxUsedProviders.has(p)) {
                users.push(u);
                auxUsedProviders.delete(p)
            }
        }

        if (auxUsedProviders.size === 0) return new Set(users);
    }
}

(async () => {
    const partA = await readDir();
    console.log('Parte A: ', partA);

    const partB = getMinimumAmountOfUsers(partA);
    console.log('Parte B: ', partB);
})();