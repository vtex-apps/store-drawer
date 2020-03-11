# Store Drawer

This component allows you to have a sliding drawer for your menus. This is specially handy for mobile layouts.

## Basic Usage

To configure or customize this app, you need to import it in your dependencies in your `manifest.json` file.

```json
dependencies: {
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

### Styles API

This app provides some CSS classes as an API for style customization.

To use this CSS API, you must add the `styles` builder and create an app styling CSS file.

- Add the `styles` builder to your `manifest.json`:

```json
"builders": {
  "styles": "1.x"
}
```

- Create a file called `vtex.store-drawer.css` inside the `styles/css` folder and add your custom using regular CSS.

#### CSS Namespaces

Below, we describe the namespaces that are defined in the `store-drawer`.

| Token name           | Description                                                        |
| -------------------- | ------------------------------------------------------------------ |
| `drawer`             | The main container of the `Drawer` component.                      |
| `drawerHeader` | The container of the `DrawerHeader` component. |
| `openIconContainer`  | The container of icon that opens the Drawer when clicked.          |
| `closeIconContainer` | The container of icon that closes the Drawer when clicked.         |
| `closeIconButton`    | The button around of the icon that closes the Drawer when clicked. |
| `childrenContainer`  | The container of children blocks passed to Drawer.                 |
