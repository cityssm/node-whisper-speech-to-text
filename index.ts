/* eslint-disable promise/avoid-new */

import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'

import Debug from 'debug'

import { DEBUG_NAMESPACE } from './debug.config.js'
import type { WhisperLanguage } from './types.js'

const debug = Debug(`${DEBUG_NAMESPACE}:index`)

export const WHISPER_PATH = 'whisper'

export interface WhisperOptions {
  /** The path to the whisper executable. Defaults to 'whisper' which assumes the system PATH. */
  whisperPath: string

  model: 'base' | 'large' | 'medium' | 'small' | 'tiny'

  language?: WhisperLanguage
}

export default async function speechToText(
  pathToSoundFile: string,
  whisperOptions?: Partial<WhisperOptions>
): Promise<string> {
  // Output to the temporary directory to avoid cluttering the project directory with transcriptions. The output file will be automatically deleted after processing.
  const outputDirectory = os.tmpdir()

  const options: WhisperOptions = {
    whisperPath: 'whisper',
    model: 'base',
    ...whisperOptions
  }

  const whisperArguments = [
    '--model',
    options.model,
    '--output_dir',
    outputDirectory,
    '--output_format',
    'txt'
  ]

  if (options.language) {
    whisperArguments.push('--language', options.language)
  }

  whisperArguments.push(pathToSoundFile)

  const debugCommand = `${options.whisperPath} ${whisperArguments.join(' ')}`
  debug(`Executing command: ${debugCommand}`)

  let errorOutput: string

  // eslint-disable-next-line promise/avoid-new
  await new Promise((resolve, reject) => {
    execFile(options.whisperPath, whisperArguments, (error, stdout, stderr) => {
      if (error) {
        debug(`Error executing whisper command: ${error.message}`)
        reject(error)
      } else if (stderr) {
        debug(`Whisper command stderr: ${stderr}`)
        errorOutput = stderr
      }

      resolve(stdout.trim())
    })
  })

  debug(
    'Whisper command executed successfully, reading transcription from output file'
  )

  // The output file will have the same name as the input file but with a .txt extension, and it will be located in the temporary directory.
  const outputFilePath = `${outputDirectory}/${pathToSoundFile
    .split('/')
    .pop()
    ?.replace(/\.[^/.]+$/, '')}.txt`

  debug(`Expected output file path: ${outputFilePath}`)

  // Read the transcribed text from the output file and return it.
  const transcription = await fs.readFile(outputFilePath, 'utf-8')

  // Clean up the output file after reading the transcription.
  debug(`Cleaning up output file: ${outputFilePath}`)
  await fs.unlink(outputFilePath)

  return transcription
}
