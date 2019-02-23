const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const scriptFile = path.resolve(__dirname, 'scripts', 'mkcd.sh');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
    console.log('Iniciando script');
    console.log(`Home ${process.env.HOME}`);
    console.log(`Directorio de ejecución: ${process.cwd()}`);
}

const createAndChangeDir = async () => {
    try {
        process.chdir(process.env.HOME);

        if (isDev) {
            console.log(`Ahora en directorio: ${process.cwd()}`);
        }

        const homeDir = process.cwd();
        const shellScriptFile = '.zshrc';

        const files = await readdir(homeDir);

        if (files.includes(shellScriptFile)) {
            const shellFile = path.resolve(homeDir, shellScriptFile);

            const script = await readFile(scriptFile, { encoding: 'utf8' });
            await writeFile(shellFile, `\n${script}\n`, { encoding: 'utf8', flag: 'a' });

            process.exit(0);
        }
    } catch (err) {
        console.error(`An error has occured : ${err}`);
        process.exit(1);
    }
};

module.exports = createAndChangeDir;