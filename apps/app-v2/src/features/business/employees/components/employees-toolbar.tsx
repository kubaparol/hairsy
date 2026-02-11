'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import type { Key } from '@heroui/react';
import { Button, Label, ListBox, SearchField, Select } from '@heroui/react';
import type {
  EmployeeSortKey,
  EmployeeStatusFilter,
} from '../../../../services/employees/query-keys';
import { useDebouncedCallback } from '../../../../lib/use-debounced-callback';

interface EmployeesToolbarProps {
  search: string;
  status: EmployeeStatusFilter;
  sort: EmployeeSortKey;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: EmployeeStatusFilter) => void;
  onSortChange: (value: EmployeeSortKey) => void;
  onReset: () => void;
}

const STATUS_OPTIONS = [
  { id: 'all', label: 'Wszyscy' },
  { id: 'active', label: 'Aktywni' },
  { id: 'inactive', label: 'Nieaktywni' },
] as const;

const SORT_OPTIONS = [
  { id: 'default', label: 'Domyślne' },
  { id: 'alphabetical', label: 'A-Z' },
  { id: 'created_desc', label: 'Najnowsi' },
  { id: 'created_asc', label: 'Najstarsi' },
] as const;

export function EmployeesToolbar({
  search,
  status,
  sort,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onReset,
}: EmployeesToolbarProps) {
  const [localSearch, setLocalSearch] = useState(search);

  const debouncedSearchChange = useDebouncedCallback((value: string) => {
    onSearchChange(value);
  }, 300);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    debouncedSearchChange(value);
  };

  const handleReset = () => {
    setLocalSearch('');
    onReset();
  };

  const handleStatusChange = (value: Key | Key[] | null) => {
    if (value && typeof value === 'string') {
      onStatusChange(value as EmployeeStatusFilter);
    }
  };

  const handleSortChange = (value: Key | Key[] | null) => {
    if (value && typeof value === 'string') {
      onSortChange(value as EmployeeSortKey);
    }
  };

  const hasActiveFilters =
    localSearch !== '' || status !== 'all' || sort !== 'default';

  return (
    <section
      aria-label="Filtry i sortowanie pracowników"
      className="flex flex-col gap-4 rounded-2xl border border-default-200 bg-content1 p-4"
    >
      {/* Search - full width on top */}
      <SearchField
        value={localSearch}
        onChange={handleSearchChange}
        aria-label="Wyszukaj pracownika"
      >
        <Label className="sr-only">Wyszukiwarka</Label>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input
            className="w-full"
            placeholder="Wyszukaj po imieniu lub nazwisku…"
          />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>

      {/* Filters row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        {/* Status filter */}
        <Select
          className="flex-1 sm:max-w-[180px]"
          value={status}
          onChange={handleStatusChange}
          aria-label="Filtruj po statusie"
        >
          <Label>Status</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {STATUS_OPTIONS.map((option) => (
                <ListBox.Item
                  key={option.id}
                  id={option.id}
                  textValue={option.label}
                >
                  {option.label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        {/* Sort filter */}
        <Select
          className="flex-1 sm:max-w-[180px]"
          value={sort}
          onChange={handleSortChange}
          aria-label="Sortowanie"
        >
          <Label>Sortowanie</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {SORT_OPTIONS.map((option) => (
                <ListBox.Item
                  key={option.id}
                  id={option.id}
                  textValue={option.label}
                >
                  {option.label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        {/* Spacer */}
        <div className="hidden flex-1 sm:block" />

        {/* Reset button */}
        <Button
          variant="secondary"
          isDisabled={!hasActiveFilters}
          onPress={handleReset}
          className="w-full sm:w-auto"
        >
          <RotateCcw className="size-4" />
          Resetuj filtry
        </Button>
      </div>
    </section>
  );
}
