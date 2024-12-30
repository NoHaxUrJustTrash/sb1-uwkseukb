import React from 'react';
import { Trophy } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatTime } from '../../lib/utils';

interface LeaderboardEntry {
  username: string;
  total_time: number;
}

export const Leaderboard: React.FC = () => {
  const [entries, setEntries] = React.useState<LeaderboardEntry[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from('weekly_productivity')
      .select('username, total_time')
      .ilike('username', `%${searchQuery}%`)
      .order('total_time', { ascending: false })
      .limit(10);

    if (!error && data) {
      setEntries(data);
    }
  };

  React.useEffect(() => {
    fetchLeaderboard();
  }, [searchQuery]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-semibold">Weekly Leaderboard</h2>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
        />
      </div>

      <div className="space-y-2">
        {entries.map((entry, index) => (
          <div
            key={entry.username}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
          >
            <div className="flex items-center gap-3">
              <span className="font-medium">{index + 1}.</span>
              <span>{entry.username}</span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatTime(entry.total_time)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};