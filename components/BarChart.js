export default function BarChart({ data, formatLabel }) {
  const max = Math.max(1, ...data.map(d => d.count))

  return (
    <div className="bc-wrap">
      {data.map((d, i) => (
        <div key={i} className="bc-col">
          <div className="bc-bar-track">
            <div className="bc-bar" style={{ height: `${(d.count / max) * 100}%` }}>
              {d.count > 0 && <span className="bc-value">{d.count}</span>}
            </div>
          </div>
          <span className="bc-label">{formatLabel ? formatLabel(d.key) : d.key}</span>
        </div>
      ))}

      <style jsx>{`
        .bc-wrap {
          display: flex;
          align-items: flex-end;
          gap: .5rem;
          height: 220px;
          padding-top: 1.5rem;
        }
        .bc-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          gap: .5rem;
          min-width: 0;
        }
        .bc-bar-track {
          flex: 1;
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .bc-bar {
          width: 60%;
          min-width: 6px;
          background: var(--cir-accent);
          border-radius: 2px 2px 0 0;
          position: relative;
          transition: height .3s ease;
        }
        .bc-value {
          position: absolute;
          top: -1.3rem;
          left: 50%;
          transform: translateX(-50%);
          font-family: var(--cir-sans);
          font-size: .62rem;
          font-weight: 600;
          color: var(--cir-fg2);
          white-space: nowrap;
        }
        .bc-label {
          font-family: var(--cir-sans);
          font-size: .6rem;
          font-weight: 400;
          color: var(--cir-fg2);
          text-align: center;
          white-space: nowrap;
        }
      `}</style>
    </div>
  )
}
