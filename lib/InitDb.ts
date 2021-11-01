import { MenuItemModel } from './Connection';


export async function initDb(): Promise<void> {
  const count = await MenuItemModel.count();

  if (count < 1) {
    await MenuItemModel.insertMany([
      { category: 'банички и соленки', name: 'баничка с козе сирене и спанак', price: 1 },
      { category: 'банички и соленки', name: 'баничка със сирене и подправки', price: 1 },
      { category: 'курабийки и бисквити', name: 'курабийки', price: 1 },
      { category: 'мини тарталети и кишове', name: 'тарталети с кленов сироп и орех', price: 1 },
      { category: 'мини тарталети и кишове', name: 'тарталети с крем маскарпоне', price: 1 },
      { category: 'мини тарталети и кишове', name: 'тарталети с ментов крем', price: 1 },
      { category: 'мини тарталети и кишове', name: 'чийзкейк в гнездо с горски плодове', price: 1 },
      { category: 'мъфини и къпкейкове', name: 'банофи пай', price: 1 },
      { category: 'мъфини и къпкейкове', name: 'къпкейк с шамфъстък', price: 1 },
      { category: 'мъфини и къпкейкове', name: 'мъфин с морков', price: 1 },
      { category: 'торти', name: 'тарт с плодове', price: 1 }
    ]);
  }
}
