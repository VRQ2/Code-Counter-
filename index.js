import fs from 'fs/promises'

const directoryPath = '/home/vrq/Documents/projects';

const extOfInterest = new Set([
    "c","cpp","bat","Makefile","sh","cc","h","hpp","pl","js","mjs","ts","py","java","rs","rb","go","cs","php","ps1","ruby","asm","as","s","nasm","jsx","tsx","hh","r","kt","ino",
]);

async function main(){
    const files = await fs.readdir(
        directoryPath, {
            recursive: true,
            withFileTypes: true
        });

    const filteredFiles = [];

    files.forEach(e =>{
        if(e.isFile()){
            const lowerName = e.name.toLowerCase();
            const splitName = e.name.split(".");

            let ext = ""

            let addToList = false;

            if (splitName.length === 1) {
                if(lowerName === "makefile"){
                    addToList = true;
                    ext = "MakeFile";
                }
            }else{
                 ext = splitName[splitName.length-1];
                if (extOfInterest.has(ext)){
                    addToList = true;
                }
            }


            if (addToList){
            filteredFiles.push(
            {
                path: e.parentPath,
                name: e.name,
                ext: ext
            }
            );
            }
        }
    });


    const linesPerExt = new Map();

    const p = filteredFiles.map( async e => {
        const name = e.path + "/"+e.name;
        const f = await fs.open(name);
        const buf = await f.readFile();
        f.close();
        const txt = buf.toString("utf-8");
        const lines = txt.split("\n");
        const noOfLines = lines.filter(e=>
            (e.trim() !== "")
        ).length;

        if(linesPerExt.has(e.ext)){
            linesPerExt.set(e.ext,linesPerExt.get(e.ext)+noOfLines);
        }else{
            linesPerExt.set(e.ext,noOfLines)
        }
    });
    await Promise.all(p);
    console.log(linesPerExt);

}

main();
