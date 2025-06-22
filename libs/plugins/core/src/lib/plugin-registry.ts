import { Injectable } from '@nestjs/common';
import { PluginMetadata } from './interfaces';

export interface RegistryPlugin extends PluginMetadata {
  downloadUrl: string;
  downloadCount: number;
  rating: number;
  reviewCount: number;
  screenshots?: string[];
  lastUpdated: Date;
  isOfficial: boolean;
  price: number; // 0 for free
  tags: string[];
}

@Injectable()
export class PluginRegistry {
  private plugins: RegistryPlugin[] = [
    {
      name: 'authentication',
      version: '1.2.0',
      description: 'JWT authentication with role-based access control',
      author: 'NX Fullstack Team',
      category: 'Security',
      icon: '🔐',
      homepage: 'https://example.com/auth-plugin',
      repository: 'https://github.com/nx-fullstack/auth-plugin',
      license: 'MIT',
      downloadUrl: 'https://registry.nx-fullstack.com/plugins/authentication/1.2.0',
      downloadCount: 1250,
      rating: 4.8,
      reviewCount: 45,
      lastUpdated: new Date('2024-01-15'),
      isOfficial: true,
      price: 0,
      tags: ['auth', 'jwt', 'security', 'rbac'],
    },
    {
      name: 'ecommerce',
      version: '2.1.0',
      description: 'Complete e-commerce solution with cart, payments, and inventory',
      author: 'Commerce Solutions Inc.',
      category: 'E-commerce',
      icon: '🛒',
      homepage: 'https://example.com/ecommerce-plugin',
      repository: 'https://github.com/commerce-solutions/ecommerce-plugin',
      license: 'Commercial',
      downloadUrl: 'https://registry.nx-fullstack.com/plugins/ecommerce/2.1.0',
      downloadCount: 856,
      rating: 4.6,
      reviewCount: 32,
      lastUpdated: new Date('2024-01-10'),
      isOfficial: false,
      price: 99,
      tags: ['ecommerce', 'payments', 'cart', 'inventory'],
    },
    {
      name: 'analytics',
      version: '1.5.0',
      description: 'Advanced analytics and reporting dashboard',
      author: 'Analytics Pro',
      category: 'Analytics',
      icon: '📊',
      homepage: 'https://example.com/analytics-plugin',
      repository: 'https://github.com/analytics-pro/analytics-plugin',
      license: 'Commercial',
      downloadUrl: 'https://registry.nx-fullstack.com/plugins/analytics/1.5.0',
      downloadCount: 654,
      rating: 4.7,
      reviewCount: 28,
      lastUpdated: new Date('2024-01-08'),
      isOfficial: false,
      price: 49,
      tags: ['analytics', 'dashboard', 'reporting', 'charts'],
    },
    {
      name: 'media-manager',
      version: '1.0.3',
      description: 'File upload, image processing, and media management',
      author: 'Media Tech',
      category: 'Media',
      icon: '📁',
      homepage: 'https://example.com/media-plugin',
      repository: 'https://github.com/media-tech/media-plugin',
      license: 'MIT',
      downloadUrl: 'https://registry.nx-fullstack.com/plugins/media-manager/1.0.3',
      downloadCount: 2100,
      rating: 4.9,
      reviewCount: 67,
      lastUpdated: new Date('2024-01-12'),
      isOfficial: true,
      price: 0,
      tags: ['media', 'upload', 'images', 'files'],
    },
    {
      name: 'email-marketing',
      version: '1.3.0',
      description: 'Email campaigns, automation, and newsletter management',
      author: 'Email Solutions',
      category: 'Marketing',
      icon: '📧',
      homepage: 'https://example.com/email-plugin',
      repository: 'https://github.com/email-solutions/email-plugin',
      license: 'MIT',
      downloadUrl: 'https://registry.nx-fullstack.com/plugins/email-marketing/1.3.0',
      downloadCount: 890,
      rating: 4.5,
      reviewCount: 34,
      lastUpdated: new Date('2024-01-05'),
      isOfficial: false,
      price: 0,
      tags: ['email', 'marketing', 'campaigns', 'automation'],
    },
  ];

  /**
   * Search plugins in registry
   */
  searchPlugins(query: string, filters?: {
    category?: string;
    tags?: string[];
    priceRange?: [number, number];
    officialOnly?: boolean;
  }): RegistryPlugin[] {
    let results = this.plugins;

    // Text search
    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(plugin => 
        plugin.name.toLowerCase().includes(searchTerm) ||
        plugin.description.toLowerCase().includes(searchTerm) ||
        plugin.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply filters
    if (filters) {
      if (filters.category) {
        results = results.filter(plugin => plugin.category === filters.category);
      }

      if (filters.tags && filters.tags.length > 0) {
        results = results.filter(plugin => 
          filters.tags!.some(tag => plugin.tags.includes(tag))
        );
      }

      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        results = results.filter(plugin => plugin.price >= min && plugin.price <= max);
      }

      if (filters.officialOnly) {
        results = results.filter(plugin => plugin.isOfficial);
      }
    }

    // Sort by rating and download count
    return results.sort((a, b) => {
      const scoreA = a.rating * Math.log(a.downloadCount + 1);
      const scoreB = b.rating * Math.log(b.downloadCount + 1);
      return scoreB - scoreA;
    });
  }

  /**
   * Get plugin by name
   */
  getPlugin(name: string): RegistryPlugin | undefined {
    return this.plugins.find(plugin => plugin.name === name);
  }

  /**
   * Get all categories
   */
  getCategories(): string[] {
    const categories = new Set(this.plugins.map(plugin => plugin.category));
    return Array.from(categories).sort();
  }

  /**
   * Get all tags
   */
  getTags(): string[] {
    const tags = new Set(this.plugins.flatMap(plugin => plugin.tags));
    return Array.from(tags).sort();
  }

  /**
   * Get featured plugins
   */
  getFeaturedPlugins(limit = 6): RegistryPlugin[] {
    return this.plugins
      .filter(plugin => plugin.isOfficial || plugin.rating >= 4.5)
      .sort((a, b) => b.downloadCount - a.downloadCount)
      .slice(0, limit);
  }

  /**
   * Get recent plugins
   */
  getRecentPlugins(limit = 6): RegistryPlugin[] {
    return this.plugins
      .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
      .slice(0, limit);
  }

  /**
   * Get popular plugins
   */
  getPopularPlugins(limit = 6): RegistryPlugin[] {
    return this.plugins
      .sort((a, b) => b.downloadCount - a.downloadCount)
      .slice(0, limit);
  }
}