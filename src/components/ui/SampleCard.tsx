import type { SampleItem } from '../../types/sample';
import styles from './SampleCard.module.css';

export function SampleCard({ item }: { item: SampleItem }) {
  return <article className={styles.card}><h2>{item.name}</h2><p>{item.description}</p><small>{item.id}</small></article>;
}
