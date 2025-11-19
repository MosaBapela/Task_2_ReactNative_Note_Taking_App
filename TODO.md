# TODO: Update Add Note Screen Navigation and Fix Category Notes Screen

- [x] Edit app/screens/notes/AddNoteScreen.tsx: Change the Alert's "OK" button onPress in handleSave function from navigation.goBack() to router.push('/') to navigate to home page after saving a note.
- [x] Fix CategoryNotesScreen.tsx: Update to use Expo Router instead of React Navigation to resolve "Cannot read properties of undefined (reading 'params')" error.
