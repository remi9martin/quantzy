import { Link } from 'react-router-dom';
import { Component } from 'react';
import { MascotMark, Mascot } from './Mascot.jsx';

/* -------------------------------------------------------------------------- */
/* Skeletons                                                                  */
/* -------------------------------------------------------------------------- */

export function Skeleton({ className = '', style }) {
  return (
    <div
      className={`relative overflow-hidden bg-white/5 rounded ${className}`}
      style={style}
      aria-hidden="true"
    >
      <span className="absolute inset-0 shimmer" />
    </div>
  );
}

export function CardSkeleton({ rows = 3 }) {
  return (
    <div className="hairline rounded-xl bg-carbon p-4">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-5 w-3/4 mt-3" />
      <Skeleton className="h-2 w-full mt-3" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full mt-2" />
      ))}
    </div>
  );
}

export function FeedSkeleton({ count = 4 }) {
  return (
    <div className="grid lg:grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty states                                                               */
/* -------------------------------------------------------------------------- */

export function EmptyState({ title = 'Nothing here yet.', description, action }) {
  return (
    <div className="hairline rounded-2xl bg-carbon p-10 text-center max-w-[520px] mx-auto">
      <Mascot size={120} className="mx-auto" />
      <div className="font-display text-[22px] mt-3 text-white">{title}</div>
      {description && <p className="text-[13px] text-slate1 mt-2 max-w-[40ch] mx-auto">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Error boundary                                                             */
/* -------------------------------------------------------------------------- */

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    if (typeof console !== 'undefined') {
      console.error('Quantzy error:', error, info);
    }
  }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen surface-paper grid place-items-center px-6 py-16">
          <div className="hairline rounded-2xl bg-carbon p-8 max-w-[520px] text-center">
            <MascotMark size={48} className="mx-auto" />
            <div className="font-display text-[28px] tracking-tight mt-3 text-white">A signal misfired.</div>
            <p className="text-[13px] text-slate1 mt-2">Quantzy caught an error in this view. Reload to try again — your session and watchlist are safe.</p>
            <pre className="text-[11px] text-slate1 mt-3 bg-white/5 hairline rounded-md p-2 text-left max-h-[120px] overflow-auto whitespace-pre-wrap">
              {String(this.state.error?.message || this.state.error)}
            </pre>
            <div className="mt-4 flex gap-2 justify-center">
              <button onClick={() => location.reload()} className="btn btn-cerulean btn-sm">Reload</button>
              <Link to="/app" className="btn btn-ghost btn-sm">Back to dashboard</Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* -------------------------------------------------------------------------- */
/* 404 / route fallback                                                       */
/* -------------------------------------------------------------------------- */

export function NotFound() {
  return (
    <div className="surface-paper min-h-screen grid place-items-center px-6">
      <div className="hairline rounded-2xl bg-carbon p-10 max-w-[520px] text-center">
        <Mascot size={140} className="mx-auto" />
        <div className="font-display text-[34px] mt-3 text-white">Lost the trail.</div>
        <p className="text-[13px] text-slate1 mt-2">That route does not resolve. The page may have moved or never existed.</p>
        <Link to="/app" className="btn btn-cerulean btn-sm mt-4">Back to terminal</Link>
      </div>
    </div>
  );
}
