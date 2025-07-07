/**
 * Utility functions for managing ARIA attributes in React components
 */

/**
 * Generates props for a button that controls another element
 * @param controlsId ID of the element being controlled
 * @param expanded Whether the controlled element is expanded
 * @returns Props object with aria-controls and aria-expanded
 */
export function getButtonControlProps(controlsId: string, expanded: boolean) {
  return {
    'aria-controls': controlsId,
    'aria-expanded': expanded,
  };
}

/**
 * Generates props for a button that opens a dialog or modal
 * @param dialogId ID of the dialog being controlled
 * @param open Whether the dialog is open
 * @returns Props object with aria-haspopup, aria-controls, and aria-expanded
 */
export function getDialogTriggerProps(dialogId: string, open: boolean) {
  return {
    'aria-haspopup': 'dialog',
    'aria-controls': dialogId,
    'aria-expanded': open,
  };
}

/**
 * Generates props for a button that opens a menu
 * @param menuId ID of the menu being controlled
 * @param open Whether the menu is open
 * @returns Props object with aria-haspopup, aria-controls, and aria-expanded
 */
export function getMenuTriggerProps(menuId: string, open: boolean) {
  return {
    'aria-haspopup': 'menu',
    'aria-controls': menuId,
    'aria-expanded': open,
  };
}

/**
 * Generates props for an element that has a popup
 * @param popupId ID of the popup element
 * @param open Whether the popup is open
 * @returns Props object with aria-owns and aria-expanded
 */
export function getPopupOwnerProps(popupId: string, open: boolean) {
  return {
    'aria-owns': open ? popupId : undefined,
    'aria-expanded': open,
  };
}

/**
 * Generates props for a tab
 * @param panelId ID of the tab panel
 * @param selected Whether the tab is selected
 * @returns Props object with aria-controls, aria-selected, and tabIndex
 */
export function getTabProps(panelId: string, selected: boolean) {
  return {
    'aria-controls': panelId,
    'aria-selected': selected,
    'tabIndex': selected ? 0 : -1,
    'role': 'tab',
  };
}

/**
 * Generates props for a tab panel
 * @param tabId ID of the tab that controls this panel
 * @returns Props object with aria-labelledby and role
 */
export function getTabPanelProps(tabId: string) {
  return {
    'aria-labelledby': tabId,
    'role': 'tabpanel',
    'tabIndex': 0,
  };
}

/**
 * Generates props for an accordion button
 * @param contentId ID of the accordion content
 * @param expanded Whether the accordion is expanded
 * @returns Props object with aria-controls, aria-expanded, and id
 */
export function getAccordionButtonProps(contentId: string, expanded: boolean, buttonId: string) {
  return {
    'aria-controls': contentId,
    'aria-expanded': expanded,
    'id': buttonId,
  };
}

/**
 * Generates props for accordion content
 * @param buttonId ID of the accordion button
 * @param expanded Whether the accordion is expanded
 * @returns Props object with aria-labelledby, role, and hidden
 */
export function getAccordionContentProps(buttonId: string, expanded: boolean, contentId: string) {
  return {
    'aria-labelledby': buttonId,
    'role': 'region',
    'hidden': !expanded,
    'id': contentId,
  };
}

/**
 * Generates props for a form input
 * @param labelId ID of the label element
 * @param descriptionId ID of the description element (optional)
 * @param errorId ID of the error message element (optional)
 * @param hasError Whether the input has an error
 * @returns Props object with aria-labelledby, aria-describedby, and aria-invalid
 */
export function getFormInputProps(labelId: string, descriptionId?: string, errorId?: string, hasError?: boolean) {
  const describedBy = [];
  if (descriptionId) describedBy.push(descriptionId);
  if (errorId && hasError) describedBy.push(errorId);
  
  return {
    'aria-labelledby': labelId,
    'aria-describedby': describedBy.length > 0 ? describedBy.join(' ') : undefined,
    'aria-invalid': hasError ? true : undefined,
  };
}

/**
 * Generates props for a live region
 * @param priority Whether the live region is assertive or polite
 * @returns Props object with aria-live, aria-atomic, and role
 */
export function getLiveRegionProps(priority: 'assertive' | 'polite' = 'polite') {
  return {
    'aria-live': priority,
    'aria-atomic': true,
    'role': 'status',
  };
}

/**
 * Generates props for a visually hidden element that should remain accessible to screen readers
 * @returns Props for a visually hidden element
 */
export function getVisuallyHiddenProps() {
  return {
    className: 'sr-only',
    'aria-hidden': 'false',
  };
}

/**
 * Generates props for an element that should be hidden from screen readers
 * @returns Props for an element hidden from screen readers
 */
export function getHiddenFromScreenReaderProps() {
  return {
    'aria-hidden': 'true',
  };
}