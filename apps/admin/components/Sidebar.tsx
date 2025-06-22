import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { 
  Card, 
  CardBody, 
  Button, 
  Divider,
  Switch,
  Chip
} from '@nextui-org/react';
import { 
  HomeIcon, 
  CogIcon, 
  PuzzlePieceIcon,
  DocumentTextIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Plugins', href: '/plugins', icon: PuzzlePieceIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
  { name: 'API Docs', href: '/api/docs', icon: DocumentTextIcon, external: true },
];

export default function Sidebar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <div className="w-64 h-screen bg-background border-r border-divider flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-divider">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">NX</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
            <p className="text-xs text-foreground-500">Fullstack Framework</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = router.pathname === item.href;
          const Icon = item.icon;
          
          if (item.external) {
            return (
              <Button
                key={item.name}
                as="a"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                variant="light"
                className="w-full justify-start h-12"
                startContent={<Icon className="w-5 h-5" />}
                endContent={
                  <div className="ml-auto">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                }
              >
                {item.name}
              </Button>
            );
          }
          
          return (
            <Button
              key={item.name}
              as={Link}
              href={item.href}
              variant={isActive ? "flat" : "light"}
              color={isActive ? "primary" : "default"}
              className="w-full justify-start h-12"
              startContent={<Icon className="w-5 h-5" />}
            >
              {item.name}
            </Button>
          );
        })}
      </nav>

      <Divider />
      
      {/* Theme Toggle */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground-600">Dark Mode</span>
          <Switch
            size="sm"
            isSelected={theme === 'dark'}
            onValueChange={(isSelected) => setTheme(isSelected ? 'dark' : 'light')}
            thumbIcon={({ isSelected }) =>
              isSelected ? (
                <MoonIcon className="w-3 h-3" />
              ) : (
                <SunIcon className="w-3 h-3" />
              )
            }
          />
        </div>
      </div>

      <Divider />
      
      {/* Footer */}
      <div className="p-4">
        <Card className="bg-content2">
          <CardBody className="p-3">
            <div className="flex items-center justify-between text-xs">
              <div>
                <div className="font-medium text-foreground">Version 1.0.0</div>
                <div className="text-foreground-500">Development</div>
              </div>
              <Chip size="sm" color="success" variant="dot">
                Online
              </Chip>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}