import add from './add';

console.info(add(2, 3));
console.info(['hoge', 'fuga', 'piyo'].includes('piyo'));

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
(async () => {
    console.log('start');
    await wait(2000);
    console.log('end')
})();
