import func2 from './func2'

onmessage = (event) => {
    postMessage(func2(event.data));
};