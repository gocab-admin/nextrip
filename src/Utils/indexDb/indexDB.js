import Dexie from 'dexie';

const db = new Dexie('ReactDexie');

db.version(1).stores({
  testData: 'datakey'
});

export default db;
