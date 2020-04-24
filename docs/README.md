📢 Use this project, [contribute](https://github.com/vtex-apps/drawer) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Store Drawer

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

This component allows you to have a sliding drawer for your menus. This is specially handy for mobile layouts.

## Configuration

Add the app to your theme's dependencies on the `manifest.json`, for example:

```json
"dependencies": {
  "vtex.store-drawer": "0.x"
}
```

Then, you need to add the `drawer` block into your app. The following is an example taken from [Store Theme](https://github.com/vtex-apps/store-theme).

```json
"drawer": {
  "children": [
    "menu#drawer"
  ]
},

"menu#drawer": {
  "children": [
    "menu-item#category-clothing",
    "menu-item#category-decoration",
    "menu-item#custom-sale"
  ],
  "props": {
    "orientation": "vertical"
  }
},
```

There is also a block that can be used for customizing the icon that triggers the opening of the drawer, it's called `"drawer-trigger"` and can be used as follows:

```json
"drawer": {
  "children": [
    "menu#drawer"
  ],
  "blocks": ["drawer-trigger"]
},

"drawer-trigger": {
  "children": ["rich-text#open-drawer"]
},

"rich-text#open-drawer": {
  "text": "Open drawer"
}

"menu#drawer": {
  "children": [
    "menu-item#category-clothing",
    "menu-item#category-decoration",
    "menu-item#custom-sale"
  ],
  "props": {
    "orientation": "vertical"
  }
},
```

And there is a block that enables customization of the header that contains the button which closes the drawer.
It's called `"drawer-header"` and can be used in a similar way as `"drawer-trigger"`, here is an example:

```jsonc
// inside blocks.json
{
  "drawer": {
    "blocks": ["drawer-header#my-drawer"]
  },
  "drawer-header#my-drawer": {
    "children": [
      // you need to include the block `drawer-close-button` somewhere inside here
      "flex-layout.row#something",
      // ...
      "drawer-close-button"
    ]
  }
}
```

If you're using this component by itself, you just need to import it inside the component you want to use it in. Here's an example:

```tsx
import { Drawer, DrawerHeader, DrawerCloseButton } from 'vtex.store-drawer'

const Menu = () => (
  <Drawer
    header={
      <DrawerHeader>
        <DrawerCloseButton />
      </DrawerHeader>
    }
  >
    <ul>
      <li>Link 1</li>
      <li>Link 2</li>
      <li>Link 3</li>
      <li>Link 4</li>
      <li>Link 5</li>
      <li>Link 6</li>
    </ul>
  </Drawer>
)
```

## Configuration

The Drawer component accepts a few props that allow you to customize it.

| Prop name        | Type                 | Description                                                                          | Default value  |
| ---------------- | -------------------- | ------------------------------------------------------------------------------------ | -------------- |
| `maxWidth`       | `Number` or `String` | Define the open Drawer's maximum width.                                              | `450`          |
| `isFullWidth`    | `Boolean`            | Control whether or not the open Drawer should occupy the full available width.       | `false`        |
| `slideDirection` | `'horizontal'`&#124;`'vertical'`&#124;`'rightToLeft'`&#124;`'leftToRight'`             | Controls the opening animation's direction. | `'horizontal'` |

The `DrawerCloseButton` accepts the following props to customize it:

| Prop name | Type | Description | Default value |
| --- | --- | --- | --- |
| `size` | `Number` | Define the size of the icon inside the button | `30` |
| `type` | `'filled'`&#124;`'line'` | Define the type of the icon | `'line'` |

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles          |
| -------------------- |
| `drawer`             |
| `opened`             |
| `closed`             |
| `moving`             |
| `drawerContent`      |
| `drawerHeader`       |
| `openIconContainer`  |
| `closeIconContainer` |
| `closeIconButton`    |
| `childrenContainer`  |

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Radu1749"><img src="https://avatars2.githubusercontent.com/u/51535501?v=4" width="100px;" alt=""/><br /><sub><b>Radu1749</b></sub></a><br /><a href="https://github.com/vtex-apps/drawer/commits?author=Radu1749" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
