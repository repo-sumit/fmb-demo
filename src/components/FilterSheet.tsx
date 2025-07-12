
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface FilterOptions {
  types: string[];
  access: string[];
  status: string[];
}

interface FilterSheetProps {
  filters?: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  children: React.ReactNode;
}

const FilterSheet: React.FC<FilterSheetProps> = ({ filters, onFiltersChange, children }) => {
  const defaultFilters: FilterOptions = { types: [], access: [], status: [] };
  const [localFilters, setLocalFilters] = useState(filters || defaultFilters);

  const filterSections = [
    {
      title: 'Type',
      key: 'types' as keyof FilterOptions,
      options: ['Open', 'In School']
    },
    {
      title: 'Access',
      key: 'access' as keyof FilterOptions,
      options: ['Public', 'Private']
    },
    {
      title: 'Status',
      key: 'status' as keyof FilterOptions,
      options: ['Completed', 'In Progress', 'Not Started']
    }
  ];

  const handleFilterToggle = (section: keyof FilterOptions, option: string) => {
    setLocalFilters(prev => {
      const currentFilters = prev || defaultFilters;
      return {
        ...currentFilters,
        [section]: currentFilters[section].includes(option)
          ? currentFilters[section].filter(item => item !== option)
          : [...currentFilters[section], option]
      };
    });
  };

  const applyFilters = () => {
    onFiltersChange(localFilters || defaultFilters);
  };

  const clearFilters = () => {
    const emptyFilters = { types: [], access: [], status: [] };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const getTotalFilterCount = () => {
    if (!localFilters) return 0;
    return Object.values(localFilters).reduce((sum, arr) => sum + (arr?.length || 0), 0);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative">
          {children}
          {getTotalFilterCount() > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-primary text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
              {getTotalFilterCount()}
            </Badge>
          )}
        </div>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Filter Surveys</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {filterSections.map((section) => (
            <div key={section.key}>
              <h4 className="font-medium mb-3">{section.title}</h4>
              <div className="space-y-2">
                {section.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${section.key}-${option}`}
                      checked={localFilters?.[section.key]?.includes(option) || false}
                      onCheckedChange={() => handleFilterToggle(section.key, option)}
                    />
                    <label
                      htmlFor={`${section.key}-${option}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={clearFilters} className="flex-1">
            Clear All
          </Button>
          <Button onClick={applyFilters} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
