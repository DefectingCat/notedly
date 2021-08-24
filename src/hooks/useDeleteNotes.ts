import useStore from '../store';
import cloneDeep from 'lodash/cloneDeep';

const useDeleteNotes = (postId: string) => {
  const { state, setUserState } = useStore();
  const { notes, myNotes } = state;

  if (notes && myNotes) {
    const deepNotes = cloneDeep(notes);
    const deepMyNotes = cloneDeep(myNotes);

    const noteIndex = deepNotes?.findIndex((item) => item.id === postId);
    const myNoteIndex = deepMyNotes?.findIndex((item) => item.id === postId);

    deepNotes.splice(noteIndex, 1);
    deepMyNotes.splice(myNoteIndex, 1);

    setUserState({ ...state, notes: deepNotes, myNotes: deepMyNotes });
  }

  return true;
};

export default useDeleteNotes;
