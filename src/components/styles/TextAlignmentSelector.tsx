import * as React from "react";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { TextAlignmentProps } from "cdm/StyleModel";
import { COLUMN_ALIGNMENT_OPTIONS, StyleVariables } from "helpers/Constants";
import { t } from "lang/helpers";

export default function TextAlignmentSelector(props: TextAlignmentProps) {
  const { modal, columnId, currentAlignment } = props;
  const { view } = modal;
  const [alignment, setAlignment] = React.useState(currentAlignment);

  const handleAlignment = async (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    if (newAlignment !== null) {
      // Persist changes
      await view.diskConfig.updateColumnConfig(columnId, {
        content_alignment: newAlignment,
      });
      modal.enableReset = true;
      setAlignment(newAlignment);
    }
  };

  return (
    <Stack direction="row" spacing={4}>
      <ToggleButtonGroup
        value={alignment}
        exclusive
        onChange={handleAlignment}
        aria-label={t("column_settings_modal_text_alignment_select_title")}
      >
        <ToggleButton
          value={COLUMN_ALIGNMENT_OPTIONS.LEFT}
          aria-label={t("column_settings_modal_text_alignment_select_left")}
          sx={{
            color: StyleVariables.TEXT_NORMAL,
            "&.Mui-selected, &.Mui-selected:hover": {
              color: StyleVariables.TEXT_ACCENT,
            },
          }}
        >
          <FormatAlignLeftIcon />
        </ToggleButton>
        <ToggleButton
          value={COLUMN_ALIGNMENT_OPTIONS.CENTER}
          aria-label={t("column_settings_modal_text_alignment_select_center")}
          sx={{
            color: StyleVariables.TEXT_NORMAL,
            "&.Mui-selected, &.Mui-selected:hover": {
              color: StyleVariables.TEXT_ACCENT,
            },
          }}
        >
          <FormatAlignCenterIcon />
        </ToggleButton>
        <ToggleButton
          value={COLUMN_ALIGNMENT_OPTIONS.RIGHT}
          aria-label={t("column_settings_modal_text_alignment_select_right")}
          sx={{
            color: StyleVariables.TEXT_NORMAL,
            "&.Mui-selected, &.Mui-selected:hover": {
              color: StyleVariables.TEXT_ACCENT,
            },
          }}
        >
          <FormatAlignRightIcon />
        </ToggleButton>
        <ToggleButton
          value={COLUMN_ALIGNMENT_OPTIONS.JUSTIFY}
          aria-label={t("column_settings_modal_text_alignment_select_justify")}
          sx={{
            color: StyleVariables.TEXT_NORMAL,
            "&.Mui-selected, &.Mui-selected:hover": {
              color: StyleVariables.TEXT_ACCENT,
            },
          }}
        >
          <FormatAlignJustifyIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}
