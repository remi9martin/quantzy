import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary, NotFound } from './components/States.jsx';
import { Landing } from './pages/Landing.jsx';
import { AppShell } from './components/AppShell.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Scanner } from './pages/Scanner.jsx';
import { Explore } from './pages/Explore.jsx';
import { EdgeFeed } from './pages/EdgeFeed.jsx';
import { SignalDetail } from './pages/SignalDetail.jsx';
import { Historical } from './pages/Historical.jsx';
import { Missed } from './pages/Missed.jsx';
import { Social } from './pages/Social.jsx';
import { TraderProfile } from './pages/TraderProfile.jsx';
import { Leaderboard } from './pages/Leaderboard.jsx';
import { Teams } from './pages/Teams.jsx';
import { Challenges } from './pages/Challenges.jsx';
import { Calibration } from './pages/Calibration.jsx';
import { Alerts } from './pages/Alerts.jsx';
import { AIAnalyst } from './pages/AIAnalyst.jsx';
import { Tiers } from './pages/Tiers.jsx';
import { Vault } from './pages/Vault.jsx';
import { Settings } from './pages/Settings.jsx';
import { Methodology } from './pages/Methodology.jsx';

export default function App() {
  return (
    <ErrorBoundary>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/methodology" element={<Methodology />} />
      <Route path="/pricing" element={<Tiers public />} />

      <Route path="/app" element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="scanner" element={<Scanner />} />
        <Route path="explore" element={<Explore />} />
        <Route path="feed" element={<EdgeFeed />} />
        <Route path="signal/:id" element={<SignalDetail />} />
        <Route path="historical" element={<Historical />} />
        <Route path="missed" element={<Missed />} />
        <Route path="social" element={<Social />} />
        <Route path="trader/:name" element={<TraderProfile />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="teams" element={<Teams />} />
        <Route path="challenges" element={<Challenges />} />
        <Route path="calibration" element={<Calibration />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="analyst" element={<AIAnalyst />} />
        <Route path="tiers" element={<Tiers />} />
        <Route path="vault" element={<Vault />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
    </ErrorBoundary>
  );
}
