import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import { 
  Button,
  Chip,
  Card,
  CardBody,
  CardHeader,
  Progress
} from '@nextui-org/react';
import { 
  ArrowPathIcon,
  ServerIcon,
  CpuChipIcon,
  PuzzlePieceIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import StatsCard from '../components/StatsCard';
import PluginList from '../components/PluginList';

interface DashboardProps {
  initialStats: {
    health: any;
    appInfo: any;
    plugins: any;
  };
}

export default function Dashboard({ initialStats }: DashboardProps) {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(false);

  const refreshStats = async () => {
    setLoading(true);
    try {
      const [health, appInfo, plugins] = await Promise.all([
        fetch('/api/health').then(r => r.json()),
        fetch('/api').then(r => r.json()),
        fetch('/api/plugins').then(r => r.json()),
      ]);
      
      setStats({ health, appInfo, plugins });
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {stats.appInfo.name}
            </h1>
            <p className="text-foreground-600 mt-1">{stats.appInfo.description}</p>
          </div>
          <Button
            color="primary"
            variant="flat"
            onPress={refreshStats}
            isLoading={loading}
            startContent={!loading && <ArrowPathIcon className="w-4 h-4" />}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="System Status"
            value={stats.health.status.toUpperCase()}
            subtitle={`Uptime: ${Math.round(stats.health.uptime)}s`}
            color="success"
            icon={<ServerIcon className="w-5 h-5 text-success-600" />}
          />
          <StatsCard
            title="Memory Usage"
            value={`${stats.health.memory.used}MB`}
            subtitle={`Total: ${stats.health.memory.total}MB`}
            color="primary"
            icon={<CpuChipIcon className="w-5 h-5 text-primary-600" />}
          />
          <StatsCard
            title="Active Plugins"
            value={stats.plugins.total.toString()}
            subtitle="Loaded plugins"
            color="secondary"
            icon={<PuzzlePieceIcon className="w-5 h-5 text-secondary-600" />}
          />
        </div>

        {/* Framework Features */}
        <Card className="border border-divider">
          <CardHeader className="p-6 pb-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success-100 rounded-lg">
                <CheckCircleIcon className="w-5 h-5 text-success-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Framework Features</h2>
                <p className="text-sm text-foreground-500">Built-in capabilities and tools</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-6 pt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {stats.appInfo.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-content2 rounded-lg">
                  <div className="w-2 h-2 bg-success-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm text-foreground font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* System Performance */}
        <Card className="border border-divider">
          <CardHeader className="p-6 pb-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-warning-100 rounded-lg">
                <CpuChipIcon className="w-5 h-5 text-warning-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">System Performance</h2>
                <p className="text-sm text-foreground-500">Real-time system metrics</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Memory Usage</span>
                  <span className="text-sm text-foreground-600">
                    {stats.health.memory.used}MB / {stats.health.memory.total}MB
                  </span>
                </div>
                <Progress 
                  value={(stats.health.memory.used / stats.health.memory.total) * 100} 
                  color="primary"
                  size="sm"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Plugin Load</span>
                  <span className="text-sm text-foreground-600">
                    {stats.plugins.total} / 10 plugins
                  </span>
                </div>
                <Progress 
                  value={(stats.plugins.total / 10) * 100} 
                  color="secondary"
                  size="sm"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Plugins List */}
        <PluginList plugins={stats.plugins.plugins} />
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const [health, appInfo, plugins] = await Promise.all([
      fetch(`${baseUrl}/api/health`).then(r => r.json()),
      fetch(`${baseUrl}/api`).then(r => r.json()),
      fetch(`${baseUrl}/api/plugins`).then(r => r.json()),
    ]);

    return {
      props: {
        initialStats: { health, appInfo, plugins },
      },
    };
  } catch (error) {
    console.error('Failed to fetch initial data:', error);
    
    // Fallback data
    return {
      props: {
        initialStats: {
          health: { status: 'unknown', uptime: 0, memory: { used: 0, total: 0 } },
          appInfo: { name: 'NX Fullstack Framework', description: 'Loading...', features: [] },
          plugins: { plugins: [], total: 0 },
        },
      },
    };
  }
};