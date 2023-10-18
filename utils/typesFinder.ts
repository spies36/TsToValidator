import fs from 'fs';
import path from 'path';

const PATHS_TO_IGNORE = ['.git', '.gitattributes', 'node_modules', '.gitignore', 'dist', 'package-lock.json', '.vscode', 'package.json', 'tsconfig.json'];

function skipFile(filePath: string) {
    const exists = fs.existsSync(filePath);
    if (!exists) {
        return true
    }

    let baseName = path.basename(filePath)
    if (PATHS_TO_IGNORE.includes(baseName)) {
        return true
    }

    return false;
}

function isTypesFile(fileName: string) {
    fileName = fileName.toLocaleLowerCase();
    if (fileName === 'types.ts' || fileName === 'types.d.ts') {
        return true
    }
    return false
}



async function depthFirstTypeFinder(workingDirectory: string) {
    const dirs = await fs.promises.readdir(workingDirectory);
    let typeFilePaths: string[] = [];
    for (let dir of dirs) {
        const fullPath = path.join(workingDirectory, dir);
        if (skipFile(fullPath)) {
            continue
        }
        const isDirectory = (await fs.promises.lstat(fullPath)).isDirectory()
        if (isDirectory) {
            let childTypeFiles = await depthFirstTypeFinder(fullPath);
            childTypeFiles.forEach((childTypeFile) => typeFilePaths.push(childTypeFile));
        } else if (isTypesFile(fullPath)) {
            typeFilePaths.push(fullPath);
        }
    }

    return typeFilePaths;
}


export {
    depthFirstTypeFinder
}