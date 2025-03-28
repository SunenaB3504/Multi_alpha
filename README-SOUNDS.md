# Sound Files Information for Multiplication Adventure

## Required Sound Files

Multiplication Adventure requires the following sound files to be present in the `sounds/` directory:

- `click.mp3` - Used for button clicks and card flips
- `correct.mp3` - Played when an answer is correct
- `incorrect.mp3` - Played when an answer is wrong
- `complete.mp3` - Played when a level or game is completed
- `error.mp3` - Played when an error occurs
- `points.mp3` - Played when points are earned
- `card-flip.mp3` - Played when a card is flipped
- `match.mp3` - Played when cards match
- `mismatch.mp3` - Played when cards don't match
- `victory.mp3` - Played for victory celebrations
- `background.mp3` - Background music

## Creating Sound Files

You have several options to add sound files:

### Option 1: Run the batch file

Run the `create-sounds-directory.bat` file included with the application. This will create empty placeholder sounds that you can replace with actual sound files later.

### Option 2: Create the directory manually

1. Create a `sounds` directory in the application root folder
2. Add the required sound files listed above

### Option 3: Use in-memory sounds

The application has a fallback mechanism that uses in-memory sounds when sound files are missing. This works automatically, but the sound quality won't be as good as custom sound files.

## Troubleshooting

If you see a "Missing Sound Files" alert:

1. Click "Fix Sounds" to use in-memory sounds
2. Run `create-sounds-directory.bat` to create the sound files directory
3. Replace the placeholder files with actual sound files for the best experience

## Free Sound Resources

You can find free sound effects at:
- [Freesound.org](https://freesound.org/)
- [Pixabay Sounds](https://pixabay.com/sound-effects/)
- [Zapsplat](https://www.zapsplat.com/)
