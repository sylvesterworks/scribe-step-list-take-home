import { cn } from '../lib/cn';

/**
 * Stands in for the step screenshot. Real guides render a captured image with
 * a click target drawn on top; this fakes the shape of one so layout and
 * aspect ratio behave realistically.
 */
export function Screenshot({ hue, className }: { hue: number; className?: string }) {
  return (
    <div
      className={cn('relative h-[140px] w-full overflow-hidden rounded-lg bg-surface-neutral', className)}
      aria-hidden='true'
    >
      <div
        className='absolute inset-0'
        style={{
          background: `linear-gradient(135deg, hsl(${hue} 70% 92%), hsl(${(hue + 40) % 360} 65% 84%))`,
        }}
      />
      {/* Fake text lines. No `dark:` variant: a screenshot is a captured
          image and stays light in both themes, so the lines stay dark too. */}
      <div className='absolute left-4 right-4 top-3.5 h-2 rounded-full bg-black/10' />
      <div className='absolute left-4 top-[30px] h-1.5 w-1/3 rounded-full bg-black/[0.07]' />
      <div
        className='absolute rounded-full border-2'
        style={{
          left: `${18 + (hue % 45)}%`,
          top: '38%',
          width: 44,
          height: 44,
          borderColor: `hsl(${hue} 85% 45%)`,
          boxShadow: `0 0 0 4px hsl(${hue} 85% 45% / 0.2)`,
        }}
      />
    </div>
  );
}
