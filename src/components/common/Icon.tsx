import { ICONS } from '@/constants/tokens';
import type { IconName } from '@/types';

interface IconProps {
  name: IconName;
  size?: number;
}

/**
 * The four line icons the design ships, rendered at the requested size.
 * Mirrors the design's `icon(name, size)` helper, including its stroke setup.
 */
export function Icon({ name, size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: ICONS[name] ?? '' }}
    />
  );
}
