# OpenAI Whisper for Node

[![DeepSource](https://app.deepsource.com/gh/cityssm/node-whisper-speech-to-text.svg/?label=active+issues&show_trend=true&token=5bcKTrYXN2Yhxo2JumotW1BK)](https://app.deepsource.com/gh/cityssm/node-whisper-speech-to-text/)
[![codecov](https://codecov.io/gh/cityssm/node-whisper-speech-to-text/graph/badge.svg?token=DQW707DSN9)](https://codecov.io/gh/cityssm/node-whisper-speech-to-text)

**Locally converts recorded audio, like WAV files and MP3s, to text using OpenAI Whisper.**

## Prerequisites

Like other Node wrappers around OpenAI Whisper,
this package requires a few tools to work.

### Python

Download from the [official Python website](https://www.python.org/).
For best results, make sure to add Python to the path.

### FFmpeg

For audio processing.

On Windows via Chocolatey:

```cmd
choco install ffmpeg
```

On Debian-based Linux:

```bash
sudo apt-get install ffmpeg
```

### OpenAI Whisper

Probably the easiest way to install Whisper is using the Python package manager,
`pip`.

```cmd
pip install -U openai-whisper
```

To test your installation:

```cmd
whisper --help
```

## Installation

```bash
npm install @cityssm/whisper-speech-to-text
```

## Usage

```javascript
import speechToText from '@cityssm/whisper-speech-to-text'

const basicTranscription = await speechToText('path/to/audioFile.mp3')

const transcriptionWithOptions = await speechToText('path/to/audioFile.wav', {
  whisperPath: 'path/to/whisper',
  model: 'large',
  language: 'en'
})
```
