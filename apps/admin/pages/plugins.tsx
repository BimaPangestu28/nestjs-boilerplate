import { useState } from 'react';
import Layout from '../components/Layout';

export default function PluginsPage() {
  const [activeTab, setActiveTab] = useState('installed');

  const tabs = [
    { id: 'installed', name: 'Installed', count: 3 },
    { id: 'marketplace', name: 'Marketplace', count: 12 },
    { id: 'updates', name: 'Updates', count: 1 },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plugin Management</h1>
          <p className="text-gray-600">Manage and discover plugins for your application</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
                <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-900">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'installed' && <InstalledPlugins />}
          {activeTab === 'marketplace' && <MarketplacePlugins />}
          {activeTab === 'updates' && <UpdatesPlugins />}
        </div>
      </div>
    </Layout>
  );
}

function InstalledPlugins() {
  const plugins = [
    { name: 'Authentication', version: '1.2.0', status: 'active', description: 'JWT authentication with role-based access control' },
    { name: 'Database', version: '2.1.0', status: 'active', description: 'TypeORM database integration' },
    { name: 'Validation', version: '1.0.5', status: 'active', description: 'Request validation and transformation' },
  ];

  return (
    <div className="divide-y divide-gray-200">
      {plugins.map((plugin, index) => (
        <div key={index} className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  🔌
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{plugin.name}</h3>
                  <p className="text-sm text-gray-500">{plugin.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-500">v{plugin.version}</span>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                {plugin.status}
              </span>
              <button className="px-3 py-1 text-xs text-gray-600 hover:text-gray-900">
                Settings
              </button>
              <button className="px-3 py-1 text-xs text-red-600 hover:text-red-900">
                Uninstall
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MarketplacePlugins() {
  const plugins = [
    { name: 'E-commerce', price: 'Free', downloads: '1.2k', rating: 4.8, description: 'Complete e-commerce solution with cart and payments' },
    { name: 'Analytics', price: '$29', downloads: '856', rating: 4.6, description: 'Advanced analytics and reporting dashboard' },
    { name: 'Email Marketing', price: 'Free', downloads: '2.1k', rating: 4.9, description: 'Email campaigns and automation tools' },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plugins.map((plugin, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-xl">
                🚀
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{plugin.name}</h3>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>⭐ {plugin.rating}</span>
                  <span>•</span>
                  <span>{plugin.downloads} downloads</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{plugin.description}</p>
            <div className="flex items-center justify-between">
              <span className="font-medium text-blue-600">{plugin.price}</span>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                Install
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpdatesPlugins() {
  return (
    <div className="p-6">
      <div className="text-center text-gray-500">
        <div className="text-4xl mb-2">🔄</div>
        <div>1 plugin update available</div>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Update All
        </button>
      </div>
    </div>
  );
}