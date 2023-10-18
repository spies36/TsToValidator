import figlet from 'figlet';
import { Command } from 'commander';
import { depthFirstTypeFinder } from './utils/typesFinder';


const cliRunner = new Command();

cliRunner
    .version("1.0.0")
    .description("CLI for creating js validations code from TS types")
    .option("-l, --ls  [value]", "List directory contents")
    .parse(process.argv);


async function main() {
    console.log(figlet.textSync("Validation From TS"));
    console.log('Finding Types.ts files');
    let files = await depthFirstTypeFinder(process.cwd());

    if (!files || files.length === 0) {
        console.log('No Types Files Found');
        process.exit(0);
    }

    console.log(files);

}


main();