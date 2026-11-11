# Energy Buy and Sell

Use `custom:mushroom-addition-advanced-energy-buy-and-sell` for a published
electricity-price timeline and an optional, explicitly enabled price-only
trade estimate. No HEMS or battery integration is required to show prices.
The card does not measure purchases, confirm sales or execute trades.

## Use your own entities

Find an integration publishing a list of electricity-price intervals, not
just the current price. Use the [source checklist](ENERGY_SETUP.md#find-your-entities-before-configuring-a-card)
in **Developer tools → States**.

1. Add **Mushroom Addition: Energy Buy and Sell** from the picker.
2. Open Features and edit the Price source mapping. Choose your entity,
   attribute or JSON source, array path, timestamp fields and numeric price field.
3. Set source/display units to the same currency. Choose the graph's span
   and whether it starts at midnight or now.
4. Leave the trade result disabled initially. Save and compare one interval's
   price and duration with the original published data.

This complete configuration uses the fictional `forecast` list documented in
[community setup](ENERGY_SETUP.md#published-prices):

```yaml
type: custom:mushroom-addition-advanced-energy-buy-and-sell
name: Electricity prices
price:
  entity: sensor.example_tariff
  adapter: attribute
  path: forecast
  startField: from
  endField: until
  priceField: rate
  sourceUnit: USD/MWh
  displayUnit: USD/kWh
buy_sell_graph_span: 24
buy_sell_span_start: now
buy_sell_show_result: false
```

Replace the source entity and fields with your own. A published value of
125 USD/MWh displays as 0.125 USD/kWh here. Currency exchange is not supported.
For a JSON-state list, use `adapter: state` and its path, or an empty path for
a root array. Missing intervals are not zero-priced.

Generic price lists show a price series only; they do not invent planned
charge or sale intervals. Published ends determine bar durations.

## Optional trade estimate

Enable the result only after choosing your own assumptions in Features.
For example, add these illustrative settings to the same card:

```yaml
buy_sell_show_result: true
buy_sell_trade_energy: 2
buy_sell_trade_power: 1
buy_sell_trade_efficiency: 90
buy_sell_feed_in_fee: 0.01
```

These are example assumptions, not recommended equipment settings:

| Setting | Meaning |
| --- | --- |
| `buy_sell_trade_energy` | Energy to sell in kWh; the estimate buys more to account for round-trip efficiency |
| `buy_sell_trade_energy_entity` | Optional numeric entity overriding the trade energy, in kWh |
| `buy_sell_trade_power` | Per-interval power limit in kW |
| `buy_sell_trade_efficiency` | Round-trip efficiency in percent, greater than 0 and at most 100 |
| `buy_sell_feed_in_fee` | Nonnegative fee in currency/kWh |
| `buy_sell_slot_minutes` | Duration fallback for legacy point slots; does not replace explicit interval ends |

Costs/revenues use the currency itself and rates use currency/kWh, regardless
of chart denomination. The estimate uses the supplied price series for both
buying and selling; a different export tariff is not inferred.

The estimate selects separate low/high-priced slots but does **not** enforce
buying before selling, battery capacity, current charge, reserves or an executable
schedule. It is not measured profit or a recommendation to control a battery.
Insufficient available intervals or invalid assumptions produce an error,
not a completed trade.

## Existing legacy feeds

An existing entity selected through Context can still supply an attribute
`slots` containing `[timestamp, price, kind]` tuples. Timestamp is ISO text or
Unix seconds/milliseconds; `kind` is 0 for price, 1 for planned grid charge,
2 for planned sell and 3 for possible sell. Those classifications must come
from the publisher; they are not inferred from generic price intervals.
The legacy price-only representation uses the existing currency/kWh convention.
Prefer an explicit `price` mapping when source units or field names differ.

## Troubleshooting

For an empty chart, check source availability, array path, date/timezone and
whether the published intervals intersect the selected graph span. Generic
intervals with malformed rows, duplicates or overlaps are rejected.
For an unavailable estimate, check energy, power, efficiency, fee and whether
enough separate intervals exist for both selections. Neither an empty graph
nor a proposed sale proves anything about actual equipment operation.
