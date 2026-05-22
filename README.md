# OpenAI Whisper for Node

## Prerequisites

This package requires a few tools to work.

### Python

Download from the [official Python website](https://www.python.org/).
For best results, make sure to add Python to the path.

### FFmpeg

For audio processing. On Windows via Chocolatey:

``` cmd
choco install ffmpeg
```

### OpenAI Whisper

Probably the easiest way to install Whisper is using the Python package manager,
`pip`.

``` cmd
pip install -U openai-whisper
```

To test your installation:

``` cmd
whisper --help
```

## Installation

``` bash
npm install @cityssm/whisper-speech-to-text
```
