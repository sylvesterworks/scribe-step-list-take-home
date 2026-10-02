import { createContext } from 'react';

/**
 * True while the page is in edit mode. App provides it; any component reads it
 * with `useContext(EditModeContext)`. Read-only on purpose: only the header
 * button changes the mode, and it lives in App.
 */
export const EditModeContext = createContext(false);
