import { ImageResponse } from 'next/og';

export const alt =
  'Mark Meston — minimal dark grid typography card';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          letterSpacing: '0.28em',
          background: '#000000',
          color: '#FFFFFF',
          position: 'relative',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 47% 42%, transparent 54%, rgba(255,255,255,0.082) 100%)',
          }}
        />

        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(-30deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 38px)',
            opacity: 0.45,
          }}
        />

        <div
          aria-hidden
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            padding: '48px 66px',
            border: '2px solid rgba(255,255,255,0.22)',
            background: 'rgba(0,0,0,0.58)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 22,
              fontSize: 68,
              fontWeight: 800,
              textTransform: 'uppercase',
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
              textShadow:
                '0 0 34px rgba(255,255,255,0.24), 0 0 1px rgba(255,255,255,1)',
              lineHeight: 1,
            }}
          >
            <span>MARK</span>
            <span>MESTON</span>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 19,
              fontWeight: 600,
              letterSpacing: '0.42em',
              textTransform: 'uppercase',
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
              opacity: 0.8,
            }}
          >
            FRONT GATE
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
