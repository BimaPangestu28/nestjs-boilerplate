import { Card, CardBody, Chip } from '@nextui-org/react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: 'success' | 'primary' | 'secondary' | 'warning' | 'danger';
  icon?: React.ReactNode;
}

export default function StatsCard({ title, value, subtitle, color, icon }: StatsCardProps) {
  return (
    <Card className="border border-divider hover:shadow-lg transition-shadow duration-200">
      <CardBody className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground-600">{title}</h3>
          {icon && (
            <div className={`p-2 rounded-lg bg-${color}-100/50`}>
              {icon}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-foreground">{value}</div>
          <div className="flex items-center space-x-2">
            <Chip size="sm" color={color} variant="flat">
              {subtitle}
            </Chip>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}