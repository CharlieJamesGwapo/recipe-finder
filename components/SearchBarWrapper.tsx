import dynamic from 'next/dynamic';
import { SearchFilters } from '@/lib/types';

const SearchBarComponent = dynamic(() => import('./SearchBar').then((mod) => ({ default: mod.SearchBar })), {
  ssr: false,
  loading: () => <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />,
});

interface SearchBarWrapperProps {
  onSearch?: (query: string, filters: SearchFilters) => void;
  showFilters?: boolean;
}

export function SearchBarWrapper({ onSearch, showFilters }: SearchBarWrapperProps) {
  return <SearchBarComponent onSearch={onSearch} showFilters={showFilters} />;
}
