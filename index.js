const directoryPath = '/home/vrq/Documents/projects';

//const fs = require('fs/promises')
import fs from 'fs/promises'

async function main(){
    const files = await fs.readdir(
        directoryPath, {
            recursive: true,
            withFileTypes: true
        });

    const filteredFiles = [];

    files.forEach(e =>{
        if(e.isFile()){
            filteredFiles.push(
            {
                path: e.parentPath,
                name: e.name
            }
            );
        }
    });

    console.log(filteredFiles);


}

main();
