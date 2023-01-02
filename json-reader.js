const fs = require('fs');
// Directorio donde se encuentran los archivos json
const filesDir = './pruebas/';

const readDir = async () => {
    // Creo una promesa para resolver luego de recorrer todos los archivos
    return new Promise(async (resolve, reject) => {
        try {
            // Inicializo el objeto que voy a retornar al final.
            const providersModulesFromJSON = {
                auth_module: {},
                content_module: {}
            }

            // Obtengo los archivos del directorio donde están los jsons
            const data = await fs.promises.readdir(filesDir);

            // Voy recorriendo el array de archivos
            for (const fileName of data) {
                // Hago un readfile y parseo
                const jsonString = await fs.promises.readFile(filesDir + fileName, "utf8");
                const newJSON = JSON.parse(jsonString);

                // Primero con auth_module si no he pusheado un file name dentro del archivo para ese provider inicializo el array y si ya existe ese provider dentro del auth_module
                // (por lo tanto ya tiene un elemento), lo pusheo
                providersModulesFromJSON.auth_module[newJSON.provider.auth_module] ?
                    providersModulesFromJSON.auth_module[newJSON.provider.auth_module].push(fileName) :
                    providersModulesFromJSON.auth_module[newJSON.provider.auth_module] = [fileName]

                // Idem con content_module
                providersModulesFromJSON.content_module[newJSON.provider.content_module] ?
                    providersModulesFromJSON.content_module[newJSON.provider.content_module].push(fileName) :
                    providersModulesFromJSON.content_module[newJSON.provider.content_module] = [fileName]
            }

            // Resuelvo la promesa y devuelvo el objetoluego de recorrer todos los archivos del directorio
            resolve(providersModulesFromJSON);
        } catch (error) {
            console.error('ERROR: ', error);
            reject(error);
        }
    });

};

const getMinimumAmountOfUsers = (modules) => {
    // Creo dos estructuras auxiliares
    // Una es un objeto donde cada key es el usuario del json y el value es un array con los providers que tiene (según lo obtenido de la parte A)
    let auxProvidersByUser = {};
    // La segunda es un Set, donde voy a tener todos los providers sin repetir (por eso el Set)
    let auxUsedProviders = new Set();
    // Recorro las properties dentro del objeto de la parte A (en este caso los modules)
    for (const m in modules) {
        // Aprovecho la iteración para popular ambas estructuras de datos auxiliares
        const providers = modules[m];
        // Recorro ahora los providers dentro de los modules con un for in tambien ya que son properties dentro de un objeto
        for (const p in providers) {
            // Populo la primera estructura
            const usersForProvider = providers[p];
            auxUsedProviders.add(p)
            // Finalmente recorro el array de usuarios dentro del provider y populo la segunda
            for (const u of usersForProvider) {
                auxProvidersByUser[u] ? auxProvidersByUser[u].push(p) : auxProvidersByUser[u] = [p]
            }
        }
    }

    // Se obtiene algo así

    console.log('auxProvidersByUser', auxProvidersByUser);

    // auxProvidersByUser {
    //     'u0.json': [ 'authn.provider_3', 'authz.provider_4' ],
    //     'u11.json': [ 'authn.provider_3', 'authz.provider_3' ],
    //     'u12.json': [ 'authn.provider_3', 'authz.provider_4' ],
    //     'u15.json': [ 'authn.provider_3', 'authz.provider_2' ],
    //     'u7.json': [ 'authn.provider_3', 'authz.provider_4' ],
    //     'u1.json': [ 'authn.provider_2', 'authz.provider_4' ],
    //     'u10.json': [ 'authn.provider_2', 'authz.provider_3' ],
    //     'u13.json': [ 'authn.provider_2', 'authz.provider_2' ],
    //     'u14.json': [ 'authn.provider_2', 'authz.provider_1' ],
    //     'u16.json': [ 'authn.provider_2', 'authz.provider_2' ],
    //     'u18.json': [ 'authn.provider_2', 'authz.provider_3' ],
    //     'u6.json': [ 'authn.provider_2', 'authz.provider_4' ],
    //     'u8.json': [ 'authn.provider_2', 'authz.provider_2' ],
    //     'u17.json': [ 'authn.provider_1', 'authz.provider_2' ],
    //     'u19.json': [ 'authn.provider_1', 'authz.provider_4' ],
    //     'u3.json': [ 'authn.provider_1', 'authz.provider_3' ],
    //     'u4.json': [ 'authn.provider_1', 'authz.provider_1' ],
    //     'u2.json': [ 'authn.provider_4', 'authz.provider_3' ],
    //     'u5.json': [ 'authn.provider_4', 'authz.provider_3' ],
    //     'u9.json': [ 'authn.provider_4', 'authz.provider_2' ]
    //   }

    console.log('auxUsedProviders', auxUsedProviders);

    // auxUsedProviders Set(8) {
    //     'authn.provider_3',
    //     'authn.provider_2',
    //     'authn.provider_1',
    //     'authn.provider_4',
    //     'authz.provider_4',
    //     'authz.provider_3',
    //     'authz.provider_2',
    //     'authz.provider_1'
    //   }
    
    // Inicializo el array a retornar
    let users = []

    // Recorro la primera estructura por el la primera key de users
    for (const u in auxProvidersByUser) {
        // Recorro los providers dentro de ese user
        for (const p of auxProvidersByUser[u]) {
            // Chequeo si el set tiene al provider, si lo tiene lo pusheo al array a retornar y elimino el provider del set
            // El set de providers se utiliza para saber cual provider ya es utilizado con cada user
            if (auxUsedProviders.has(p)) {
                users.push(u);
                auxUsedProviders.delete(p)
            }
        }

        // Cuando los providers ya fueron todos usados retorno el set con los users que fueron necesarios para ello
        if (auxUsedProviders.size === 0) return new Set(users);

        // Obtengo algo así
        // Parte B:  Set(7) {
        //     'u0.json',
        //     'u11.json',
        //     'u15.json',
        //     'u1.json',
        //     'u14.json',
        //     'u17.json',
        //     'u2.json'
        //   }
    }
}


// Ejecuto ambos metodos
(async () => {
    const partA = await readDir();
    console.log('Parte A: ', partA);

    const partB = getMinimumAmountOfUsers(partA);
    console.log('Parte B: ', partB);
})();