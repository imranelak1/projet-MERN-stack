import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockAnalytics } from '../mocks/mockData'; // Keep using mock data for analytics
import StatCard from '../components/dashboard/StatCard';
import TaskCompletionChart from '../components/dashboard/TaskCompletionChart';
import TaskDistributionChart from '../components/dashboard/TaskDistributionChart';
import UserActivityChart from '../components/dashboard/UserActivityChart';
import UsersTable from '../components/dashboard/UsersTable';
import axios from 'axios';

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState('7');

  // Use mock data for analytics
  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: async () => {
      // Simulate API delay with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAnalytics;
    }
  });

  // Fetch real data for users from the backend
  const { data: users, isLoading: isUsersLoading, isError: isUsersError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/all-users'); 
      return response.data; // This should now be an array
    }
  });
  
  const isLoading = isAnalyticsLoading || isUsersLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isUsersError) {
    return <div>Error loading users data</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {analytics?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analytics.summary.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analytics?.taskCompletionRate && (
          <TaskCompletionChart data={analytics.taskCompletionRate} />
        )}
        {analytics?.taskDistribution && (
          <TaskDistributionChart data={analytics.taskDistribution} />
        )}
      </div>

      {analytics?.userActivity && (
        <UserActivityChart data={analytics.userActivity} />
      )}
      
      {users && <UsersTable users={users} />}
    </div>
  );
};

export default AdminDashboard;
