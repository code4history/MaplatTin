import func1 from './func1'

onmessage = (event) => {
    postMessage(func1(event.data));
};