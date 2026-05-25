/* eslint-disable promise/avoid-new */

import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import Debug from 'debug'

import { DEBUG_NAMESPACE } from './debug.config.js'
import type { WhisperLanguage } from './types.js'

const debug = Debug(`${DEBUG_NAMESPACE}:index`)

export const WHISPER_PATH = 'whisper'

export interface WhisperOptions {
  /** The path to the whisper executable. Defaults to 'whisper' which assumes the system PATH. */
  whisperPath: string

  /**
   * The size of the Whisper model to use for transcription. The available models are:
   * - 'tiny': The smallest and fastest model, but with lower accuracy.
   * - 'base': A small model that offers a good balance between speed and accuracy. This is the default model.
   * - 'small': A medium-sized model that provides better accuracy than the base model, but is slower.
   * - 'medium': A larger model that offers even better accuracy than the small model, but is slower.
   * - 'large': The largest and most accurate model, but also the slowest.
   */
  model: 'base' | 'large' | 'medium' | 'small' | 'tiny'

  /**
   * The language of the audio to be transcribed.
   * This can be specified as either a two-letter ISO 639-1 code (e.g., 'en' for English, 'es' for Spanish, etc.)
   * or the full language name (e.g., 'English', 'Spanish', etc.).
   * If not specified, the Whisper model will attempt to automatically detect the language of the audio.
   */
  language?: WhisperLanguage
}

/**
 * Transcribes the audio from the specified sound file using OpenAI's Whisper model and returns the transcribed text.
 * @param pathToSoundFile - The path to the sound file to be transcribed.
 * This can be an absolute path or a relative path from the current working directory.
 * The file must be in a format supported by the Whisper model (e.g., WAV, MP3, etc.).
 * @param whisperOptions - Optional settings for the Whisper model, such as the model size and language.
 * @returns A promise that resolves to the transcribed text.
 */
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

  // eslint-disable-next-line promise/avoid-new
  await new Promise((resolve, reject) => {
    execFile(options.whisperPath, whisperArguments, (error, stdout, stderr) => {
      if (error) {
        debug(`Error executing whisper command: ${error.message}`)
        reject(error)
      } else if (stderr) {
        debug(`Whisper command stderr: ${stderr}`)
      }

      resolve(stdout.trim())
    })
  })

  debug(
    'Whisper command executed successfully, reading transcription from output file'
  )

  const outputFileName = `${path.basename(pathToSoundFile, path.extname(pathToSoundFile))}.txt`

  debug(`Expected output file name: ${outputFileName}`)

  // The output file will have the same name as the input file but with a .txt extension, and it will be located in the temporary directory.
  const outputFilePath = path.join(outputDirectory, outputFileName)

  debug(`Expected output file path: ${outputFilePath}`)

  // Read the transcribed text from the output file and return it.
  const transcription = await fs.readFile(outputFilePath, 'utf-8')

  // Clean up the output file after reading the transcription.
  debug(`Cleaning up output file: ${outputFilePath}`)
  await fs.unlink(outputFilePath)

  return transcription
}
