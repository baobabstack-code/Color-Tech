/**
 * Utility functions for keyboard navigation in React components
 */

/**
 * Key codes for common keyboard keys used in navigation
 */
export const KeyboardKeys = {
  TAB: 'Tab',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: ' ',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
  END: 'End',
  HOME: 'Home',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_UP: 'ArrowUp',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_DOWN: 'ArrowDown',
};

/**
 * Checks if the key pressed is a navigation key
 * @param event Keyboard event
 * @returns Boolean indicating if the key is a navigation key
 */
export function isNavigationKey(event: React.KeyboardEvent | KeyboardEvent): boolean {
  return [
    KeyboardKeys.TAB,
    KeyboardKeys.ARROW_LEFT,
    KeyboardKeys.ARROW_RIGHT,
    KeyboardKeys.ARROW_UP,
    KeyboardKeys.ARROW_DOWN,
    KeyboardKeys.HOME,
    KeyboardKeys.END,
    KeyboardKeys.PAGE_UP,
    KeyboardKeys.PAGE_DOWN,
  ].includes(event.key);
}

/**
 * Checks if the key pressed is an activation key (Enter or Space)
 * @param event Keyboard event
 * @returns Boolean indicating if the key is an activation key
 */
export function isActivationKey(event: React.KeyboardEvent | KeyboardEvent): boolean {
  return event.key === KeyboardKeys.ENTER || event.key === KeyboardKeys.SPACE;
}

/**
 * Checks if the key pressed is the Escape key
 * @param event Keyboard event
 * @returns Boolean indicating if the key is the Escape key
 */
export function isEscapeKey(event: React.KeyboardEvent | KeyboardEvent): boolean {
  return event.key === KeyboardKeys.ESCAPE;
}

/**
 * Handles keyboard navigation for a list of items
 * @param event Keyboard event
 * @param currentIndex Current focused index
 * @param itemCount Total number of items
 * @param vertical Whether navigation is vertical (true) or horizontal (false)
 * @param circular Whether navigation should wrap around at the ends
 * @returns New index to focus
 */
export function getNextIndex(
  event: React.KeyboardEvent,
  currentIndex: number,
  itemCount: number,
  vertical = true,
  circular = true
): number {
  // If there are no items, don't change the index
  if (itemCount === 0) return -1;
  
  // Get the key that was pressed
  const { key } = event;
  
  // Determine which keys to check based on orientation
  const nextKey = vertical ? KeyboardKeys.ARROW_DOWN : KeyboardKeys.ARROW_RIGHT;
  const prevKey = vertical ? KeyboardKeys.ARROW_UP : KeyboardKeys.ARROW_LEFT;
  
  // Calculate the next index based on the key pressed
  switch (key) {
    case nextKey:
      if (currentIndex === itemCount - 1) {
        return circular ? 0 : currentIndex;
      }
      return currentIndex + 1;
    
    case prevKey:
      if (currentIndex === 0) {
        return circular ? itemCount - 1 : currentIndex;
      }
      return currentIndex - 1;
    
    case KeyboardKeys.HOME:
      return 0;
    
    case KeyboardKeys.END:
      return itemCount - 1;
    
    default:
      return currentIndex;
  }
}

/**
 * Creates a keyboard event handler for list navigation
 * @param onIndexChange Callback function when index changes
 * @param itemCount Total number of items
 * @param vertical Whether navigation is vertical (true) or horizontal (false)
 * @param circular Whether navigation should wrap around at the ends
 * @returns Keyboard event handler function
 */
export function createListNavigationHandler(
  onIndexChange: (index: number) => void,
  itemCount: number,
  vertical = true,
  circular = true
): (event: React.KeyboardEvent, currentIndex: number) => void {
  return (event: React.KeyboardEvent, currentIndex: number) => {
    // Only handle navigation keys
    if (!isNavigationKey(event)) return;
    
    // Prevent default browser behavior for arrow keys
    if (
      event.key === KeyboardKeys.ARROW_DOWN ||
      event.key === KeyboardKeys.ARROW_UP ||
      event.key === KeyboardKeys.ARROW_LEFT ||
      event.key === KeyboardKeys.ARROW_RIGHT ||
      event.key === KeyboardKeys.HOME ||
      event.key === KeyboardKeys.END
    ) {
      event.preventDefault();
    }
    
    // Get the next index and call the callback
    const nextIndex = getNextIndex(event, currentIndex, itemCount, vertical, circular);
    if (nextIndex !== currentIndex) {
      onIndexChange(nextIndex);
    }
  };
}

/**
 * Creates a keyboard event handler for grid navigation
 * @param onPositionChange Callback function when position changes
 * @param rowCount Number of rows in the grid
 * @param columnCount Number of columns in the grid
 * @param circular Whether navigation should wrap around at the edges
 * @returns Keyboard event handler function
 */
export function createGridNavigationHandler(
  onPositionChange: (row: number, column: number) => void,
  rowCount: number,
  columnCount: number,
  circular = true
): (event: React.KeyboardEvent, currentRow: number, currentColumn: number) => void {
  return (event: React.KeyboardEvent, currentRow: number, currentColumn: number) => {
    // Only handle navigation keys
    if (!isNavigationKey(event)) return;
    
    // Prevent default browser behavior for arrow keys
    if (
      event.key === KeyboardKeys.ARROW_DOWN ||
      event.key === KeyboardKeys.ARROW_UP ||
      event.key === KeyboardKeys.ARROW_LEFT ||
      event.key === KeyboardKeys.ARROW_RIGHT ||
      event.key === KeyboardKeys.HOME ||
      event.key === KeyboardKeys.END
    ) {
      event.preventDefault();
    }
    
    let nextRow = currentRow;
    let nextColumn = currentColumn;
    
    // Calculate the next position based on the key pressed
    switch (event.key) {
      case KeyboardKeys.ARROW_DOWN:
        if (nextRow === rowCount - 1) {
          nextRow = circular ? 0 : rowCount - 1;
        } else {
          nextRow += 1;
        }
        break;
      
      case KeyboardKeys.ARROW_UP:
        if (nextRow === 0) {
          nextRow = circular ? rowCount - 1 : 0;
        } else {
          nextRow -= 1;
        }
        break;
      
      case KeyboardKeys.ARROW_RIGHT:
        if (nextColumn === columnCount - 1) {
          nextColumn = circular ? 0 : columnCount - 1;
          if (circular && nextColumn === 0) {
            nextRow = nextRow === rowCount - 1 ? 0 : nextRow + 1;
          }
        } else {
          nextColumn += 1;
        }
        break;
      
      case KeyboardKeys.ARROW_LEFT:
        if (nextColumn === 0) {
          nextColumn = circular ? columnCount - 1 : 0;
          if (circular && nextColumn === columnCount - 1) {
            nextRow = nextRow === 0 ? rowCount - 1 : nextRow - 1;
          }
        } else {
          nextColumn -= 1;
        }
        break;
      
      case KeyboardKeys.HOME:
        if (event.ctrlKey) {
          // Go to the first cell of the first row
          nextRow = 0;
          nextColumn = 0;
        } else {
          // Go to the first cell of the current row
          nextColumn = 0;
        }
        break;
      
      case KeyboardKeys.END:
        if (event.ctrlKey) {
          // Go to the last cell of the last row
          nextRow = rowCount - 1;
          nextColumn = columnCount - 1;
        } else {
          // Go to the last cell of the current row
          nextColumn = columnCount - 1;
        }
        break;
    }
    
    // Call the callback if the position changed
    if (nextRow !== currentRow || nextColumn !== currentColumn) {
      onPositionChange(nextRow, nextColumn);
    }
  };
}

/**
 * Creates a keyboard event handler for menu navigation
 * @param onIndexChange Callback function when index changes
 * @param itemCount Total number of items
 * @param onEscape Callback function when Escape key is pressed
 * @param onActivate Callback function when Enter or Space key is pressed
 * @returns Keyboard event handler function
 */
export function createMenuNavigationHandler(
  onIndexChange: (index: number) => void,
  itemCount: number,
  onEscape?: () => void,
  onActivate?: (index: number) => void
): (event: React.KeyboardEvent, currentIndex: number) => void {
  return (event: React.KeyboardEvent, currentIndex: number) => {
    // Handle navigation keys
    if (isNavigationKey(event)) {
      // Prevent default browser behavior for arrow keys
      if (
        event.key === KeyboardKeys.ARROW_DOWN ||
        event.key === KeyboardKeys.ARROW_UP ||
        event.key === KeyboardKeys.HOME ||
        event.key === KeyboardKeys.END
      ) {
        event.preventDefault();
      }
      
      // Get the next index and call the callback
      const nextIndex = getNextIndex(event, currentIndex, itemCount, true, true);
      if (nextIndex !== currentIndex) {
        onIndexChange(nextIndex);
      }
    }
    // Handle Escape key
    else if (isEscapeKey(event) && onEscape) {
      event.preventDefault();
      onEscape();
    }
    // Handle activation keys (Enter or Space)
    else if (isActivationKey(event) && onActivate) {
      event.preventDefault();
      onActivate(currentIndex);
    }
  };
}

/**
 * Creates a keyboard event handler for tab navigation
 * @param onTabChange Callback function when tab changes
 * @param tabCount Total number of tabs
 * @returns Keyboard event handler function
 */
export function createTabNavigationHandler(
  onTabChange: (index: number) => void,
  tabCount: number
): (event: React.KeyboardEvent, currentIndex: number) => void {
  return (event: React.KeyboardEvent, currentIndex: number) => {
    // Only handle horizontal navigation keys
    if (
      event.key !== KeyboardKeys.ARROW_LEFT &&
      event.key !== KeyboardKeys.ARROW_RIGHT &&
      event.key !== KeyboardKeys.HOME &&
      event.key !== KeyboardKeys.END
    ) {
      return;
    }
    
    // Prevent default browser behavior
    event.preventDefault();
    
    // Calculate the next index based on the key pressed
    let nextIndex = currentIndex;
    
    switch (event.key) {
      case KeyboardKeys.ARROW_RIGHT:
        nextIndex = (currentIndex + 1) % tabCount;
        break;
      
      case KeyboardKeys.ARROW_LEFT:
        nextIndex = (currentIndex - 1 + tabCount) % tabCount;
        break;
      
      case KeyboardKeys.HOME:
        nextIndex = 0;
        break;
      
      case KeyboardKeys.END:
        nextIndex = tabCount - 1;
        break;
    }
    
    // Call the callback if the index changed
    if (nextIndex !== currentIndex) {
      onTabChange(nextIndex);
    }
  };
}