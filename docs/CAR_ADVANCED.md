# Car Advanced

Choose **Mushroom Addition: Car Advanced** in Home Assistant's card picker.
The vehicle engine and feature editors are bundled; installing the original
Vehicle Status Card resource is unnecessary. Both cards can coexist.

The visual editor uses the standard sections:

- **Context:** optional entity for the shared header and actions.
- **Content:** Mushroom name, primary/secondary information, icon and colours.
  Turn off **Show card header** for compact quick-control cards.
- **Layout:** shared header layout, shadow and container options, plus vehicle
  section order, image slideshow, range layout, button grid and theme controls.
- **Interactions:** header tap, hold and double-tap actions.
- **Features:** indicators, range/charging, images, mini-map and buttons. Each
  button can open entity details, custom Lovelace cards or a tire-pressure view.
  Templates and per-item actions remain available in the corresponding panels.

Vehicle settings are saved under `car`. The top-level `name`, information and
icon fields belong to the shared Mushroom header, so there is only one title.
The engine's legacy internal name and header visibility are managed internally.
At compact widths the button labels stack below their icons to remain readable
without changing your saved grid or button configuration.
Existing Vehicle Status Card settings can be copied into `car` without changing
their nested indicator, range, map, image or button configuration. Do not copy
its top-level `type` or `name`; set the Addition type and header name instead.

```yaml
type: custom:mushroom-addition-car-advanced
name: Electric car
icon: mdi:car-electric
car:
  indicator_rows:
    - row_items:
        - type: entity
          entity: sensor.car_battery
          show_name: true
          show_state: true
          show_icon: true
  images:
    - image_entity: image.car
  mini_map:
    device_tracker: device_tracker.car
    map_height: 180
    map_zoom: 14
```

Native maps use Home Assistant's map card. Optional MapTiler maps require your
own key and network access to that provider. Image URLs and embedded custom
cards must be available in your Home Assistant installation. Controls invoke
the configured Home Assistant actions; only grant dashboard access to trusted
users, and use action confirmation for sensitive vehicle operations.

The private engine is pinned to Vehicle Status Card v1.26.1. License, source
checksum and regeneration details are preserved in its vendor directory.
