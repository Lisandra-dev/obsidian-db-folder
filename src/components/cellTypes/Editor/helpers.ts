import { insertTextAtCursor } from 'components/cellTypes/Editor/insertTextAtCursor';

export interface TextRange {
  start: number;
  end: number;
}

export interface TextSection {
  text: string;
  selection: TextRange;
}

export interface TextState {
  text: string;
  selectedText: string;
  selection: TextRange;
}

const isLineDelimiter = (c: string) => c.charCodeAt(0) === 10;
const isWordDelimiter = (c: string) => c === ' ' || isLineDelimiter(c);

export function getSurroundingLines(text: string, start: number, end?: number) {
  if (!text) throw Error("Argument 'text' should be truthy");

  // leftIndex is initialized to 0 because if selection is 0, it won't even enter the iteration
  let leftIndex = 0;
  // rightIndex is initialized to text.length because if selection is equal to text.length it won't even enter the interation
  let rightIndex = text.length;

  // iterate to the left
  for (let i = start; i - 1 > -1; i--) {
    if (isLineDelimiter(text[i - 1])) {
      leftIndex = i;
      break;
    }
  }

  // iterate to the right
  for (let i = end === undefined ? start : end; i < text.length; i++) {
    if (isLineDelimiter(text[i])) {
      rightIndex = i;
      break;
    }
  }

  return { start: leftIndex, end: rightIndex };
}

export function getSurroundingWord(text: string, start: number, end?: number) {
  if (!text) throw Error("Argument 'text' should be truthy");

  // leftIndex is initialized to 0 because if selection is 0, it won't even enter the iteration
  let leftIndex = 0;
  // rightIndex is initialized to text.length because if selection is equal to text.length it won't even enter the interation
  let rightIndex = text.length;

  // iterate to the left
  for (let i = start; i - 1 > -1; i--) {
    if (isWordDelimiter(text[i - 1])) {
      leftIndex = i;
      break;
    }
  }

  // iterate to the right
  for (let i = end === undefined ? start : end; i < text.length; i++) {
    if (isWordDelimiter(text[i])) {
      rightIndex = i;
      break;
    }
  }

  return { start: leftIndex, end: rightIndex };
}

export function selectWord({ text, selection }: TextSection) {
  if (text && text.length && selection.start === selection.end) {
    // the user is pointing to a word
    return getSurroundingWord(text, selection.start);
  }
  return selection;
}

export function expandSelectionToWordBoundaries({
  text,
  selection,
}: TextSection) {
  if (text && text.length) {
    // the user is pointing to a word
    return getSurroundingWord(text, selection.start, selection.end);
  }
  return selection;
}

export function expandSelectionToLineBoundaries({
  text,
  selection,
}: TextSection) {
  if (text && text.length) {
    return getSurroundingLines(text, selection.start, selection.end);
  }
  return selection;
}

/**
 *  Gets the number of line-breaks that would have to be inserted before the given 'startPosition'
 *  to make sure there's an empty line between 'startPosition' and the previous text
 */
export function getBreaksNeededForEmptyLineBefore(
  text = '',
  startPosition: number
): number {
  if (startPosition === 0) return 0;

  // rules:
  // - If we're in the first line, no breaks are needed
  // - Otherwise there must be 2 breaks before the previous character. Depending on how many breaks exist already, we
  //      may need to insert 0, 1 or 2 breaks

  let neededBreaks = 2;
  let isInFirstLine = true;
  for (let i = startPosition - 1; i >= 0 && neededBreaks >= 0; i--) {
    switch (text.charCodeAt(i)) {
      case 32: // blank space
        continue;
      case 10: // line break
        neededBreaks--;
        isInFirstLine = false;
        break;
      default:
        return neededBreaks;
    }
  }
  return isInFirstLine ? 0 : neededBreaks;
}

/**
 *  Gets the number of line-breaks that would have to be inserted after the given 'startPosition'
 *  to make sure there's an empty line between 'startPosition' and the next text
 */
export function getBreaksNeededForEmptyLineAfter(
  text = '',
  startPosition: number
): number {
  if (startPosition === text.length - 1) return 0;

  // rules:
  // - If we're in the first line, no breaks are needed
  // - Otherwise there must be 2 breaks before the previous character. Depending on how many breaks exist already, we
  //      may need to insert 0, 1 or 2 breaks

  let neededBreaks = 2;
  let isInLastLine = true;
  for (let i = startPosition; i < text.length && neededBreaks >= 0; i++) {
    switch (text.charCodeAt(i)) {
      case 32:
        continue;
      case 10: {
        neededBreaks--;
        isInLastLine = false;
        break;
      }
      default:
        return neededBreaks;
    }
  }
  return isInLastLine ? 0 : neededBreaks;
}

export function getStateFromInput(input: HTMLTextAreaElement): TextState {
  return {
    selection: {
      start: input.selectionStart,
      end: input.selectionEnd,
    },
    text: input.value,
    selectedText: input.value.slice(
      input.selectionStart,
      input.selectionEnd
    ),
  };
}

export function replaceSelection(input: HTMLTextAreaElement, text: string) {
  insertTextAtCursor(input, text);
  return getStateFromInput(input);
}

export function setSelectionRange(
  input: HTMLTextAreaElement,
  selection: TextRange
): TextState {
  input.focus();
  input.selectionStart = selection.start;
  input.selectionEnd = selection.end;
  return getStateFromInput(input);
}

export function toggleWrappingFormattingCommand(
  input: HTMLTextAreaElement,
  isApplied: RegExp,
  unApply: (s: string) => string,
  formatting: string
) {
  const state = getStateFromInput(input);

  // Adjust the selection to encompass the whole word if the caret is inside one
  const newSelectionRange = expandSelectionToWordBoundaries({
    text: state.text,
    selection: state.selection,
  });

  const selection = setSelectionRange(input, newSelectionRange);

  if (isApplied.test(selection.selectedText)) {
    replaceSelection(input, unApply(selection.selectedText));
    setSelectionRange(input, {
      start: selection.selection.start,
      end:
        selection.selection.start +
        selection.selectedText.length -
        formatting.length * 2,
    });
  } else {
    // Replaces the current selection with the bold mark up
    const formattedState = replaceSelection(
      input,
      `${formatting}${selection.selectedText}${formatting}`
    );
    setSelectionRange(input, {
      start:
        formattedState.selection.end -
        formatting.length -
        selection.selectedText.length,
      end: formattedState.selection.end - formatting.length,
    });
  }
}

export function applyWrappingFormatting(
  input: HTMLTextAreaElement,
  before: string,
  after: string,
  requireSelection?: boolean,
  allowInMiddle?: boolean
) {
  const state = getStateFromInput(input);

  if (requireSelection && state.selection.end === state.selection.start) {
    return false;
  }

  // Prevent wrapping in the middle of typing a word. Eg. Prevent: don't'
  if (
    !allowInMiddle &&
    state.selection.end === state.selection.start &&
    state.selection.start > 0 &&
    input.value[state.selection.start - 1] !== ' '
  ) {
    return false;
  }

  if (state.selection.end === state.selection.start) {
    const formattedState = replaceSelection(input, `${after}`);
    setSelectionRange(input, {
      start: formattedState.selection.end - 1 - state.selectedText.length,
      end: formattedState.selection.end - 1,
    });

    return false;
  }

  const formattedState = replaceSelection(
    input,
    `${before}${state.selectedText}${after}`
  );
  setSelectionRange(input, {
    start: formattedState.selection.end - 1 - state.selectedText.length,
    end: formattedState.selection.end - 1,
  });

  return true;
}

export function toggleLineFormatting(
  input: HTMLTextAreaElement,
  isApplied: RegExp,
  apply: (s: string) => string,
  remove: (s: string) => string
) {
  const state = getStateFromInput(input);

  const lineRange = expandSelectionToLineBoundaries({
    text: state.text,
    selection: state.selection,
  });

  const selection = setSelectionRange(input, lineRange);

  const newLines = isApplied.test(selection.selectedText)
    ? remove(selection.selectedText)
    : apply(selection.selectedText);
  const newState = replaceSelection(input, newLines);

  setSelectionRange(input, {
    start: selection.selection.start,
    end: newState.selection.end,
  });
}
