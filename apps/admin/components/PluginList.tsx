import { 
  Card, 
  CardBody, 
  CardHeader,
  Button, 
  Chip,
  Divider,
  Avatar
} from '@nextui-org/react';
import { 
  CogIcon, 
  TrashIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline';

interface Plugin {
  name: string;
  version: string;
  description?: string;
  status: 'active' | 'inactive' | 'error';
  icon?: string;
}

interface PluginListProps {
  plugins: Plugin[];
}

export default function PluginList({ plugins }: PluginListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'error':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <Card className="border border-divider">
      <CardHeader className="p-6 pb-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <PuzzlePieceIcon className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Installed Plugins</h2>
              <p className="text-sm text-foreground-500">Manage your active plugins</p>
            </div>
          </div>
          <Button 
            color="primary" 
            variant="flat"
            startContent={<PuzzlePieceIcon className="w-4 h-4" />}
          >
            Browse Marketplace
          </Button>
        </div>
      </CardHeader>
      
      <CardBody className="p-6 pt-4">
        {plugins.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="w-16 h-16 bg-default-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PuzzlePieceIcon className="w-8 h-8 text-default-500" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No plugins installed</h3>
              <p className="text-sm text-foreground-500 mb-6">
                Browse the marketplace to discover and install plugins
              </p>
              <Button color="primary" variant="flat">
                Explore Marketplace
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {plugins.map((plugin, index) => (
              <div key={index}>
                <div className="flex items-center justify-between p-4 hover:bg-content2 rounded-lg transition-colors">
                  <div className="flex items-center space-x-4">
                    <Avatar
                      showFallback
                      fallback={
                        <PuzzlePieceIcon className="w-5 h-5 text-default-500" />
                      }
                      className="bg-default-100"
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-sm font-medium text-foreground truncate">
                          {plugin.name}
                        </h3>
                        <Chip size="sm" variant="flat" color="default">
                          v{plugin.version}
                        </Chip>
                        <Chip 
                          size="sm" 
                          color={getStatusColor(plugin.status) as any}
                          variant="flat"
                        >
                          {plugin.status}
                        </Chip>
                      </div>
                      {plugin.description && (
                        <p className="text-sm text-foreground-600 truncate">
                          {plugin.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="light"
                      isIconOnly
                      startContent={<CogIcon className="w-4 h-4" />}
                      className="text-default-500"
                    >
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      color="danger"
                      isIconOnly
                      startContent={<TrashIcon className="w-4 h-4" />}
                    >
                    </Button>
                  </div>
                </div>
                {index < plugins.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}