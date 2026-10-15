/**
 * Catalog data transcribed verbatim from the source design.
 *
 * Image URLs point at Wikimedia Commons exactly as the design does; each
 * `grad` string layers the photo over a gradient so the lot still renders
 * correctly when the remote image is unavailable.
 */
import type { Category, PipelineStage, Product } from '@/types';

export const CATS: Category[] = [
{ key:'precious', name:'Precious Metals', sub:['Gold','Silver','Platinum','Palladium'], grad:'url("https://commons.wikimedia.org/wiki/Special:FilePath/Golden%20nugget.jpg?width=1200") center/cover, linear-gradient(140deg,#3a3226,#0e0e10)', types:['Gold','Platinum','Silver'] },
{ key:'gemstone', name:'Gemstones', sub:['Diamond','Ruby','Emerald','Sapphire','Tanzanite'], grad:'url("https://commons.wikimedia.org/wiki/Special:FilePath/Amity%20Diamonds%20diamante%20Uncut-En-Bruto.jpg?width=1200") center/cover, linear-gradient(140deg,#3a1230,#12123a)', types:['Diamond','Ruby','Emerald','Sapphire'] },
{ key:'industrial', name:'Industrial Minerals', sub:['Quartz','Limestone','Gypsum','Mica','Graphite','Dolomite','Silica Sand','Phosphate'], grad:'url("https://commons.wikimedia.org/wiki/Special:FilePath/Quartz%20Br%C3%A9sil.jpg?width=1200") center/cover, linear-gradient(140deg,#2a2f1a,#14140e)', types:['Quartz','Limestone','Gypsum','Mica','Graphite'] },
{ key:'base', name:'Base & Alloy Metals', sub:['Copper','Nickel','Cobalt','Iron Ore','Aluminium','Zinc & Lead','Chromite','Manganese'], grad:'url("https://commons.wikimedia.org/wiki/Special:FilePath/NatCopper.jpg?width=1200") center/cover, linear-gradient(140deg,#2a1f14,#0e0e10)', types:['Copper','Nickel','Cobalt','Iron Ore','Manganese'] },
{ key:'energy', name:'Energy & Strategic Minerals', sub:['Lithium','Vanadium','Tungsten','Uranium','Coal'], grad:'url("https://commons.wikimedia.org/wiki/Special:FilePath/Bituminous%20coal.jpg?width=1200") center/cover, linear-gradient(140deg,#1a1a1e,#0a0a0c)', types:['Lithium','Vanadium','Tungsten','Uranium','Coal'] },
];

export const PRODUCTS: Product[] = [
{ id:'gold', name:'Gold Concentrate', category:'Precious Metals', catKey:'precious', subCategory:'Gold', seller:'Ashanti Refining Co.', sellerType:'Refinery', grade:'99.9%', region:'Obuasi, Ghana', price:'$2,410', unit:'oz', stock:'745 g', grad:'url("https://commons.wikimedia.org/wiki/Special:FilePath/Gold-crystals.jpg?width=1200") center/cover, linear-gradient(140deg,#f3d27a,#b8860b)' },
{ id:'silver', name:'Silver Bullion', category:'Precious Metals', catKey:'precious', subCategory:'Silver', seller:'Copperbelt Metals', sellerType:'Refinery', grade:'99.9%', region:'Kitwe, Zambia', price:'$31', unit:'oz', stock:'12 kg', grad:'url("https://commons.wikimedia.org/wiki/Special:FilePath/Silver%20crystal.jpg?width=1200") center/cover, linear-gradient(140deg,#dfe4ea,#8b97a3)' },
{ id:'platinum', name:'Platinum Sponge', category:'Precious Metals', catKey:'precious', subCategory:'Platinum', seller:'Bushveld Precious', sellerType:'Refinery', grade:'99.95%', region:'Rustenburg, ZA', price:'$980', unit:'oz', stock:'320 g', grad:'url("https://commons.wikimedia.org/wiki/Special:FilePath/Platinum%20crystals.jpg?width=1200") center/cover, linear-gradient(140deg,#d9dee4,#9aa6b2)' },
{ id:'diamond', name:'Rough Diamond', category:'Gemstones', catKey:'gemstone', subCategory:'Diamond', seller:'Okavango Diamond', sellerType:'Trader', grade:'VS1', region:'Gaborone, BW', price:'$1,200', unit:'ct', stock:'860 ct', grad:'url("https://commons.wikimedia.org/wiki/Special:FilePath/Amity%20Diamonds%20diamante%20Uncut-En-Bruto.jpg?width=1200") center/cover, linear-gradient(140deg,#bfe3ff,#3a5f8a)' },
{ id:'emerald', name:'Emerald Lot', category:'Gemstones', catKey:'gemstone', subCategory:'Emerald', seller:'Kagem Mining Coop', sellerType:'Cooperative', grade:'Vivid', region:'Kagem, Zambia', price:'$750', unit:'ct', stock:'610 ct', grad:'url("https://commons.wikimedia.org/wiki/Special:FilePath/Smaragd.jpg?width=1200") center/cover, linear-gradient(140deg,#3fb984,#0a5c3a)' },
{ id:'copper', name:'Copper Cathode', category:'Base & Alloy Metals', catKey:'base', subCategory:'Copper', seller:'Katanga Minerals', sellerType:'Trader', grade:'Grade A', region:'Kolwezi, DRC', price:'$9.20', unit:'kg', stock:'820 MT', grad:'url("https://commons.wikimedia.org/wiki/Special:FilePath/Native%20Copper%20Macro%20Digon3.jpg?width=1200") center/cover, linear-gradient(140deg,#d98a4e,#8a4a1e)' },
{ id:'lithium', name:'Lithium Carbonate', category:'Energy & Strategic Minerals', catKey:'energy', subCategory:'Lithium', seller:'Bikita Lithium Ltd', sellerType:'Refinery', grade:'99.5%', region:'Bikita, ZW', price:'$14', unit:'kg', stock:'1,200 MT', grad:'url("https://commons.wikimedia.org/wiki/Special:FilePath/Spodumene.jpg?width=1200") center/cover, linear-gradient(140deg,#8fb0d8,#3a5578)' },
{ id:'quartz', name:'High-Purity Quartz', category:'Industrial Minerals', catKey:'industrial', subCategory:'Quartz', seller:'Arusha Quartz Coop', sellerType:'Cooperative', grade:'99.5% SiO₂', region:'Arusha, TZ', price:'$0.90', unit:'kg', stock:'6,000 MT', grad:'url("https://commons.wikimedia.org/wiki/Special:FilePath/Quartz%20Br%C3%A9sil.jpg?width=1200") center/cover, linear-gradient(140deg,#e6ebf0,#a7b2bd)' },
];

/** Buy pipeline: verification -> escrow -> delivery. */
export const BUY_STAGES: PipelineStage[] = [
{ title:'Request submitted', sub:'Order logged, no payment taken yet' },
{ title:'Third-party verification', sub:'Lot, seller and documents independently checked' },
{ title:'Pricing confirmed', sub:'Final rate locked by our trading desk' },
{ title:'Payment in escrow', sub:'Funds held in smart-contract escrow' },
{ title:'Delivery tracking', sub:'Bonded, insured transit to your facility' },
{ title:'Order complete', sub:'Custody transferred and escrow released' },
];

/** Sell pipeline: inspection -> assay -> offer -> accept -> paid. */
export const SELL_STAGES: PipelineStage[] = [
{ title:'Details submitted', sub:'Your submission is received and queued for a verification visit' },
{ title:'On-site verification', sub:'Our verification team visits your location and checks the mineral in person' },
{ title:'Packed for dispatch', sub:'Verified mineral is packed and sealed for shipping' },
{ title:'Received by Mineral Bridge', sub:'Consignment arrived and checked in at our facility' },
{ title:'Support contact for payment', sub:'Our support team contacts you to confirm and arrange payment' },
{ title:'Payment complete', sub:'Payment released to you as agreed with support' },
];

export const stagesFor = (side: string): PipelineStage[] =>
  side === 'SELL' ? SELL_STAGES : BUY_STAGES;

export const stageIndexFor = (side: string, progress: string): number => {
  const s = stagesFor(side);
  return Math.max(0, Math.min(s.length - 1, Math.round((parseFloat(progress) / 100) * s.length) - 1));
};

export const stageLabelFor = (side: string, progress: string): string =>
  stagesFor(side)[stageIndexFor(side, progress)].title;
