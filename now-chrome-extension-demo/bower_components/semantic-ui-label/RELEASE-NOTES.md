### Version 2.1.5 - Nov 1, 2015

- **Dropdown** - Added `onLabelRemove` callback that allows value removal to be cancelled by callback **Thanks @goloveychuk**

### Version 2.1.4 - Sep 13, 2015

// expands out using default prompts and identifier matching property label

- **Label** - Labels no longer force single line using `word-wrap: nowrap` [#3006](https://github.com/Semantic-Org/Semantic-UI/issues/3006)
- **Button** - Fixes `right labeled icon button` with a `right` named icon (for example `right arrow`) having incorrect margin on icon. [#2973](https://github.com/Semantic-Org/Semantic-UI/issues/2973)

#### Features

- **Button** - Added `labeled button` variation for display a count next to a button.
- **Input** - Added ability for labeled input to be attached to both sides [#2922 **Thanks @maturano**](https://github.com/Semantic-Org/Semantic-UI/issues/no**)
- **Label** - Added a new  `basic label` style, works symbiotically with other label types to provide a more lightweight style label
- **Menu** - Appearance of `labeled icon menu` has been modified. Horizontal menus now have icons above text, and icons are slightly larger than before.
- **Label** - Added `basic` label variation, useful for item counts

#### Bugs

- **Checkbox** - Clicking a link inside an initialized checkbox `label` will now work correctly, and will not toggle the checkbox. [#2804](https://github.com/Semantic-Org/Semantic-UI/issues/2804)
- **Input** - Fixed issue with appearance of `left corner labeled left icon input` [#2782](https://github.com/Semantic-Org/Semantic-UI/issues/2782)
- **Table/Label** - `ribbon labels` will now automatically position themselves when used inside a table [#1930](https://github.com/Semantic-Org/Semantic-UI/issues/1930)
- **Dropdown** - Fixed issue where label could not be removed when using a numeric value due to mismatched types [#2754 [#2755 **Thanks @dgurkaynak**](https://github.com/Semantic-Org/Semantic-UI/issues/ak**)
- **Dropdown** - When `useLabels: false` placeholder text will now show up when 0 items selected, instead of the text "0 items selected"
- **Input** - `labeled input` now keeps border on label edge so that focus color appears correctly
- **Input** `action input` and `labeled input` now have focused border on inner edge with label/button
- **Label** - `pointing` and `attached` labels are *now word order sensitive* to allow them to work correctly with other directional variations.
- **Label** - `pointint label` now rounds to exact pixel em value, should align correctly in more cases
- **Menu** - Fixed issue with `labeled input` text inside menu not appearing vertically centered

### Version 2.0.7 - July 23, 2015

- **Dropdown** - Fixed border radius on `circular labeled icon button`  [#2700](https://github.com/Semantic-Org/Semantic-UI/issues/2700)
- **Dropdown** - Fixed issue where dropdown nested inside `label` would not open. [#2711](https://github.com/Semantic-Org/Semantic-UI/issues/2711)

### Version 2.0.6 - July 22, 2015

- **Dropdown** - Fixed `restore value` sometimes now working correctly due to "animating out" label still being mistaken for selected. [#2690](https://github.com/Semantic-Org/Semantic-UI/issues/2690)
- **List**- Fixed issue where using an image variation like `ui image label` as a direct child of an `item` would remove right padding [#2691](https://github.com/Semantic-Org/Semantic-UI/issues/2691)
- **Dropdown** - Fixed issue where using text labels, `useLabels: false`, would cause selection count to appear incorrect.
- **Dropdown** - Text labels, `useLabels: false`, now works correctly with `maxSelections`, and receives special UX considerations

### Version 2.0.3 - July 8, 2015

- **Input** - Fixed errored input field having incorrect border radius with `labeled input`

### Version 2.0.2 - July 7, 2015

- **Dropdown** - Clicking on label, or deleting a label will no longer trigger dropdown menu toggling
- **Dropdown** - Multiselect that do use text labels (e.g. "5 selected") will now remove filters on selection and scroll to last selected value

### Version 2.0.1 - July 6, 2015

- **Label** - Attached labels now use a border-radius for corner-edges that matches more closely [#2500](https://github.com/Semantic-Org/Semantic-UI/issues/2500)
- **Label** - Fixes incorrect label sizing for `large` and bigger sizes [#2486](https://github.com/Semantic-Org/Semantic-UI/issues/2486)

### Version 2.0.0 - June 30, 2015

- **Label** - Labels now have `active` and `active hover` states
- **Label** - Label now sets an `img` height even when not using an `image label`
- **Progress** - `indicating` labels now are more legible use separate css variables from `indicating` bar color
- **Form** - `inline fields` are now `1em` and do not match label's reduced size
- **Form/Input** - `ui labeled input` inside `form` will no longer escape column width. `ui fluid input` will now use input widths shorter than browser default.
- **Input** - Fixed right padding on `labeled input` that were not `corner labeled`
- **Label** - Labels inside `header` now vertical align better by accounting for line height offset
- **Label** - Label size now varies by type. `pointing label` are now `1em` by default.
- **Label** - Padding on `corner label` has been increased
- **Statistic** - Statistic label styles have been updated

### Version 1.12.1 - April 26, 2015

- **Input** - Fixes labeled inputs not adjusting correctly with flex. **Backported from 2.0**

### Version 1.11.2 - March 6, 2015

- **Header** - Labels inside headers have been slightly increased in size

### Version 1.9.3 - February 20, 2015

- **API** - Simplified `api` debug output to console to more clearly label url and data sent

### UI Changes

- **Input** - Input with dropdowns is now much easier, see docs. `action input` and `labeled input` now use `display: flex`. `ui action input` now supports `<button>` tag usage (!) which support `flex` but not `table-cell`
- **Label** - `ribbon label` can now be used inside `ui image` and `ui card` correctly

### Version 1.8.1 - January 26, 2015

- **Input** - `ui labeled input` now uses  `flex` added example in ui docs with dropdown

### Version 1.8.0 - January 23, 2015

- **Label** - Fixed `ui corner label` appearing on-top of `ui dropdown` menu due to issue in z-index hierarchy
- **Label** - Fixed issue with `ui ribbon label` not positioning itself correctly when using sizes like `small` or `large`

### Version 1.7.0 - January 14, 2015

- **Button** - Fix issue with labeled icon groups in material theme

### Version 1.6.4 - January 12, 2015

- `1.6.3` contained an unintentional character at beginning of `label.less` re-released as `1.6.4`
- **Build** - Fix CSS property typo in list icon, and label causing issues with some custom build tools

### Version 1.6.3 - January 12, 2015

- `1.6.3` contained an unintentional character at beginning of `label.less` re-released as `1.6.4`
- **Build** - Fix CSS property typo in list icon, and label causing issues with some custom build tools
- **Label** - Fix attached labels to have correct border radius inside of attached segments of all kinds

### Version 1.6.0 - January 05, 2015

- **Menu** - Fixes ``ui fluid labeled icon menu`` to not have `min-width`

### Version 1.5.0 - December 30, 2014

- **Label** - ``ui ribbon label`` can now appear on the right side of content when specifying ``ui right ribbon label``
- **Checkbox** - Checkboxes now can handle labels with multiple lines of text

### Version 1.4.0 - December 22, 2014

- **Progress** - Fixes bug where ``ui indicating progress`` would not update its label immediately in webkit

### Version 1.3.0 - December 17, 2014

- **Label** - Corner attached labels now display correctly inside of attached segments

### Version 1.2.0 - December 08, 2014

- **Checkbox** - JS Checkbox now handles several variations of html. Labels can be before inputs, after, or not included at all. This should work better with server side form generation.

### Version 1.0.0 - November 24, 2014

- **Label** - Corner labels no longer support text, only icons.
- **Input** - Labeled inputs now have ``corner`` ``left`` and ``top`` label types. Any labeled inputs should be converted to ``corner labeled input`` to preserve functionality from ``0.x``
- **Dropdown** - Many new content types now work inside dropdowns, headers, dividers, images, inputs, labels and more
- **Form** - Grouped fields and inline fields can now have labels
- **Form** - New field type ``required`` formats labels to show filling out field is mandatory
- **Label** - Added tag label and empty circular label style
- **Label** - Now has compact form, for fitting into tight spaces
- **Label** - Now has more sizes available
- **More [untracked changes](https://github.com/Semantic-Org/Semantic-UI/issues?q=is%3Aissue+label%3AEnhancement+is%3Aclosed) added as well**

### Version 0.18.0 - June 6, 2014

- **Label** - Fixes border radius on bottom left label

### Version 0.16.0 - April 22, 2014

- **Checkbox** - Fixes issue where checkboxes with multiple line labels were appearing formatted incorrectly.

### Version 0.15.0 - Mar 14, 2014

- **Input** - Fixes slight error in corner label rounding **Thanks MohammadYounes**

### Version 0.13.0 - Feb 20, 2014

- **Label** - Corner labels now are coupled to have rounded edges with components with rounded edges like input

### Version 0.9.0 - Nov 5, 2013

- **Input** - Labeled icons now have smaller corner labels
- **Button** - Fixes labeled icon placement in Chrome

### Version 0.8.3 - Oct 30, 2013

- **Form** - Errored fields now have their icons and corner labels colored appropriately
- **Labels** - Fixes formatting of links inside labels

### Version 0.7.0 - Oct 22, 2013

- **Menu** - Removes vertical label width missing units in menu
- **Label** - Ribbon labels now have a shadow color
- **List** - Increased padding on attached labels

### Version 0.6.1 - Oct 15, 2013

- Adds orange label/segment
- Fixes overflow on item corner label

### Version 0.4.0 - Oct 8, 2013

- Checkboxes markup now more semantic with default markup including only one label tag that can be inside ui checkbox

### Version 0.1.0 - Sep 25, 2013

- Increased size of corner labels
- Fixes display of left corner icon labels