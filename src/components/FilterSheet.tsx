
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
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  children: React.ReactNode;
}

const FilterSheet: React.FC<FilterSheetProps> = ({ filters, onFiltersChange, children }) => {
  const [localFilters, setLocalFilters] = useState(filters);

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
      options: ['In Progress', 'Not Started']
    }
  ];

  const handleFilterToggle = (section: keyof FilterOptions, option: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [section]: prev[section].includes(option)
        ? prev[section].filter(item => item !== option)
        : [...prev[section], option]
    }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearFilters = () => {
    const emptyFilters = { types: [], access: [], status: [] };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const getTotalFilterCount = () => {
    return Object.values(localFilters).reduce((sum, arr) => sum + arr.length, 0);
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
      <SheetContent side="bottom" className="h-[80vh] sm:h-[70vh] max-w-2xl mx-auto">
        <SheetHeader>
          <SheetTitle className="text-lg sm:text-xl">Filter Surveys</SheetTitle>
        </SheetHeader>
        
        <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {filterSections.map((section) => (
            <div key={section.key}>
              <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">{section.title}</h4>
              <div className="space-y-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {section.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${section.key}-${option}`}
                      checked={localFilters[section.key].includes(option)}
                      onCheckedChange={() => handleFilterToggle(section.key, option)}
                    />
                    <label
                      htmlFor={`${section.key}-${option}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
          <Button variant="outline" onClick={clearFilters} className="flex-1 w-full sm:w-auto">
            Clear All
          </Button>
          <Button onClick={applyFilters} className="flex-1 w-full sm:w-auto">
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
