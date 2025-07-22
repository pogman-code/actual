import React, { memo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { theme } from '@actual-app/components/theme';

import { type Tag } from 'loot-core/types/models';

import { TagEditor } from './TagEditor';

import {
  SelectCell,
  Row,
  Cell,
  InputCell,
} from '@desktop-client/components/table';
import { useProperFocus } from '@desktop-client/hooks/useProperFocus';
import { useSelectedDispatch } from '@desktop-client/hooks/useSelected';
import { updateTag } from '@desktop-client/queries/queriesSlice';
import { useDispatch } from '@desktop-client/redux';

type ImportableTagRowProps = {
  tag: Tag;
  hovered?: boolean;
  selected?: boolean;
  onHover: (id?: string) => void;
  focusedField: string | null;
  onEdit: (id: string, field: string) => void;
};

export const ImportableTagRow = memo(
  ({
    tag,
    hovered,
    selected,
    onHover,
    focusedField,
    onEdit,
  }: ImportableTagRowProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const dispatchSelected = useSelectedDispatch();
    const borderColor = selected ? theme.tableBorderSelected : 'none';

    const colorButtonRef = useRef(null);
    useProperFocus(colorButtonRef, focusedField === 'color');
    const resetButtonRef = useRef(null);
    useProperFocus(resetButtonRef, focusedField === 'select');

    const triggerRef = useRef(null);

    const onUpdate = (description: string) => {
      //dispatch(updateTag({ ...tag, description }));
      tag.description = description;
    };

    return (
      <Row
        ref={triggerRef}
        data-test-id={tag.id}
        style={{
          borderColor,
          backgroundColor: selected
            ? theme.tableRowBackgroundHighlight
            : hovered
              ? theme.tableRowBackgroundHover
              : theme.tableBackground,
        }}
        collapsed={true}
        onMouseEnter={() => onHover(tag.id)}
        onMouseLeave={() => onHover()}
      >
        <SelectCell
          exposed={hovered || selected || focusedField === 'select'}
          focused={focusedField === 'select'}
          onSelect={e => {
            dispatchSelected({
              type: 'select',
              id: tag.id,
              isRangeSelect: e.shiftKey,
            });
          }}
          selected={selected}
        />

        <Cell width={250} plain style={{ padding: '5px', display: 'block' }}>
          <TagEditor tag={tag} ref={colorButtonRef} />
        </Cell>

        <InputCell
          width="flex"
          name="description"
          textAlign="flex"
          exposed={focusedField === 'description'}
          onExpose={name => onEdit(tag.id, name)}
          value={tag.description || t('No description')}
          valueStyle={
            tag.description
              ? {}
              : { fontStyle: 'italic', color: theme.tableTextLight }
          }
          inputProps={{
            value: tag.description || '',
            onUpdate,
            placeholder: t('No description'),
          }}
        />
      </Row>
    );
  },
);

ImportableTagRow.displayName = 'ImportableTagRow';
