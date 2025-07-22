import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import { type Tag } from 'loot-core/types/models';

import {
  Modal,
  ModalButtons,
  ModalCloseButton,
  ModalHeader,
} from '@desktop-client/components/common/Modal';
import { ImportableTagRow } from '@desktop-client/components/tags/ImportableTagRow';
import { TagsHeader } from '@desktop-client/components/tags/TagsHeader';
import { TagsList } from '@desktop-client/components/tags/TagsList';
import {
  SelectedProvider,
  useSelected,
} from '@desktop-client/hooks/useSelected';

export function ImportTagsModal() {
  const { t } = useTranslation();
  const [hoveredTag, setHoveredTag] = useState<string>();

  const tags: Tag[] = [
    { id: 'plop', tag: 'plop', color: theme.noteTagDefault },
    { id: 'plop2', tag: 'plop2', color: theme.noteTagDefault },
  ];
  const selectedInst = useSelected('import-tags', tags, []);

  return (
    <Modal name="import-tags" containerProps={{ style: { width: 600 } }}>
      {({ state: { close } }) => (
        <>
          <ModalHeader
            title={t('Import Tags')}
            rightContent={<ModalCloseButton onPress={close} />}
          />
          <SelectedProvider instance={selectedInst}>
            <View style={{ flex: 1, marginTop: 12 }}>
              <TagsHeader />
              <TagsList
                tags={tags}
                selectedItems={selectedInst.items}
                hoveredTag={hoveredTag}
                onHover={id => setHoveredTag(id ?? undefined)}
                RowComponent={ImportableTagRow}
              />
            </View>
          </SelectedProvider>

          <ModalButtons style={{ marginTop: 20 }} focusButton>
            <Button
              variant="primary"
              autoFocus
              style={{ marginRight: 10 }}
              onPress={() => {
                close();
              }}
            >
              <Trans>Import</Trans>
            </Button>

            <Button style={{ marginRight: 10 }} onPress={close}>
              <Trans>Cancel</Trans>
            </Button>
          </ModalButtons>
        </>
      )}
    </Modal>
  );
}
