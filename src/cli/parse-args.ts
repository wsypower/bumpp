import { valid as isValidVersion } from "semver";
import { isReleaseType } from "../release-type";
import { VersionBumpOptions } from "../types/version-bump-options";
import { ExitCode } from "./exit-code";
import { usageText } from "./help";
import cac from 'cac'
import {version} from '../../package.json'

/**
 * The parsed command-line arguments
 */
export interface ParsedArgs {
  help?: boolean;
  version?: boolean;
  quiet?: boolean;
  options: VersionBumpOptions;
}

/**
 * Parses the command-line arguments
 */
export function parseArgs(argv: string[]): ParsedArgs {
  try {

const cli = cac('bumpp')

cli
  .version(version)
  .usage('[...files]')
  .option('--preid <preid>', 'ID for prerelease')
  .option('--all', 'Include all files')
  .option('-c, --commit [msg]', 'Commit message', {default: true})
  .option('-t, --tag [tag]', 'Tag name', {default: true})
  .option('-p, --push', 'Push to remote', {default: true})
  .option('--no-verify', 'Skip git verification')
  .option('--ignore-scripts', 'Ignore scripts', {default: false})
  .option('-q, --quiet', 'Quiet mode')
  .option('-v, --version <version>', 'Tagert version')
  .option('-x, --execute <command>', 'Commands to execute after version bumps')
   .help()

 const args = cli.parse().options
 

    let parsedArgs: ParsedArgs = {
      help: args.help as boolean,
      version: args.version as boolean,
      quiet: args.quiet as boolean,
      options: {
        preid: args.preid,
        commit: args.commit,
        tag: args.tag,
        push: args.push,
        all: args.all,
        noVerify: !args.verify,
        files: args['--'],
        ignoreScripts: args.ignoreScripts,
        execute: args.execute,
      }
    };


    // If a version number or release type was specified, then it will mistakenly be added to the "files" array
    if (parsedArgs.options.files && parsedArgs.options.files.length > 0) {
      let firstArg = parsedArgs.options.files[0];

      if (firstArg === "prompt" || isReleaseType(firstArg) || isValidVersion(firstArg)) {
        parsedArgs.options.release = firstArg;
        parsedArgs.options.files.shift();
      }
    }


    return parsedArgs;
  }
  catch (error) {
    // There was an error parsing the command-line args
    return errorHandler(error as Error);
  }
}

function errorHandler(error: Error): never {
  console.error(error.message);
  console.error(usageText);
  return process.exit(ExitCode.InvalidArgument);
}
