import React from 'react';

import { type Tag } from 'loot-core/types/models';

import { type TagRow } from './TagRow';

import { Table, useTableNavigator } from '@desktop-client/components/table';

type TagsListProps = {
  tags: Tag[];
  selectedItems: Set<string>;
  hoveredTag?: string;
  onHover: (id?: string) => void;
  RowComponent: typeof TagRow;
};

export function TagsList({
  tags,
  selectedItems,
  hoveredTag,
  onHover,
  RowComponent,
}: TagsListProps) {
  const tableNavigator = useTableNavigator(tags, [
    'select',
    'color',
    'description',
  ]);

  return (
    <Table
      navigator={tableNavigator}
      items={tags}
      backgroundColor="none"
      renderItem={({ item: tag, focusedField, onEdit }) => {
        const hovered = hoveredTag === tag.id;
        const selected = selectedItems.has(tag.id);

        return (
          <RowComponent
            key={tag.id}
            tag={tag}
            hovered={hovered}
            selected={selected}
            onHover={onHover}
            focusedField={focusedField}
            onEdit={onEdit}
          />
        );
      }}
    />
  );
}
