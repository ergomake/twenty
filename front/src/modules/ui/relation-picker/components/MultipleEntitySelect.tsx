import debounce from 'lodash.debounce';

import { DropdownMenu } from '@/ui/dropdown/components/DropdownMenu';
import { DropdownMenuCheckableItem } from '@/ui/dropdown/components/DropdownMenuCheckableItem';
import { DropdownMenuItem } from '@/ui/dropdown/components/DropdownMenuItem';
import { DropdownMenuItemsContainer } from '@/ui/dropdown/components/DropdownMenuItemsContainer';
import { DropdownMenuSearch } from '@/ui/dropdown/components/DropdownMenuSearch';
import { DropdownMenuSeparator } from '@/ui/dropdown/components/DropdownMenuSeparator';
import { Avatar } from '@/users/components/Avatar';
import { isNonEmptyString } from '~/utils/isNonEmptyString';

import { EntityForSelect } from '../types/EntityForSelect';

export type EntitiesForMultipleEntitySelect<
  CustomEntityForSelect extends EntityForSelect,
> = {
  selectedEntities: CustomEntityForSelect[];
  filteredSelectedEntities: CustomEntityForSelect[];
  entitiesToSelect: CustomEntityForSelect[];
  loading: boolean;
};

export function MultipleEntitySelect<
  CustomEntityForSelect extends EntityForSelect,
>({
  entities,
  onChange,
  onSearchFilterChange,
  searchFilter,
  value,
}: {
  entities: EntitiesForMultipleEntitySelect<CustomEntityForSelect>;
  searchFilter: string;
  onSearchFilterChange: (newSearchFilter: string) => void;
  onChange: (value: Record<string, boolean>) => void;
  value: Record<string, boolean>;
}) {
  const debouncedSetSearchFilter = debounce(onSearchFilterChange, 100, {
    leading: true,
  });

  function handleFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    debouncedSetSearchFilter(event.currentTarget.value);
    onSearchFilterChange(event.currentTarget.value);
  }

  let entitiesInDropdown = [
    ...(entities.filteredSelectedEntities ?? []),
    ...(entities.entitiesToSelect ?? []),
  ];

  entitiesInDropdown = entitiesInDropdown.filter((entity) =>
    isNonEmptyString(entity.name),
  );

  return (
    <DropdownMenu>
      <DropdownMenuSearch
        value={searchFilter}
        onChange={handleFilterChange}
        autoFocus
      />
      <DropdownMenuSeparator />
      <DropdownMenuItemsContainer hasMaxHeight>
        {entitiesInDropdown?.map((entity) => (
          <DropdownMenuCheckableItem
            key={entity.id}
            checked={value[entity.id]}
            onChange={(newCheckedValue) =>
              onChange({ ...value, [entity.id]: newCheckedValue })
            }
          >
            <Avatar
              avatarUrl={entity.avatarUrl}
              colorId={entity.id}
              placeholder={entity.name}
              size={16}
              type={entity.avatarType ?? 'rounded'}
            />
            {entity.name}
          </DropdownMenuCheckableItem>
        ))}
        {entitiesInDropdown?.length === 0 && (
          <DropdownMenuItem>No result</DropdownMenuItem>
        )}
      </DropdownMenuItemsContainer>
    </DropdownMenu>
  );
}
