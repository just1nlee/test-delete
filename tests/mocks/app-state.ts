import { readable, writable } from 'svelte/store';

// static page object, mimic's $page store
const pageValue = {
  url: new URL('http://localhost/')   
};

// readable() and showing .url property
export const page = Object.assign(
    // make it a store and spread the URL properly
    readable(pageValue),   
    pageValue              
);

// shows "is navigating" state
export const navigating = writable(null);

// store for the updated flag, exported as .subscribe
export const updated    = { subscribe: writable(false).subscribe };
