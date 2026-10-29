const labelRows = `
icon_type|Тип иконе
fill_container|Попуни контејнер
card_shadow|Сенка картице
multiline_secondary|Прикажи додатне информације у више редова
primary_info|Главне информације
secondary_info|Додатне информације
collapse_entity|Помоћни ентитет за склапање
collapsed|Прикажи склопљено
weather_entity|Временски ентитет
settings_path|Путања до подешавања
window_sensor|Сензор прозора
trees_entity|Сензор полена дрвећа
grass_entity|Сензор полена трава
weeds_entity|Сензор полена корова
graph_entity|Сензор графика
eta_entity|Сензор очекиваног времена доласка
battery_warning_threshold|Праг упозорења за батерију
battery_low_threshold|Праг ниског нивоа батерије
battery_critical_threshold|Праг критичног нивоа батерије
battery_healthy_color|Боја исправне батерије
battery_warning_color|Боја упозорења за батерију
battery_low_color|Боја ниског нивоа батерије
battery_critical_color|Боја критичног нивоа батерије
consumption_entity|Сензор потрошње снаге
label_use_temperature|Прикажи ознаку температуре
label_use_brightness|Прикажи ознаку осветљености
room_light_entity|Светло у просторији (осветљеност и наглашена боја)
room_temperature_entity|Ентитет температуре просторије
room_brightness_entity|Светло за осветљеност просторије
room_move_up|Помери нагоре
room_move_down|Помери надоле
room_secondary_help|Сложите додатне информације жељеним редоследом. Све вредности потичу из главног ентитета; прекидачи ознака функција и њихови изабрани ентитети не мењају ову листу. Недоступне вредности се изостављају.
room_secondary_value|Вредност
room_part_name|Назив ентитета
room_part_state|Стање (on/off и слично)
room_part_brightness|Осветљеност (%)
room_part_add|Додај део информација
room_part_remove|Уклони део информација
room_buttons|Дугмад сензора просторије
room_buttons_help|Дугмад за радње су одвојена од малих статусних показатеља. Избор ентитета попуњава његову икону, изглед, активно стање и радње; ове вредности можете да промените.
active_state|Активно стање
room_active_state_help|Тачно стање ентитета при коме се ово дугме за радњу истиче.
room_button_action_help|Сензори отварају додатне информације; ентитети којима се може управљати подразумевано мењају стање.
room_status|Статусни показатељи
room_status_help|Додајте до четири мале иконе ентитета, одвојене од дугмади за радње. Вода и ватра/дим пулсирају плаво и црвено када се аларм активира; смањено кретање задржава боју упозорења без анимације.
room_status_kind|Врста показатеља
room_status_window|Прозор
room_status_door|Врата
room_status_motion|Кретање / присуство
room_status_water|Вода / влага
room_status_smoke|Ватра / дим
room_status_active|Активирано
room_status_inactive|Неактивно
room_status_preview|Преглед показатеља
room_status_choose_entity|Изаберите ентитет
room_status_add|Додај статусни показатељ
room_status_remove|Уклони статусни показатељ
input_select_entity|Помоћни ентитет за избор просторије
input_select_option|Опција избора просторије
level_entity|Сензор нивоа полена
clock_switch_entity|Помоћни прекидач сата
download_entity|Сензор брзине преузимања
upload_entity|Сензор брзине слања
ping_entity|Сензор Ping-а
wifi_tracker_entity|Wi-Fi пратилац
gps_tracker_entity|GPS пратилац
findmy_script_entity|Скрипта за проналажење телефона
disk_entity|Сензор заузетости диска
memory_entity|Сензор заузетости меморије
cpu_entity|Сензор употребе CPU-а
power_entity|Сензор снаге
energy_entity|Сензор енергије
time_entity|Сензор времена рада
crossfade_entity|Прекидач унакрсног прелаза
night_sound_entity|Прекидач ноћног звука
speech_enhancement_entity|Прекидач побољшања говора
subwoofer_entity|Прекидач субвуфера
surrounds_entity|Прекидач сурраунд звучника
loudness_entity|Прекидач компензације гласноће
surround_full_entity|Прекидач пуне јачине сурраунд звучника
audio_delay_entity|Контрола кашњења звука
balance_entity|Контрола баланса
bass_entity|Контрола баса
treble_entity|Контрола високих тонова
sub_gain_entity|Контрола појачања субвуфера
surround_level_entity|Контрола нивоа сурраунд звучника
music_surround_level_entity|Контрола нивоа сурраунд звучника за музику
black_entity|Сензор црног тонера
yellow_entity|Сензор жутог тонера
magenta_entity|Сензор магента тонера
cyan_entity|Сензор цијан тонера
buy_sell_title|Наслов графика
buy_sell_graph_span|Временски опсег графика (сати)
buy_sell_show_result|Прикажи резултат куповине и продаје
buy_sell_trade_energy|Минимална количина енергије за трговину (kWh)
buy_sell_trade_energy_entity|Ентитет минималне количине енергије за трговину (опционо, kWh)
buy_sell_trade_power|Снага пуњења / продаје (kW)
buy_sell_trade_efficiency|Ефикасност циклуса (%)
buy_sell_feed_in_fee|Накнада за предају у мрежу (€/kWh)
buy_sell_slot_minutes|Трајање ценовног интервала (минути)
buy_sell_span_start|Време почетка графика
buy_sell_update_interval|Интервал освежавања (минути)
buy_sell_chart_height|Висина графика
buy_sell_show_now|Прикажи ознаку тренутног времена
buy_sell_now_label|Ознака тренутног времена
buy_sell_now_color|Боја ознаке тренутног времена
buy_sell_show_legend|Прикажи легенду графика
buy_sell_show_grid|Прикажи мрежу графика
buy_sell_axis_label|Ознака осе цене
buy_sell_min_value|Најнижа цена
buy_sell_max_value|Највиша цена
buy_sell_price_decimals|Децимале тренутне цене
buy_sell_axis_decimals|Децимале ознака осе
buy_sell_bar_radius|Заобљење углова стубића
buy_sell_price_label|Ознака низа цена
buy_sell_charge_label|Ознака планираног пуњења из мреже
buy_sell_planned_sell_label|Ознака планиране продаје
buy_sell_possible_sell_label|Ознака могуће продаје
buy_sell_price_color|Боја низа цена
buy_sell_charge_color|Боја планираног пуњења из мреже
buy_sell_planned_sell_color|Боја планиране продаје
buy_sell_possible_sell_color|Боја могуће продаје
panel_health_title|Наслов картице
panel_gauge_max|Највећа вредност мерача (W)
panel_entities|Сензори панела
panel_warning_average_min|Најмања просечна вредност за упозорење (W)
panel_low_output_percent|Праг упозорења за низак учинак (%)
panel_segment_1|Праг боје 1 (W)
panel_segment_2|Праг боје 2 (W)
panel_segment_3|Праг боје 3 (W)
panel_segment_4|Праг боје 4 (W)
panel_color_0|Боја најмањег учинка
panel_color_1|Боја ниског учинка
panel_color_2|Боја умереног учинка
panel_color_3|Боја доброг учинка
panel_color_4|Боја високог учинка
panel_color_5|Боја највећег учинка
panel_show_summary|Прикажи сажетак панела
panel_show_gauges|Прикажи мераче појединачних панела
disk_name|Ознака диска
disk_icon|Икона диска
disk_color|Боја диска
temperature_name|Ознака температуре
temperature_icon|Икона температуре
temperature_color|Боја температуре
temperature_max|Највиша вредност графика температуре
memory_name|Ознака меморије
memory_icon|Икона меморије
memory_color|Боја меморије
memory_max|Највиша вредност меморије
cpu_name|Ознака CPU-а
cpu_icon|Икона CPU-а
cpu_color|Боја CPU-а
cpu_max|Највећа вредност CPU-а
graph_span|Опсег историје
chart_type|Стил графика
address_entity|Сензор адресе
min_entity|Сензор најмање вредности
max_entity|Сензор највеће вредности
show_today|Прикажи данашњи преглед сакупљања
today_entity|Сензор данашњег прегледа сакупљања
hide_unknown_dates|Сакриј ставке без познатог датума
show_tomorrow|Прикажи сутрашњи преглед сакупљања
tomorrow_entity|Сензор сутрашњег прегледа сакупљања
show_graph|Прикажи график
use_entity_picture|Користи слику ентитета
graph_hours|Сати графика
console_platform|Платформа конзоле
carousel_loop|Непрекидно понављај
carousel_show_labels|Прикажи ознаку изабране ставке
carousel_visible_items|Видљиве ставке вртешке
carousel_initial_index|Почетна изабрана ставка
carousel_button_width|Ширина дугмета
carousel_button_height|Висина дугмета
carousel_icon_size|Величина иконе дугмета
carousel_effect|Ефекат вртешке
carousel_navigation|Прикажи дугмад претходно/следеће
carousel_pagination|Прикажи пагинацију
carousel_pagination_type|Стил пагинације
carousel_scrollbar|Прикажи траку за превлачење положаја
carousel_grab_cursor|Прикажи курсор за хватање
carousel_centered_slides|Центрирај изабрани слајд
carousel_slides_per_view|Слајдова по приказу
carousel_coverflow_rotate|Ротација Coverflow-а
carousel_coverflow_stretch|Размак Coverflow-а
carousel_coverflow_depth|Дубина Coverflow-а
carousel_coverflow_modifier|Интензитет Coverflow-а
carousel_coverflow_slide_shadows|Прикажи сенке слајдова
scene_buttons_only|Прикажи само дугмад сцена
scenes_per_row|Сцена по реду
hours_to_show|Сати историје
points_per_hour|Тачака по сату
aggregate_func|Подразумевана агрегација
group_by|Групиши историју по
update_interval|Интервал ажурирања
cache|Кеширај историју
height|Висина графика
line_width|Дебљина линије
bar_spacing|Размак између стубића
smoothing|Заглади линије
animate|Анимирај график
logarithmic|Логаритамска размера
value_factor|Експонент размере вредности
decimals|Приказане децимале
hour24|Користи 24-часовни формат
font_size|Величина фонта стања
font_size_header|Величина фонта заглавља
align_header|Поравнање заглавља
align_icon|Поравнање иконе
align_state|Поравнање стања
unit|Замена јединице
icon_image|URL слике иконе
lower_bound|Доња граница главне осе
upper_bound|Горња граница главне осе
min_bound_range|Минимални опсег главне осе
lower_bound_secondary|Доња граница секундарне осе
upper_bound_secondary|Горња граница секундарне осе
min_bound_range_secondary|Минимални опсег секундарне осе
color_thresholds_transition|Прелаз између прагова боје
group|Стил уграђене картице
mini_graph_show_state|Приказ стања
mini_graph_show_fill|Попуна графика
mini_graph_show_points|Тачке података
mini_graph_show_labels|Ознаке главне осе
mini_graph_show_labels_secondary|Ознаке секундарне осе
mini_graph_show_legend|Прикажи легенду
mini_graph_show_top_labels|Прикажи горње ознаке
mini_graph_show_average|Прикажи просек
mini_graph_show_extrema|Прикажи минимум и максимум
mini_graph_name_adaptive_color|Прилагоди боју назива
mini_graph_icon_adaptive_color|Прилагоди боју иконе
mini_graph_loading_indicator|Прикажи показатељ учитавања
ulm_card_battery_battery_level_danger|Праг ниског нивоа батерије
ulm_card_battery_battery_level_warning|Праг упозорења за батерију
ulm_card_battery_attribute|Атрибут нивоа батерије
ulm_card_battery_battery_state_entity_id|Ентитет стања батерије/пуњења
ulm_card_battery_charger_type_entity_id|Ентитет врсте пуњача
ulm_card_battery_charging_animation|Анимирај током пуњења
ulm_card_battery_color_battery_level_danger|Боја ниског нивоа батерије
ulm_card_battery_color_battery_level_warning|Боја упозорења за батерију
ulm_card_battery_color_battery_level_ok|Боја исправне батерије
ulm_card_battery_name|Назив батерије
ulm_card_media_player_enable_art|Прикажи омот медија
sonos_details_always_visible|Увек прикажи детаљне контроле
use_media_info|Користи информације о медију
show_volume_level|Прикажи ниво јачине звука
media_controls|Контроле медија
collapsible_controls|Склопи контроле када је искључено
ulm_card_media_player_enable_controls|Прикажи контроле репродукције
ulm_card_media_player_enable_volume_slider|Прикажи клизач јачине звука
ulm_card_media_player_enable_volume_buttons|Прикажи дугмад за јачину звука
ulm_card_media_player_enable_volume_adjust|Корак дугмета за јачину звука
ulm_card_media_player_collapsible|Склопи контроле када је неактивно
ulm_card_media_player_idle_off|Третирај стање мировања као искључено
ulm_card_media_player_player_controls_entity|Ентитет за контролу репродукције
ulm_card_media_player_more_info|Прикажи детаље о извођачу и албуму
ulm_card_media_player_power_button|Прикажи дугме за напајање
ulm_card_media_player_force_background_color|Обоји картицу када је активна
ulm_card_media_player_color|Наглашена боја медија
ulm_card_generic_color|Наглашена боја опште картице
ulm_card_generic_force_background_color|Обоји општу картицу док је активна
ulm_card_generic_swap_color|Измењена наглашена боја картице
ulm_card_generic_swap_force_background_color|Обоји измењену картицу док је активна
ulm_card_navigate_color|Наглашена боја навигације
ulm_card_binary_sensor_color|Наглашена боја бинарног сензора
ulm_card_binary_sensor_force_background_color|Обоји картицу док је сензор активан
ulm_card_binary_sensor_icon|Икона бинарног сензора
ulm_card_binary_sensor_name|Назив бинарног сензора
ulm_card_binary_sensor_show_last_changed|Прикажи време последње промене стања
ulm_card_binary_sensor_alert_color|Наглашена боја упозорења
ulm_card_binary_sensor_alert_force_background_color|Обоји картицу упозорења док је активна
ulm_card_binary_sensor_alert_icon|Икона упозорења
ulm_card_binary_sensor_alert_name|Назив упозорења
ulm_card_binary_sensor_alert_show_last_changed|Прикажи време последње промене упозорења
ulm_card_input_boolean_icon|Икона улазног логичког ентитета
ulm_card_input_boolean_name|Назив улазног логичког ентитета
custom_card_pollen_tree_name|Назив полена дрвећа
custom_card_pollen_tree_icon|Икона полена дрвећа
custom_card_pollen_grass_name|Назив полена трава
custom_card_pollen_grass_icon|Икона полена трава
custom_card_pollen_weed_name|Назив полена корова
custom_card_pollen_weed_icon|Икона полена корова
ulm_custom_card_washer_power|Сензор снаге
ulm_custom_card_washer_remote_control|Статус даљинског управљања
ulm_custom_card_washer_machine_state|Стање машине
ulm_custom_card_washer_machine_stop_state|Вредност заустављеног стања
ulm_custom_card_washer_job_state|Тренутна фаза програма
ulm_custom_card_washer_job_progress|Напредак програма
ulm_custom_card_washer_job_states|Фазе програма
ulm_custom_card_washer_delayed_start|Прекидач одложеног почетка
ulm_custom_card_washer_delayed_starttime|Време одложеног почетка
ulm_custom_card_washer_label_idle|Ознака мировања
ulm_custom_card_washer_label_configuring|Ознака подешавања
ulm_custom_card_washer_label_running|Ознака рада
ulm_custom_card_washer_start_action|Радња покретања
ulm_custom_card_washer_pause_action|Радња паузирања
ulm_custom_card_washer_stop_action|Радња заустављања
machine_state_entity|Ентитет стања машине
program_stage_entity|Ентитет тренутне фазе програма
washer_power_entity|Сензор снаге машине за прање
program_select_entity|Избор програма
datetime_step|Величина корака (минути)
show_people|Прикажи људе
people_entities|Људи
light_show_brightness|Клизач осветљености
light_show_members|Прикажи светла у групи
light_members_expanded|Падајући мени отворен подразумевано
light_members_per_row|Светла по реду
light_show_scenes|Прикажи сцене
use_light_color|Користи боју светла
show_color_temp_control|Контрола температуре боје
show_color_control|Контрола боје
full_collapse_controls|Потпуно скупљање контрола
lights_in_group|Светла
show_extra_pollen|Додатни сензори полена
datetime_single_row|Један ред
datetime_manual_entry|Ручни унос времена
power_switch_entity|Дугме за напајање
grid_power_entity|Снага електричне мреже
grid_phase_1_entity|Фаза мреже L1
grid_phase_2_entity|Фаза мреже L2
grid_phase_3_entity|Фаза мреже L3
solar_power_entity|Снага соларне производње
solar_forecast_entity|Соларна прогноза
battery_level_entity|Ниво главне батерије
battery_power_entity|Снага главне батерије
battery_1_level_entity|Ниво батерије 1
battery_1_power_entity|Снага батерије 1
battery_2_level_entity|Ниво батерије 2
battery_2_power_entity|Снага батерије 2
battery_3_level_entity|Ниво батерије 3
battery_3_power_entity|Снага батерије 3
ev_charger_power_entity|Снага EV пуњача
energy_mode_entity|Режим енергије
energy_auto_control_entity|Аутоматско управљање
electricity_price_entity|Тренутна цена електричне енергије
tariff_markup_entity|Додатак на тарифу
tariff_vat_entity|Проценат ПДВ-а тарифе
energy_grid_label|Ознака мировања мреже
energy_grid_import_label|Ознака преузимања енергије из мреже
energy_grid_export_label|Ознака предаје енергије у мрежу
energy_solar_label|Ознака соларне енергије
energy_battery_label|Ознака батерије
energy_home_label|Ознака потрошње домаћинства
energy_forecast_label|Ознака прогнозе
energy_ev_label|Ознака EV пуњача
energy_charge_label|Ознака пуњења батерије
energy_discharge_label|Ознака пражњења батерије
energy_idle_label|Ознака мировања батерије
energy_auto_label|Ознака аутоматског режима
energy_manual_label|Ознака ручног режима
mode_solar_first_label|Ознака приказа прво соларне енергије
mode_smart_saving_label|Ознака паметне уштеде
mode_smart_trading_label|Ознака паметне трговине
grid_phase_scale_max|Максимум лука фазе мреже
solar_scale_max|Максимум соларног лука
battery_unit_scale_max|Максимум лука јединице батерије
home_scale_max|Максимум лука домаћинства
price_low_threshold|Праг ниске цене
price_medium_threshold|Праг средње цене
price_high_threshold|Праг високе цене
price_critical_threshold|Праг критичне цене
show_grid_phases|Прикажи фазе мреже
show_battery_units|Прикажи појединачне батерије
show_tariff_timeline|Прикажи временску линију тарифе
import_color|Боја преузимања из мреже
export_color|Боја предаје у мрежу
solar_color|Боја соларне енергије
battery_color|Боја батерије
home_color|Боја домаћинства
price_negative_color|Боја негативне цене
price_low_color|Боја ниске цене
price_medium_color|Боја средње цене
price_high_color|Боја високе цене
price_critical_color|Боја критичне цене
door_entity|Ентитет врата
finished_entity|Ентитет завршетка
battery_state_entity|Ентитет стања батерије
charger_type_entity|Ентитет врсте пуњача
secondary_entity|Секундарни ентитет
darkMode|Тамни режим
showAzimuth|Прикажи азимут
showElevation|Прикажи елевацију
showMoon|Прикажи детаље о Месецу
moon_entity|Ентитет Месечеве фазе
moon_altitude_entity|Ентитет висине Месеца
moon_azimuth_entity|Ентитет азимута Месеца
moon_rising_entity|Ентитет изласка Месеца
moon_setting_entity|Ентитет заласка Месеца
moon_right_ascension_entity|Ентитет ректасцензије Месеца
moon_declination_entity|Ентитет деклинације Месеца
moon_distance_entity|Ентитет удаљености Месеца
moon_angular_diameter_entity|Ентитет угаоног пречника Месеца
moon_phase_angle_entity|Ентитет фазног угла Месеца
moon_illumination_entity|Ентитет осветљености Месеца
moon_next_full_moon_entity|Ентитет следећег пуног Месеца
moon_next_new_moon_entity|Ентитет следећег младог Месеца
moon_above_horizon_entity|Ентитет Месеца изнад хоризонта
timeFormat|Формат времена
ulm_custom_card_speedtest_download_speed_entity|Сензор брзине преузимања
ulm_custom_card_speedtest_download_speed_color|Боја мерача преузимања
ulm_custom_card_speedtest_download_speed_max|Максимум мерача преузимања
ulm_custom_card_speedtest_upload_speed_entity|Сензор брзине слања
ulm_custom_card_speedtest_upload_speed_color|Боја мерача слања
ulm_custom_card_speedtest_upload_speed_max|Максимум мерача слања
ulm_custom_card_speedtest_ping_entity|Сензор Ping-а
ulm_custom_card_speedtest_ping_color|Боја Ping мерача
ulm_custom_card_speedtest_ping_max|Максимум Ping мерача
ulm_custom_card_speedtest_round|Заокружи вредности брзине
ulm_custom_card_divider_title_name|Наслов раздвајача
ulm_custom_card_divider_title_nav|Путања за повратну навигацију
ulm_custom_card_divider_subtitle_name|Поднаслов раздвајача
ulm_custom_card_nas_text|Ознака NAS статуса
ulm_custom_card_nas_sensor|Сензор NAS статуса
ulm_custom_card_nas_unit|Јединица NAS статуса
ulm_custom_cad_nas_unit|Јединица NAS статуса
ulm_card_update_enable_controls|Прикажи контроле ажурирања
ulm_card_update_collapsible|Склопи контроле када је ажурирано
ulm_card_update_horizontal|Користи водоравни распоред ажурирања
ulm_card_update_narrow_buttons|Користи уска дугмад за ажурирање
ulm_card_update_icon|Икона ажурирања
ulm_language|Језик сата
ulm_custom_card_entity_1_name|Назив врата
ulm_custom_card_entity_1_lock|Брава на вратима
ulm_custom_card_entity_1_lock_battery|Батерија браве на вратима
ulm_card_homeassistant_entity|Ентитет укупног статуса ажурирања
ulm_card_homeassistant_core|Ентитет ажурирања Home Assistant Core-а
ulm_card_homeassistant_supervisor|Ентитет ажурирања Supervisor-а
ulm_card_homeassistant_os|Ентитет ажурирања Home Assistant OS-а
tablet_button_usb_entity|USB контрола
tablet_button_motion_entity|Контрола кретања
tablet_button_display_entity|Контрола екрана
tablet_restart_entity|Дугме за поновно покретање
tablet_maintenance_entity|Контрола режима одржавања
tablet_reload_entity|Дугме за поновно учитавање
tablet_ram_entity|Сензор употребе RAM-а
tablet_disk_entity|Сензор заузетости диска
tablet_power_entity|Ентитет стања напајања
ulm_show_button|Прикажи дугме осцилације
ulm_button_icon|Икона дугмета осцилације
ulm_button_service|Услуга осцилације
ulm_card_flower_entity|Ентитет биљке
ulm_card_flower_name|Назив биљке
ulm_card_flower_species|Врста биљке
ulm_card_flower_show_bars|Траке атрибута биљке
moisture_entity|Сензор влажности
conductivity_entity|Сензор проводљивости
illuminance_entity|Сензор осветљености
dli_entity|Сензор дневне светлосне интегралне вредности
console_show_artwork|Прикажи слику игре
console_show_controls|Прикажи контроле конзоле
followers_entity|Ентитет пратилаца
following_entity|Ентитет праћења
friends_entity|Ентитет пријатеља
primary_stat_entity|Главна статистика горе десно
secondary_stat_entity|Секундарна статистика горе десно
primary_stat_icon|Икона главне статистике
secondary_stat_icon|Икона секундарне статистике
now_playing_entity|Ентитет тренутне игре
gamerpic_entity|Ентитет слике профила
artwork_entity|Ентитет слике игре
console_power_entity|Ентитет напајања конзоле
ulm_custom_card_window_handle|Сензор положаја ручке
ulm_custom_card_window_name|Назив врата или прозора
ulm_custom_card_window_icon|Икона врата или прозора
ulm_custom_card_window_color|Боја отвореног стања
ulm_custom_card_window_force_background_color|Обоји позадину када је активно
ulm_custom_card_window_battery_level|Сензор нивоа батерије
ulm_custom_card_window_battery_warning|Праг упозорења за батерију
ulm_custom_card_window_battery_warning_low|Праг ниског нивоа батерије
ulm_show_last_changed|Прикажи време последње промене
ulm_card_printer_name|Назив штампача
cartridges|Кертриџи штампача
ulm_card_dynamic_color|Користи боју светла као наглашену боју просторије
ulm_card_welcome_collapse|Помоћни ентитет за склапање картице добродошлице
ulm_weather|Временски извор
nav_1|Прва путања навигације
icon_1|Прва икона навигације
name_1|Први назив навигације
color_1|Прва боја навигације
nav_2|Друга путања навигације
icon_2|Друга икона навигације
name_2|Други назив навигације
color_2|Друга боја навигације
nav_3|Трећа путања навигације
icon_3|Трећа икона навигације
name_3|Трећи назив навигације
color_3|Трећа боја навигације
nav_4|Четврта путања навигације
icon_4|Четврта икона навигације
name_4|Четврти назив навигације
color_4|Четврта боја навигације
nav_5|Пета путања навигације
icon_5|Пета икона навигације
name_5|Пети назив навигације
color_5|Пета боја навигације
ui.runtime_toggle_scenes_10ed0221|Укључи или искључи сцене
ui.runtime_open_dashboard_settings_2900bd78|Отвори подешавања контролне табле
ui.runtime_sensor_status_459d5f94|Статус сензора
ui.runtime_device_controls_340839d9|Контроле уређаја
ui.runtime_climate_more_information_1e506540|Клима · Додатне информације
ui.runtime_low_batteries_57518232|Батерије су при крају
ui.runtime_toggle_welcome_navigation_8ee01d97|Укључи или искључи навигацију добродошлице
ui.runtime_weather_information_8e793b25|Информације о времену
ui.runtime_dashboard_settings_95d4e44b|Подешавања контролне табле
ui.runtime_stop_washer_630a44cc|Заустави машину за прање веша
ui.runtime_move_delayed_start_1_minute_later_fcfa84f7|Помери одложени почетак за 1 минут касније
ui.runtime_move_delayed_start_15_minutes_earlier_5a6b8cb2|Помери одложени почетак за 15 минута раније
ui.runtime_move_delayed_start_15_minutes_later_d8f3d6e6|Помери одложени почетак за 15 минута касније
ui.runtime_sunrise_9c7c53e8|Излазак Сунца
ui.runtime_moonrise_cc575d66|Излазак Месеца
ui.runtime_moonset_4318b184|Залазак Месеца
ui.runtime_sunset_275dbda9|Залазак Сунца
ui.runtime_dawn_0dfd8feb|Зора
ui.runtime_solar_noon_772e3d81|Соларно подне
ui.runtime_dusk_abd7160c|Сумрак
ui.runtime_sun_c9fc0765|Сунце:
ui.runtime_azimuth_4969fe3a|Азимут
ui.runtime_elevation_8a7d4c8e|Висина
ui.runtime_moon_eb2bc9ae|Месец:
ui.runtime_moon_5fc16525|Месец
ui.runtime_next_full_moon_6be02b26|Следећи пун Месец
ui.runtime_next_new_moon_2da63bdf|Следећи млад Месец
ui.runtime_15_minutes_earlier_595029c0|15 минута раније
ui.runtime_one_minute_later_hold_for_one_minute_earlier_e2696306|Минут касније; задржите за минут раније
ui.runtime_15_minutes_later_d35c4278|15 минута касније
ui.runtime_shuffle_317cb3a7|Насумично
ui.runtime_sources_and_details_d0fb8555|Извори и детаљи
ui.runtime_volume_level_d096aa36|Ниво јачине звука
ui.runtime_more_details_b5eff1db|Више детаља
ui.runtime_open_nas_status_0301c039|Отвори NAS статус
ui.runtime_status_920e413c|Статус
ui.runtime_nas_temperature_memory_and_cpu_utilization_66678f30|Температура, меморија и употреба CPU-а NAS-а
ui.runtime_battery_dfcb7c16|Батерија
ui.runtime_advanced_home_energy_live_flow_808816ff|Напредни приказ токова енергије у домаћинству
ui.runtime_battery_5be9b853|▮ Батерија
ui.runtime_no_price_slots_available_26490864|Нема доступних ценовних интервала
ui.runtime_buy_and_sell_result_6af1c7b8|Резултат куповине и продаје
ui.runtime_slots_4fd72c06|Интервали
ui.runtime_avg_kwh_4d05183c|прос. €/kWh
ui.runtime_buy_and_sell_estimate_a97efcc9|Процена куповине и продаје
ui.runtime_select_panel_sensors_in_the_card_editor_or_add_sensors_with_entity_ids_beginning_with_sensor_inverter_4_1ba7d684|Изаберите сензоре панела у уређивачу картице или додајте сензоре чији ID-ови ентитета почињу са sensor.inverter_4.
ui.runtime_open_plant_details_12c92dae|Отвори детаље о биљци
ui.runtime_add_button_c0f290f3|Додај дугме
ui.runtime_button_entity_e936cff1|Ентитет дугмета
ui.runtime_defaults_to_the_entity_icon_or_a_suitable_icon_for_its_domain_69cf5d5d|Подразумевано се користи икона ентитета или одговарајућа икона његовог домена.
ui.runtime_color_6b73191a|Боја
ui.runtime_accent_color_used_by_the_button_and_its_active_state_2d77f2cf|Наглашена боја дугмета и његовог активног стања.
ui.runtime_custom_name_3c26a847|Прилагођени назив
ui.runtime_text_shown_below_the_button_change_it_independently_for_every_button_6da87756|Текст испод дугмета. Можете га променити засебно за свако дугме.
ui.runtime_icon_type_f9086832|Врста иконе
ui.runtime_show_the_selected_icon_or_the_entity_picture_when_one_is_available_ff8a0fc7|Прикажи изабрану икону или слику ентитета ако је доступна.
ui.runtime_navigation_path_1a28c98b|Путања навигације
ui.runtime_optional_destination_selected_from_your_home_assistant_dashboards_it_overrides_the_tap_action_5d6736e4|Опционо одредиште из контролних табли Home Assistant-а. Има предност над радњом додира.
ui.runtime_graph_entities_3f46517b|Ентитети графика
ui.runtime_entities_are_rendered_in_this_order_every_series_can_override_aggregation_axis_color_visibility_attributes_and_smoothing_4dd10bc4|Ентитети се приказују овим редоследом. Сваки низ може да замени агрегацију, осу, боју, видљивост, атрибуте и заглађивање.
ui.runtime_add_graph_entity_1dce7999|Додај ентитет графика
ui.runtime_color_thresholds_47f6d126|Прагoви боја
ui.runtime_ordered_value_stops_color_the_graph_leave_intermediate_values_empty_to_interpolate_them_between_surrounding_stops_5339c53f|Уређене граничне вредности одређују боје графика. Оставите међувредности празне да би се израчунале из суседних граница.
ui.runtime_add_color_threshold_e0e2c0fc|Додај праг боје
ui.runtime_state_map_a1dcc53d|Мапа стања
ui.runtime_map_non_numeric_states_to_ordered_graph_levels_row_order_defines_each_state_s_numeric_position_10ce2b10|Повежите ненумеричка стања са уређеним нивоима графика. Редослед редова одређује бројчани положај сваког стања.
ui.runtime_add_state_mapping_32e1335f|Додај мапирање стања
ui.runtime_recorder_history_is_loaded_for_this_entity_the_first_entity_is_also_the_primary_card_entity_0a9e44b6|За овај ентитет учитава се историја Recorder-а. Први ентитет је уједно главни ентитет картице.
ui.runtime_attribute_path_a6e3c7bb|Путања атрибута
ui.runtime_optional_nested_path_such_as_battery_level_30fc3244|Опциона угнежђена путања, на пример battery.level.
ui.runtime_unit_override_99057231|Замена јединице
ui.runtime_aggregation_749cfaf9|Агрегација
ui.runtime_y_axis_28786392|Y оса
ui.runtime_move_up_c66feb5e|Помери нагоре
ui.runtime_move_down_40bb50da|Помери надоле
ui.runtime_value_8e37953d|Вредност
ui.runtime_entity_state_45cc7abd|Стање ентитета
ui.runtime_display_label_a5c8b530|Приказана ознака
ui.runtime_waste_streams_fa67be0b|Врсте отпада
ui.runtime_each_enabled_row_uses_its_own_sensor_or_calendar_entity_empty_or_disabled_rows_are_omitted_from_the_card_82fe9c7f|Сваки укључен ред користи свој сензор или календарски ентитет. Празни и искључени редови се изостављају из картице.
ui.runtime_add_waste_stream_76b97d0c|Додај врсту отпада
ui.runtime_show_this_waste_stream_60dd38c1|Прикажи ову врсту отпада
ui.runtime_collection_date_entity_b7111fae|Ентитет датума сакупљања
ui.runtime_playlist_shortcuts_d8f0f3a6|Пречице до плејлиста
ui.runtime_add_sonos_playlists_or_other_media_ids_each_shortcut_starts_playback_on_the_card_s_primary_sonos_entity_c31743de|Додајте Sonos плејлисте или друге ID-ове медија. Свака пречица покреће репродукцију на главном Sonos ентитету картице.
ui.runtime_columns_53aade77|Колоне
ui.runtime_number_of_shortcut_buttons_shown_on_each_row_28d3e639|Број дугмади пречица у сваком реду.
ui.runtime_add_playlist_shortcut_ba3e0f30|Додај пречицу плејлисте
ui.runtime_optional_text_shown_below_the_icon_24414396|Опциони текст испод иконе.
ui.runtime_media_type_080d6914|Врста медија
ui.runtime_use_playlist_for_spotify_playlist_ids_or_another_media_type_supported_by_your_player_c0de82c4|Користите playlist за ID-ове Spotify плејлиста или другу врсту медија коју плејер подржава.
ui.runtime_playlist_or_media_id_a10f5817|ID плејлисте или медија
ui.runtime_carousel_items_59e9ade9|Ставке вртешке
ui.runtime_add_entity_aware_icon_buttons_swipe_or_scroll_to_move_through_them_tap_the_centered_item_to_run_its_action_ce36866d|Додајте иконе дугмади повезане са ентитетима. Превуците или померајте да бисте се кретали; додирните централну ставку да бисте покренули њену радњу.
ui.runtime_add_carousel_item_cad26595|Додај ставку вртешке
ui.runtime_use_entity_icon_e4d865ae|Користи икону ентитета
ui.runtime_visual_ba303321|Изглед
ui.runtime_mini_graph_preview_b3917a0c|Преглед Mini Graph-а
ui.runtime_average_b38ae2c5|Просек
ui.runtime_minimum_735beee2|Минимум
ui.runtime_maximum_66c9ab17|Максимум
ui.runtime_add_carousel_items_in_the_card_editor_ae64b80e|Додајте ставке вртешке у уређивачу картице
ui.runtime_entity_carousel_01e7e65b|Вртешка ентитета
ui.runtime_previous_item_81b35f1b|Претходна ставка
ui.runtime_next_item_1e47d4f7|Следећа ставка
ui.runtime_carousel_position_b4f6ef39|Положај вртешке
ui.runtime_carousel_progress_b3ec31f8|Напредак вртешке
ui.runtime_retry_native_area_card_bf001ec1|Поново покушај учитавање изворне картице области
ui.runtime_loading_native_area_controls_e5ce778f|Учитавање изворних контрола области…
ui.runtime_loading_native_area_card_92de5bba|Учитавање изворне картице области…
ui.runtime_conditional_control_needs_a_nested_button_6e168d53|Условној контроли је потребно угнежђено дугме.
ui.runtime_loading_conditional_control_679f2248|Учитавање условне контроле…
ui.runtime_retry_942087cc|Покушај поново
ui.runtime_domain_icon_and_tap_overrides_require_an_entity_control_select_an_entity_below_instead_00a70899|Замена иконе домена и радње додира захтевају контролу ентитета. Уместо тога изаберите ентитет испод.
ui.runtime_edit_native_domain_group_cbbd3a73|Уреди изворну групу домена
ui.runtime_back_to_buttons_e475ad95|← Назад на дугмад
ui.runtime_group_membership_icon_and_actions_stay_native_add_an_entity_button_for_a_custom_icon_name_or_action_04800467|Чланство у групи, икона и радње остају изворни. Додајте дугме ентитета за прилагођену икону, назив или радњу.
ui.runtime_conditions_use_home_assistant_s_native_conditional_card_including_nested_conditions_1b7643b4|Услови користе изворну условну картицу Home Assistant-а, укључујући угнежђене услове.
ui.runtime_nested_button_type_8d5eaaf1|Врста угнежђеног дугмета
ui.runtime_content_name_icon_and_icon_color_accept_home_assistant_jinja_templates_templates_run_in_home_assistant_not_in_the_browser_errors_are_shown_on_the_button_preview_f15200eb|Садржај, назив, икона и боја иконе прихватају Jinja шаблоне Home Assistant-а. Шаблони се извршавају у Home Assistant-у, а не у прегледачу. Грешке се приказују у прегледу дугмета.
ui.runtime_advanced_area_controls_960ae2fe|Напредне контроле области
ui.runtime_use_the_native_editor_above_for_area_appearance_features_and_standard_domain_groups_edit_advanced_buttons_below_action_template_and_conditional_buttons_are_intentionally_hidden_from_native_control_lists_names_and_content_appear_below_icons_aligned_to_the_button_bottom_empty_controls_show_no_controls_automatic_controls_retain_home_assistant_defaults_8ead6f08|Користите изворни уређивач изнад за област, изглед, функције и стандардне групе домена. Уредите напредна дугмад испод. Дугмад радњи, шаблона и услова намерно су сакривена са изворних листа контрола. Називи и садржај приказују се испод икона, поравнати са дном дугмета. Празна листа не приказује контроле; аутоматске контроле задржавају подразумеване поставке Home Assistant-а.
ui.runtime_add_button_type_69280b4f|Врста дугмета за додавање
ui.runtime_add_button_0c93bd40|Додај дугме…
ui.runtime_use_automatic_native_controls_298d994d|Користи аутоматске изворне контроле
ui.runtime_clear_controls_44485523|Обриши контроле
ui.runtime_automatic_native_domain_controls_da94dfd2|Аутоматске изворне контроле домена
ui.runtime_drag_to_reorder_alt_plus_arrow_keys_to_move_8f7f1eff|Превуците да бисте променили редослед; користите Alt и стрелице за померање
ui.runtime_drag_up_or_down_to_reorder_keyboard_alt_up_or_down_3e98c5b3|Превуците нагоре или надоле да промените редослед. Тастатура: Alt + Up или Down.
ui.runtime_edit_button_96e34f60|Уреди дугме
ui.runtime_remove_control_93667f0a|Уклони контролу
ui.runtime_mushroom_addition_preview_80dd20ee|Преглед Mushroom Addition-а
ui.area.edit_entity|Уреди дугме ентитета
ui.area.edit_action|Уреди дугме радње
ui.area.edit_template|Уреди дугме шаблона
ui.area.edit_conditional|Уреди условно дугме
ui.area.kind_template|Шаблон
ui.area.kind_conditional|Услов
ui.area.feature|Функција контрола области {number}
ui.area.loading_editor|Учитавање изворног уређивача области…
ui.area.alert_color|Боја иконе упозорења
ui.area.sensor_wrap|Преломи вредности сензора у додатне редове
ui.area.sensor_icons|Прикажи мале сиве иконе ентитета поред вредности сензора
ui.area.use_light_color|Користи боју светла као наглашену боју просторије
ui.area.alert_color_help|Мења обојене кругове упозорења, укључујући компактну значку упозорења. Обришите да бисте користили подразумевану боју Home Assistant-а.
ui.area.sensor_wrap_help|Задржава видљиве све изабране класе сензора уместо да скрати дугачак ред.
ui.area.sensor_icons_help|Користи подразумевану икону сваког сензора. Вредности и агрегацијом и даље управља Home Assistant.
ui.area.use_light_color_help|Аутоматски користи активно RGB светло у области ове картице. Избор светла није потребан; изузета светла се занемарују.
ui.area.native_group|Изворна група {domain}
ui.area.entity_button|Дугме ентитета
ui.area.action_button|Дугме радње
ui.area.template_button|Дугме шаблона
ui.area.conditional_button|Условно дугме
ui.area.back_conditional|← Назад на условно дугме
ui.area.edit_nested|Уреди угнежђено {type}
ui.area.entity_any_domain|Ентитет (било који домен)
ui.area.name_below|Назив (испод иконе)
ui.area.icon_default|Икона (празно = подразумевана икона ентитета)
ui.area.text_below|Текст испод иконе
ui.area.attribute|Изаберите атрибут ентитета за приказ
ui.area.template_content|Шаблон садржаја
ui.area.content_below|Текст који се приказује испод иконе
ui.area.tap|Понашање при додиру
ui.area.hold|Понашање при задржавању
ui.area.double_tap|Понашање при двоструком додиру
ui.area.icon_only|Само икона (без текста)
ui.area.entity_or_name|Ентитет или прилагођени назив
ui.area.entity_value|Тренутна вредност ентитета
ui.area.since_changed|Време од промене стања
ui.area.since_updated|Време од последњег ажурирања
ui.area.entity_attribute|Један од атрибута ентитета
ui.area.own_text|Ваш текст
ui.area.attribute_help|Приказује изабрано својство ентитета, на пример brightness или battery_level. Користи се само када је изабран садржај атрибута.
ui.area.content_help|Приказује тачно унети текст, на пример Desk lights. Изаберите „Ваш текст“ изнад.
ui.area.replace_automatic|Замени аутоматске контроле
ui.area.area_action|Радња области
ui.renderer.Each button starts with sensible values from its entity. You can override every value, including its name.|Свако дугме преузима одговарајуће почетне вредности од свог ентитета. Можете да промените сваку вредност, укључујући назив.
ui.renderer.Select the entity this button controls. Welcome Scenes supports every Home Assistant domain.|Изаберите ентитет којим ово дугме управља. Welcome Scenes подржава све домене Home Assistant-а.
ui.renderer.Select the entity represented by this room sensor button.|Изаберите ентитет који представља ово дугме сензора просторије.
ui.renderer.Median|Медијана
ui.renderer.First|Први
ui.renderer.Last|Последњи
ui.renderer.Sum|Збир
ui.renderer.Range|Опсег
ui.renderer.Difference|Разлика
ui.renderer.State in legend|Стање у легенди
ui.renderer.Color indicator|Показатељ боје
ui.renderer.Include in graph|Укључи у график
ui.renderer.Show line|Прикажи линију
ui.renderer.Show fill|Прикажи попуну
ui.renderer.Show points|Прикажи тачке
ui.renderer.Show in legend|Прикажи у легенди
ui.renderer.Adaptive state color|Прилагодљива боја стања
ui.renderer.Use fixed current value|Користи фиксну тренутну вредност
ui.renderer.Smooth this line|Заглади ову линију
ui.renderer.Primary (left)|Главна (лево)
ui.renderer.Secondary (right)|Секундарна (десно)
ui.renderer.Scenes|Сцене
ui.renderer.Secured|Обезбеђено
ui.renderer.Attention|Пажња
ui.renderer.Navigate|Иди на
ui.renderer.Disable alarm|Искључи аларм
ui.renderer.Enable alarm|Укључи аларм
ui.renderer.Next collections|Следећа сакупљања
ui.renderer.Doors|Врата
ui.renderer.Windows|Прозори
ui.renderer.Motion|Покрет
ui.renderer.Water|Вода
ui.renderer.Lights|Светла
ui.renderer.Shutters|Ролетне
ui.renderer.Outlets|Утичнице
ui.renderer.Television|Телевизор
ui.renderer.Standby (stop playback)|Режим приправности (заустави репродукцију)
ui.renderer.Previous track|Претходна нумера
ui.renderer.Next track|Следећа нумера
ui.renderer.Access|Приступ
ui.renderer.Disk|Диск
ui.renderer.Temp|Температура
ui.renderer.Memory|Меморија
ui.renderer.CPU|CPU
ui.renderer.Toggle USB|Укључи или искључи USB
ui.renderer.Toggle motion|Укључи или искључи покрет
ui.renderer.Toggle display|Укључи или искључи екран
ui.renderer.Restart tablet|Поново покрени таблет
ui.renderer.Toggle maintenance mode|Укључи или искључи режим одржавања
ui.renderer.Reload tablet|Поново учитај таблет
ui.renderer.RAM|RAM
ui.renderer.Followers|Пратиоци
ui.renderer.Following|Праћење
ui.renderer.Friends|Пријатељи
ui.renderer.Turn console off|Искључи конзолу
ui.renderer.Turn console on|Укључи конзолу
ui.renderer.Power off|Искључи напајање
ui.renderer.Power on|Укључи напајање
ui.renderer.Solar first|Прво соларна енергија
ui.renderer.Smart saving|Паметна уштеда
ui.renderer.Smart trading|Паметна трговина
ui.renderer.Auto|Аутоматски
ui.renderer.Manual|Ручно
ui.renderer.Discharging|Пражњење
ui.renderer.Idle|Мировање
ui.renderer.GRID · Import|МРЕЖА · преузимање
ui.renderer.GRID · Export|МРЕЖА · предаја
ui.renderer.GRID|МРЕЖА
ui.renderer.Solar Panels|Соларни панели
ui.renderer.Expected|Очекује се
ui.renderer.Battery|Батерија
ui.renderer.HOME|ДОМ
ui.renderer.EV charger|EV пуњач
ui.renderer.Price|Цена
ui.renderer.Planned grid charge|Планирано пуњење из мреже
ui.renderer.Planned sell|Планирана продаја
ui.renderer.Possible sell|Могућа продаја
ui.renderer.Buy and sell moments (all-in €/kWh)|Тренуци куповине и продаје (укупно €/kWh)
ui.renderer.Price timeline|Временска линија цена
ui.renderer.Now|Сада
ui.renderer.Buy|Купи
ui.renderer.Sell|Продај
ui.renderer.No panel sensors are selected.|Није изабран ниједан сензор панела.
ui.renderer.All panels are within the expected range of each other.|Сви панели су у очекиваном међусобном опсегу.
ui.renderer.Panels reporting|Панели који шаљу податке
ui.renderer.Combined output|Укупни учинак
ui.renderer.Average per panel|Просек по панелу
ui.renderer.Best panel|Најбољи панел
ui.renderer.Weakest panel|Најслабији панел
ui.renderer.Best-to-weakest spread|Разлика између најбољег и најслабијег
ui.renderer.Panel health|Стање панела
ui.renderer.Solar panel output|Учинак соларног панела
ui.renderer.Problem|Проблем
ui.renderer.Healthy|Исправно
ui.renderer.Download|Преузимање
ui.renderer.Upload|Слање
ui.renderer.Ping|Ping
ui.renderer.entity_number|Ентитет {number}
ui.renderer.threshold_number|Праг {number}
ui.renderer.state_number|Стање {number}
ui.renderer.waste_number|Врста отпада {number}
ui.renderer.shortcut_number|Пречица {number}
ui.renderer.example|На пример: {value}
ui.renderer.more_info|{label}: {state} · Додатне информације
ui.renderer.unavailable_count|Недоступно: {count}
ui.renderer.item|Ставка {number}
ui.renderer.shortcut|Пречица за репродукцију {number}
ui.renderer.energy_chart|Цене енергије и планиране радње у наредних {hours} сати
ui.renderer.weak_panel|Панел {panel} даје мање од {percent}% просека. Проверите да ли је засенчен или неисправан.
ui.renderer.inactive_panels|{count} панела има вредност нула. То је нормално ноћу; у супротном их проверите.
ui.renderer.panel_watts|{name}: {value} вати
`;

const parseRows = (rows: string): Record<string, string> =>
  Object.fromEntries(rows.trim().split("\n").map((row) => {
    const separator = row.indexOf("|");
    return [row.slice(0, separator), row.slice(separator + 1)];
  }));

export const serbianLabels: Record<string, string> = parseRows(labelRows);

const helperRows = `
pihole_show_header|Прикажи заједничко Mushroom заглавље изнад Pi-hole одељака.
pihole_collapsed_sections|Одељци су у почетку склопљени; додирните наслов да бисте их проширили.
pihole_hidden_entities|Изузмите ове ентитете из аутоматског откривања, контрола и историје.
pihole_columns|Број плочица са статистиком у реду. Уске картице користе једну колону.
pihole_accent_color|Наглашена боја икона статистике и активних прекидача за блокирање.
pihole_chart_hours|Број сати историје Recorder-а за CPU и меморију.
pihole_chart_height|Висина графика историје система у пикселима.
pihole_metric_hold_action|Радња при задржавању на плочици статистике. Празно значи да нема радње.
pihole_metric_double_tap_action|Радња при двоструком додиру плочице статистике. Подешена радња кратко одлаже појединачне додире да би избегла дупликате.
upcoming_image_style|Прикажи постер поред текста или fanart као позадину.
upcoming_max_items|Ограничи листу медија након филтрирања, сортирања и груписања по приоритету.
upcoming_item_height|Висина сваке ставке медија, укључујући слику, у пикселима.
upcoming_corner_radius|Заобљеност углова слике и ставке.
upcoming_collapse_mode|Прикажи целу листу, задржи првих неколико ставки или дај предност подударним ставкама.
upcoming_sort_by|Атрибут за сортирање по броју, датуму или називу. Празно задржава редослед сензора.
upcoming_sort_ascending|Сортирај од најмањег или најранијег ка највећем или најкаснијем. Недостајуће вредности остају на крају.
upcoming_flag_filter|Прикажи све ставке, само означене или само неозначене.
upcoming_show_flag|Прикажи подешену ознаку на означеним ставкама медија.
upcoming_flag_icon|Икона за означену ставку.
upcoming_flag_label|Приступачан опис ознаке.
upcoming_flag_color|Боја ознаке.
upcoming_clock|Прикажи време медија према језику Home Assistant-а, у формату од 12 или 24 часа.
upcoming_title_color|Опциона боја наслова. Празно задржава подразумевани изглед слике који прати тему.
upcoming_line1_color|Опциона боја првог реда. Празно задржава подразумевани изглед слике који прати тему.
upcoming_line2_color|Опциона боја другог реда. Празно задржава подразумевани изглед слике који прати тему.
upcoming_line3_color|Опциона боја трећег реда. Празно задржава подразумевани изглед слике који прати тему.
upcoming_line4_color|Опциона боја четвртог реда. Празно задржава подразумевани изглед слике који прати тему.
upcoming_title_size|Величина фонта наслова медија у пикселима.
upcoming_line_size|Величина фонта детаља о медију у пикселима.
upcoming_box_shadows|Додај благу сенку испод ставки медија.
upcoming_text_shadows|Додај сенку иза текста преко слике пуне ширине.
upcoming_transparency|Постави градијент слике пуне ширине на провидност.
upcoming_tooltips|Прикажи сажетак медија при преласку миша или фокусу тастатуре.
upcoming_item_behavior|Изаберите аутоматске везе и трејлере, детаље сензора, прилагођену радњу или радњу без додира.
upcoming_links|Дозволи аутоматској радњи медија да отвори подржану дубоку везу.
remote_navigation|Изаберите додирну таблу, тастере за смер или оба начина управљања.
remote_volume|Изаберите клизач јачине звука, дугмад или оба. Искључивање звука остаје поред њих.
remote_volume_step|Проценат јачине звука који се додаје или одузима сваким притиском када је доступна апсолутна контрола.
remote_button_size|Ширина и висина дугмади даљинског управљача у пикселима.
remote_touchpad_height|Висина додирне табле у пикселима.
remote_accent_color|Наглашена боја додирне табле и контрола у фокусу.
remote_power_controls|Изаберите и поређајте контроле у реду за напајање.
remote_playback_controls|Изаберите и поређајте контроле репродукције.
upcoming_data_attribute|Изаберите атрибут сензора који садржи листу медијских објеката или њен JSON запис. Компатибилни сензори обично користе data; први објекат само за форматирање служи као подразумевана вредност и не приказује се као медиј.
upcoming_text_template|Текстуални токени као што су $title, $episode, $number, $rating, $runtime, $release, $day, $date, $time, $studio или атрибут ставке. Оставите празно за подразумевану вредност сензора; користите $empty да сакријете ред. JavaScript, HTML и Jinja се не извршавају.
upcoming_url|Опциони URL као што је https://www.themoviedb.org/tv/$tmdb_id. Вредности се кодирају за URL. Овај URL има предност над трејлерима и дубоким везама; дозвољени су само HTTP(S) и подржане везе медијских апликација.
upcoming_overflow|Распореди ставке по доступној висини екрана пре додавања прилагодљивих колона. Уске картице остају у једној колони. Подешавања склапања се занемарују док је ова опција укључена.
upcoming_filter_attribute|Изаберите или унесите атрибут ставке, а затим вредност и поређење. Обришите ово поље да бисте искључили филтрирање.
upcoming_group_value|Ставке са овом вредношћу приказују се прве; остале ставке могу да се прошире. На пример, flag = true даје предност непогледаним ставкама.
upcoming_date_format|Користите регионална подешавања Home Assistant-а или образац са dd, mm, yy или yyyy. Време користи подешену временску зону Home Assistant-а.
upcoming_hide_empty|Скрива само исправну празну или филтрирану листу. Недостајући сензори, неисправан JSON и недоступни подаци и даље приказују јасну грешку.
upcoming_trailers|YouTube трејлери се након додира приказују у приступачном дијалогу који може да се затвори. Други подржани URL-ови трејлера отварају се споља. Трејлери се не учитавају аутоматски.
remote_entity|Опциона замена. У супротном се бира даљински управљач са уређаја примарног телевизора. Команде се никада не шаљу даљинском управљачу из друге просторије.
remote_media_entity|Опциона замена за јачину звука, репродукцију и изворе. У супротном се користи примарни медијски плејер или плејер уређаја изабраног даљинског управљача.
remote_transport|Аутоматски режим првенствено користи remote.send_command. Samsung play_media / send_key користи се само за откривени Samsung телевизор; не претпоставља се да генерички плејери подржавају Samsung кодове.
remote_device|Опциона вредност уређаја која се шаље преко remote.send_command, на пример за IR даљинске управљаче. Ово је назив уређаја-команде, а не ID уређаја Home Assistant-а.
remote_preset|Повезује уобичајене контроле са командама за телевизор. Појединачне команде мењајте у одељку Features уместо да замените све кључеве.
remote_haptics|Користи хаптички догађај Home Assistant-а. Стварне вибрације зависе од апликације/уређаја; ово подешавање не мења послату команду.
remote_swipe_distance|Растојање у пикселима за сваку команду смера. Команде су ограничене да не би преоптеретиле телевизор. Додирна табла подржава и тастере стрелице, Enter, Space, Backspace и Home.
remote_double_tap|Када је укључен двоструки додир, појединачни додир кратко чека. Двоструки додир шаље само подешену команду, без додатне команде Select.
pihole_device_ids|Један или више Pi-hole уређаја. Ентитети се откривају из регистра уређаја и кључева превода, укључујући називе v5 и v6. Ако није задато, користи се уређај примарног ентитета.
pihole_metrics|Бројеви се сабирају по мапираним сензорима; CPU/меморија се усредњују, а температура приказује максимум. Проценат блокирања рачуна се као укупан број блокираних захтева / укупан број упита када су оба позната; у супротном се усредњују доступни процентуални сензори. Недостајуће и недоступне вредности никада се не замењују нулом.
pihole_pause_durations|Изаберите унапред задате вредности или додајте целе секунде, 30s, 5m, 1h30m или 1h:30m:15s. Неисправни уноси остају видљиво онемогућени. Пауза се временски прати на серверу и наставља да важи након затварања прегледача.
pihole_pause_service|Аутоматски режим проверава интеграцију изабраног прекидача и доступну услугу искључивања. Привремена пауза никада се не замењује трајним искључивањем прекидача или тајмером прегледача.
pihole_duration_field|За прилагођену радњу, изабрано трајање се убацује у податке радње под овим називом параметра. Остали подешени подаци радње се чувају.
pihole_chart_metrics|Користи постојећи Mini Graph приказ за историју процента CPU-а/меморије коју бележи Recorder. Нису потребни Pi-hole API акредитиви ни додатна зависност графика.
pihole_metric_tap_action|Подразумевано отвара први сензор који доприноси вредности. Прилагођена радња добија ентитет изабране статистике као контекст.
room_light_entity|Једно светло за ознаку осветљености и опциону наглашену боју просторије. Подразумевано се користи главни ентитет ако је светло. Приказује се само исправна осветљеност; подржани су активни RGB чланови групе.
room_temperature_entity|Опциони сензор или климатски ентитет за ознаку температуре. Подразумевано се користи главни ентитет. Приказују се само бројчане температуре са јединицом температуре.
room_brightness_entity|Опционо светло за ознаку осветљености. Подразумевано се користи главно светло, а затим наглашено светло просторије. Као проценат се приказује само исправан атрибут осветљености.
label_use_temperature|Аутоматске/статусне додатне информације просторије: укључи исправну температуру. Режими без вредности, прилагођени, састављени и изричити режими назива/времена имају предност.
label_use_brightness|Аутоматске/статусне додатне информације просторије: уз температуру укључи исправан проценат осветљености. Режими без вредности, прилагођени, састављени и изричити режими назива/времена имају предност.
carousel_show_header|Прикажи назив, икону и главне/додатне информације изнад вртешке. Искључите да бисте приказали само вртешку.
buy_sell_title|Наслов изнад графика цена.
buy_sell_show_result|Прикажи процењени трошак куповине, приход од продаје и коначан резултат испод графика.
buy_sell_trade_energy|Енергија за продају. Потребна енергија за куповину обухвата губитке циклуса.
buy_sell_trade_energy_entity|Опциони бројчани kWh ентитет који замењује фиксну количину енергије за трговину. Недоступне вредности приказују грешку уместо процене.
buy_sell_trade_power|Највећа снага пуњења и продаје која се користи за рачунање енергије по ценовном интервалу.
buy_sell_trade_efficiency|Проценат купљене енергије који може да се прода након губитака складиштења.
buy_sell_feed_in_fee|Накнада која се одузима за сваки продати kWh. Подесите на нулу ако је већ урачуната у достављене цене.
buy_sell_slot_minutes|Трајање сваког ценовног интервала, ограничено следећом временском ознаком да би се спречило преклапање. Последњи интервал користи ово трајање.
buy_sell_graph_span|Број сати приказаних на графику.
buy_sell_span_start|Изаберите да ли график почиње у поноћ или у тренутном тренутку.
buy_sell_update_interval|Повремено освежавај график и када се сензор не ажурира.
buy_sell_chart_height|Висина прилагодљивог графика цена.
buy_sell_show_now|Прикажи ознаку тренутног времена.
buy_sell_now_label|Текст поред ознаке тренутног времена.
buy_sell_now_color|Боја ознаке тренутног времена.
buy_sell_show_legend|Прикажи легенду низова испод графика.
buy_sell_show_grid|Прикажи водоравне линије мреже графика.
buy_sell_axis_label|Јединица или опис поред осе цене.
buy_sell_min_value|Опциона доња граница осе цене графика.
buy_sell_max_value|Опциона горња граница осе цене графика.
buy_sell_price_decimals|Број децимала приказаних за тренутну цену.
buy_sell_axis_decimals|Број децимала ознака на оси цене.
buy_sell_bar_radius|Полупречник заобљења углова стубића графика.
buy_sell_price_label|Ознака у легенди за низ цена.
buy_sell_charge_label|Ознака у легенди за планирано пуњење из мреже.
buy_sell_planned_sell_label|Ознака у легенди за планирану продају енергије.
buy_sell_possible_sell_label|Ознака у легенди за могућу продају енергије.
buy_sell_price_color|Боја стубића цена.
buy_sell_charge_color|Боја стубића планираног пуњења из мреже.
buy_sell_planned_sell_color|Боја стубића планиране продаје.
buy_sell_possible_sell_color|Боја стубића могуће продаје.
panel_health_title|Наслов изнад сажетка панела и мерача.
panel_entities|Изаберите сензоре излазне снаге инверторских панела.
panel_gauge_max|Број вати који одговара потпуно попуњеном мерачу.
panel_warning_average_min|Упозорење о слабом панелу проверава се само када просек пређе ову вредност.
panel_low_output_percent|Упозори када најслабији панел даје мање од овог дела просека.
panel_segment_1|Излазни праг на коме почиње друга боја мерача.
panel_segment_2|Излазни праг на коме почиње трећа боја мерача.
panel_segment_3|Излазни праг на коме почиње четврта боја мерача.
panel_segment_4|Излазни праг на коме почиње пета боја мерача.
panel_color_0|Боја мерача испод првог излазног прага.
panel_color_1|Боја мерача од првог излазног прага.
panel_color_2|Боја мерача од другог излазног прага.
panel_color_3|Боја мерача од трећег излазног прага.
panel_color_4|Боја мерача од четвртог излазног прага.
panel_color_5|Боја мерача у највишем опсегу излазне снаге.
panel_show_summary|Прикажи обједињену статистику панела.
panel_show_gauges|Прикажи мераче излазне снаге појединачних панела.
name_mode|Изаберите да ли картица користи назив ентитета, прилагођени назив или не приказује назив.
name|Користи се када је изабрана опција „Користи прилагођени назив“.
secondary|Опциони пратећи текст испод главног назива или стања.
icon|Опциона замена иконе. Обришите да бисте користили икону ентитета из Home Assistant-а, укључујући класу уређаја и стање. Икона картице користи се само када ентитет није доступан.
variant|Изаберите распоред или понашање изворне компоненте које ова обједињена компонента представља.
icon_type|Изаберите икону, слику ентитета ако је доступна или опцију без иконе.
layout|Изаберите водоравни или усправни распоред садржаја картице.
multiline_secondary|Картица може бити виша да стане текст и неће увек бити поравната са системом мреже.
fill_container|Развлачи картицу да попуни доступно поље мреже контролне табле.
card_shadow|Додаје меку сенку око ивице картице. Подразумевано искључено.
primary_info|Изаберите главни текст картице.
secondary_info|Изаберите пратећи текст испод главних информација.
tap_action|Шта се дешава при додиру картице.
hold_action|Шта се дешава када се картица додирне и задржи.
crossfade_entity|Аутоматски се бира са Sonos уређаја повезаног са главним медијским плејером.
night_sound_entity|Аутоматски се бира са Sonos уређаја повезаног са главним медијским плејером.
speech_enhancement_entity|Аутоматски се бира са Sonos уређаја повезаног са главним медијским плејером.
subwoofer_entity|Аутоматски се бира са Sonos уређаја повезаног са главним медијским плејером.
surrounds_entity|Аутоматски се бира са Sonos уређаја повезаног са главним медијским плејером.
loudness_entity|Аутоматски се бира са Sonos уређаја повезаног са главним медијским плејером.
surround_full_entity|Аутоматски се бира са Sonos уређаја повезаног са главним медијским плејером.
audio_delay_entity|Аутоматски се бира са Sonos уређаја повезаног са главним медијским плејером.
balance_entity|Аутоматски се бира са Sonos уређаја повезаног са главним медијским плејером.
bass_entity|Аутоматски се бира са Sonos уређаја повезаног са главним медијским плејером.
treble_entity|Аутоматски се бира са Sonos уређаја повезаног са главним медијским плејером.
sub_gain_entity|Аутоматски се бира са Sonos уређаја повезаног са главним медијским плејером.
surround_level_entity|Аутоматски се бира са Sonos уређаја повезаног са главним медијским плејером.
music_surround_level_entity|Аутоматски се бира са Sonos уређаја повезаног са главним медијским плејером.
level_entity|Нумерички сензор нивоа полена који користи скалу извора од 0 до 6.
clock_switch_entity|Опциони улазни логички ентитет који се укључује додиром картице сата.
double_tap_action|Шта се дешава када двапут додирнете картицу.
hours_to_show|Број сати недавне историје Recorder-а приказаних на графику.
points_per_hour|Одређује детаљност графика циљним бројем обједињених тачака по сату.
aggregate_func|Функција која обједињује вредности Recorder-а у сваком временском периоду.
group_by|Користите динамичке интервале, календарске датуме или сате као групе за обједињавање.
update_interval|Опциони интервал провере у секундама. Оставите празно да се освежи при промени поставки картице или података ентитета.
cache|Чува историју Recorder-а локално ради бржег поновног учитавања контролне табле.
height|Висина SVG графика у пикселима. Подесите на нулу да сакријете његову вертикалну површину.
line_width|Дебљина потеза линијских графика и тачака.
bar_spacing|Размак у пикселима између суседних стубића.
smoothing|Црта закривљене уместо правих линија.
animate|Приказује низове графика када се учита нова историја.
logarithmic|Користи логаритамски положај Y осе за вредности које се разликују за више редова величине.
value_factor|Множи вредности са десет на овај степен; на пример, -3 претвара вате у киловате.
decimals|Број децималних места за стања, ознаке, легенде и статистику.
hour24|Приказује описе графика у 24-часовном формату.
font_size|Величина текста стања као проценат уобичајене величине стања у Mini Graph-у.
font_size_header|Величина фонта заглавља у пикселима.
align_header|Положај назива и иконе заглавља.
align_icon|Поставља икону лево, десно или поред тренутног стања.
align_state|Поравнава тренутно и секундарно стање.
unit|Замењује јединицу Home Assistant-а за све низове, осим ако низ има своју јединицу.
icon_image|Опциони URL слике уместо изабране Material Design иконе.
lower_bound|Чврста бројчана доња граница или приближна граница са префиксом ~, на пример ~20.
upper_bound|Чврста бројчана горња граница или приближна граница са префиксом ~, на пример ~25.
min_bound_range|Осигурава да се главна Y оса простире барем кроз овај бројчани опсег.
lower_bound_secondary|Чврста или приближна (~) доња граница ентитета на секундарној оси.
upper_bound_secondary|Чврста или приближна (~) горња граница ентитета на секундарној оси.
min_bound_range_secondary|Осигурава да се секундарна Y оса простире барем кроз овај бројчани опсег.
color_thresholds_transition|Постепено прелази између боја прагова или их мења на оштрим границама.
group|Уклања сенку и заобљену позадину када се картица угради у другу.
mini_graph_show_state|Приказује тренутно стање, последњу вредност графика или не приказује стање.
mini_graph_show_fill|Попуњава област испод линијског графика пуном или избледелом бојом.
mini_graph_show_points|Приказује све тачке, тачке при преласку миша или ниједну.
mini_graph_show_labels|Ознаке главне осе су увек видљиве, приказују се при преласку миша или се не приказују.
mini_graph_show_labels_secondary|Ознаке секундарне осе су увек видљиве, приказују се при преласку миша или се не приказују.
mini_graph_show_legend|Приказује поређану легенду када је видљиво више низова.
mini_graph_show_top_labels|Приказује вредност сваког низа великим обојеним бројем са називом изнад графика.
mini_graph_show_average|Приказује просек главног низа испод графика.
mini_graph_show_extrema|Приказује минимум и максимум главног низа испод графика.
mini_graph_name_adaptive_color|Боји назив картице према праговима главног низа.
mini_graph_icon_adaptive_color|Боји икону заглавља према праговима главног низа.
mini_graph_loading_indicator|Приказује показатељ учитавања док се учитава историја Recorder-а.
weather_entity|Временски ентитет за изглед добродошлице или датума специфичан за извор.
settings_path|Путања контролне табле коју отвара дугме за подешавања добродошлице.
collapse_entity|Улазни логички ентитет који сакрива или приказује капсуле сцена добродошлице.
collapsed|Приморава капсуле сцена добродошлице да остану скривене.
show_controls|Приказује контроле које је дефинисао закачени дизајн извора.
show_forecast|Учитава дневну прогнозу времена коју користи детаљни дизајн извора.
show_name|Приказује подешени назив ентитета.
show_state|Приказује подешено стање ентитета.
temperature_entity|Опциони сензор за температуру која потиче из засебног ентитета.
humidity_entity|Опциони сензор за влажност која потиче из засебног ентитета.
window_sensor|Опциони контактни сензор који приказује да ли су прозор или врата отворени.
trees_entity|Сензор са стањем озбиљности полена дрвећа.
grass_entity|Сензор са стањем озбиљности полена трава.
weeds_entity|Сензор са стањем озбиљности полена корова.
battery_entity|Опциони сензор за приказ засебног нивоа батерије.
consumption_entity|Опциони сензор снаге који се додаје стању утичнице док је укључена.
input_select_entity|Опциони input select који двоструки додир картице просторије мења.
input_select_option|Опција изабрана на подешеном помоћном ентитету просторије.
download_entity|Сензор брзине преузимања који картица приказује и освежава пробном радњом.
upload_entity|Сензор брзине слања који картица приказује и освежава пробном радњом.
ping_entity|Ping сензор који се освежава заједно са преузимањем и слањем.
wifi_tracker_entity|Пратилац уређаја за Wi-Fi преглед изворног искачућег прозора.
gps_tracker_entity|Пратилац уређаја за GPS преглед изворног искачућег прозора и мапу.
findmy_script_entity|Скрипта коју покреће контрола за проналажење телефона у изворном искачућем прозору.
ulm_card_input_datetime_name|Опциони назив компатибилан са извором у заглављу датума и времена.
ulm_card_input_number_name|Опциони назив компатибилан са извором у заглављу бројчаног уноса.
disk_entity|Сензор са искоришћењем диска или волумена.
memory_entity|Сензор са процентом искоришћења меморије.
cpu_entity|Сензор укупне процентуалне искоришћености CPU-а.
disk_name|Описна ознака за поље диска.
disk_icon|Икона у плочици диска.
disk_color|Наглашена боја плочице диска.
temperature_name|Описна ознака за поље температуре.
temperature_icon|Икона поред температуре.
temperature_color|Наглашена боја и боја спољног прстена за температуру.
temperature_max|Највећа вредност која испуњава спољни прстен.
memory_name|Описна ознака за поље меморије.
memory_icon|Икона поред искоришћења меморије.
memory_color|Наглашена боја и боја средњег прстена за меморију.
memory_max|Највећа вредност која испуњава средњи прстен.
cpu_name|Описна ознака за поље CPU-а.
cpu_icon|Икона поред искоришћења CPU-а.
cpu_color|Наглашена боја и боја унутрашњег прстена за CPU.
cpu_max|Највећа вредност која испуњава унутрашњи прстен.
graph_span|Опсег историје компатибилан са извором, попут 1d; задржава се ради компатибилности са YAML-ом.
ulm_custom_card_nas_text|Текст који се приказује испред стања NAS сензора.
ulm_custom_card_nas_sensor|Застарело поље извора за NAS сензор; пренето је у главни ентитет.
ulm_custom_card_nas_unit|Текст који се додаје непосредно после стања NAS сензора.
ulm_custom_cad_nas_unit|Застарели назив поља за текст после стања NAS сензора.
ulm_card_update_enable_controls|Приказује дугмад за инсталирање и прескакање извора.
ulm_card_update_collapsible|Скрива контроле ажурирања када ентитет не пријављује доступно ажурирање.
ulm_card_update_horizontal|Поставља статус и контроле једно поред другог.
ulm_card_update_narrow_buttons|Даје више простора статусу ажурирања у водоравном режиму.
ulm_card_update_icon|Опциона замена иконе статуса ажурирања.
ulm_language|Регионална поставка која се користи када сат преузима датум из прегледача.
ulm_custom_card_entity_1_name|Назив поред иконе врата.
ulm_custom_card_entity_1_lock|Застарело поље извора за браву којом управљају дугмад врата.
ulm_custom_card_entity_1_lock_battery|Застарело поље извора за значку батерије браве.
chart_type|NAS дизајн извора користи кружне мераче искоришћења.
graph_entity|Сензор чија се историја приказује на картици.
eta_entity|Опциони сензор са процењеним временом доласка.
address_entity|Опциони сензор са локацијом или адресом.
min_entity|Опциони сензор са доњом упоредном вредношћу.
max_entity|Опциони сензор са горњом упоредном вредношћу.
show_today|Приказује сажетак за данас када изабрани сензор садржи стварну вредност сакупљања.
hide_unknown_dates|Аутоматски скрива редове отпада без датума сакупљања или са празним, непознатим или недоступним датумом. Редови се враћају када датум постане доступан.
today_entity|Сензор са врстом отпада сакупљеном данас. Празне вредности и вредности без сакупљања се скривају.
show_tomorrow|Приказује сажетак за сутра када изабрани сензор садржи стварну вредност сакупљања.
tomorrow_entity|Сензор са врстом отпада која се сакупља сутра. Празне вредности и вредности без сакупљања се скривају.
datetime_entity|Помоћни ентитет датума и времена којим управља ова картица.
time_entity|Сензор времена или трајања рада за приказ специфичан за извор.
qubino_more_info_entity|Ентитет који отвара површина Qubino картице, у складу са изворним pilot-wire input select-ом.
series_2_entity|Опциони други сензор у легенди графика.
series_3_entity|Опциони трећи сензор у легенди графика.
ulm_card_alarm_time_step|Број минута који свако дугме времена аларма додаје или одузима.
ulm_card_alarm_time_collapse|Скрива контроле времена док је аларм искључен.
ulm_card_alarm_time_horizontal|Поставља детаље аларма и контроле времена једне поред других.
ulm_card_alarm_time_icon|Икона поред назива и стања аларма.
ulm_card_alarm_time_color|Наглашена боја док је аларм активан.
ulm_card_media_player_with_controls_name|Описни назив медијског плејера.
ulm_card_dynamic_color|Користи RGB боју подешеног светла за активну картицу просторије.
ulm_show_button|Приказује изворно дугме услуге осцилације поред клизача брзине.
ulm_button_icon|Икона на изворном дугмету услуге вентилатора.
ulm_button_service|Home Assistant domain.service коју позива изворно дугме вентилатора.
ulm_card_flower_entity|Ентитет биљке са статусом и вредностима атрибута картице биљке.
ulm_card_flower_name|Назив у сажетку биљке.
ulm_card_flower_species|Идентификатор врсте који се чува ради компатибилности са изворном конфигурацијом.
ulm_card_flower_show_bars|Изаберите траке мерења биљке за приказ.
moisture_entity|Сензор вредности влаге за изабрану траку биљке.
conductivity_entity|Сензор вредности проводљивости за изабрану траку биљке.
illuminance_entity|Сензор вредности осветљености за изабрану траку биљке.
dli_entity|Сензор дневне светлосне интегралне вредности за изабрану траку биљке.
console_platform|Аутоматски открива Xbox, PlayStation или Nintendo или омогућава избор платформе.
carousel_loop|Прелази са последње ставке на прву током превлачења.
carousel_show_labels|Приказује назив изабране ставке и тренутно стање ентитета испод вртешке.
carousel_visible_items|Непаран број видљивих ставки Coverflow-а, од 3 до 11.
carousel_initial_index|Положај ставке са индексом од нуле који се бира при учитавању картице.
carousel_button_width|Ширина сваког дугмета вртешке у пикселима (32-160). Аутоматски се уклапа у уже картице; дугмад заглавља и навигације се не мењају.
carousel_button_height|Висина сваког дугмета вртешке у пикселима (32-160). Вртешка се увећава да стане у дугмад.
carousel_icon_size|Величина икона ставки у пикселима (12-96). Слике ентитета се пропорционално увећавају; обе се уклапају у дугме. Икона заглавља картице се не мења.
carousel_effect|Изаберите Coverflow, Slide, Fade, Cube или Flip. Fade, Cube и Flip приказују једну средишњу ставку без обзира на број слајдова; геометрија Coverflow-а важи само за тај ефекат.
carousel_navigation|Крећите се кроз ставке помоћу дугмади претходно/следеће. На крају вртешке без понављања одговарајуће дугме је онемогућено.
carousel_pagination|Прикажи испод вртешке тачке на које може да се кликне, број изабране ставке или траку напретка.
carousel_pagination_type|Користи се када је укључена пагинација. Тачке директно прелазе на ставку.
carousel_scrollbar|Превуците или користите стрелице да изаберете ставку. Избор положаја не активира ентитет.
carousel_grab_cursor|При интеракцији са вртешком приказује курсоре за хватање и превлачење.
carousel_centered_slides|Држи изабрани слајд у средини; искључите да га поравнате са почетком.
carousel_slides_per_view|Изаберите аутоматско прилагођавање ширини картице или тачан број слајдова.
carousel_coverflow_rotate|Степени ротације Y осе за сваки корак од изабраног слајда.
carousel_coverflow_stretch|Размак у пикселима између суседних Coverflow слајдова.
carousel_coverflow_depth|Удаљеност на којој се суседни слајдови повлаче у тродимензионалну сцену.
carousel_coverflow_modifier|Множи ротацију, размак, дубину и јачину сенке Coverflow-а.
carousel_coverflow_slide_shadows|Додаје усмерене сенке слајдовима удаљеним од изабраног положаја.
scene_buttons_only|Сакрива назив картице, главне информације ентитета и пратећи садржај, тако да остају само дугмад сцена.
scenes_per_row|Максималан број дугмади сцена у једном реду. Додатне сцене настављају у следећем реду.
console_show_artwork|Користи слику изабране игре као позадину картице када је доступна.
console_show_controls|Приказује контролу напајања када је подешен компатибилан даљински управљач, медијски плејер или прекидач.
followers_entity|Аутоматски се открива са уређаја налога конзоле ако је доступан.
following_entity|Аутоматски се открива са уређаја налога конзоле ако је доступан.
friends_entity|Аутоматски се открива са уређаја налога конзоле ако је доступан.
primary_stat_entity|Статистика горе десно, на пример Xbox Gamerscore.
secondary_stat_entity|Опциона друга статистика горе десно, на пример ранг.
primary_stat_icon|Икона поред главне статистике горе десно.
secondary_stat_icon|Икона поред секундарне статистике горе десно.
now_playing_entity|Ентитет чије стање садржи игру која се тренутно игра.
gamerpic_entity|Ентитет слике или камере за профилну слику.
artwork_entity|Ентитет слике или камере за позадину игре.
console_power_entity|Даљински управљач, медијски плејер или прекидач који користи дугме за напајање картице.
ulm_custom_card_window_handle|Сензор чије се стање Closed, Tilted или Open комбинује са контактом.
ulm_custom_card_window_name|Опциони назив који замењује описни назив контактног ентитета.
ulm_custom_card_window_icon|Опциона икона која замењује икону контактног ентитета.
ulm_custom_card_window_color|Наглашена боја исправних отворених и нагнутих стања.
ulm_custom_card_window_force_background_color|Примењује наглашену боју стања на позадину када је прозор отворен или померен.
ulm_custom_card_window_battery_level|Опциони бројчани сензор процента батерије.
ulm_custom_card_window_battery_warning|Ниво батерије на коме се приказује значка упозорења.
ulm_custom_card_window_battery_warning_low|Ниво батерије на коме значка упозорења постаје критична.
ulm_show_last_changed|Приказује време последње промене контакта уместо комбиноване ознаке стања.
ulm_card_printer_name|Назив у сажетку интерактивног штампача.
cartridges|Уређени објекти кертриџа који садрже label, entity_id, type и CSS вредности боја.
ulm_card_dynamic_color|Користи RGB боју подешеног светла за активну картицу просторије.
ulm_card_welcome_collapse|Опциони input_boolean који укључује контрола склапања горе лево.
ulm_weather|Временски ентитет који отвара средишња контрола горње траке.
nav_1|Путања контролне табле коју отвара прва навигациона капсула.
icon_1|Икона прве навигационе капсуле.
name_1|Ознака прве навигационе капсуле.
color_1|Изворна боја прве навигационе капсуле.
nav_2|Путања контролне табле коју отвара друга навигациона капсула.
icon_2|Икона друге навигационе капсуле.
name_2|Ознака друге навигационе капсуле.
color_2|Изворна боја друге навигационе капсуле.
nav_3|Путања контролне табле коју отвара трећа навигациона капсула.
icon_3|Икона треће навигационе капсуле.
name_3|Ознака треће навигационе капсуле.
color_3|Изворна боја треће навигационе капсуле.
nav_4|Путања контролне табле коју отвара четврта навигациона капсула.
icon_4|Икона четврте навигационе капсуле.
name_4|Ознака четврте навигационе капсуле.
color_4|Изворна боја четврте навигационе капсуле.
nav_5|Путања контролне табле коју отвара пета навигациона капсула.
icon_5|Икона пете навигационе капсуле.
name_5|Ознака пете навигационе капсуле.
color_5|Изворна боја пете навигационе капсуле.
lock_entity|Опциони ентитет браве којим се управља заједно са сензором врата.
navigation_path|Путања контролне табле која се отвара додиром навигационе картице.
show_graph|Приказује недавну историју сензора када је доступна.
use_entity_picture|Користи слику ентитета уместо изабране иконе.
ulm_card_battery_battery_level_danger|Проценти батерије на овој или нижој вредности користе критичну боју.
ulm_card_battery_battery_level_warning|Проценти батерије на овој или нижој вредности користе боју упозорења.
ulm_card_battery_attribute|Опциони атрибут ентитета са процентом батерије уместо стања.
ulm_card_battery_battery_state_entity_id|Ентитет чије стање пуњења управља иконом пуњења и опционом анимацијом.
ulm_card_battery_charger_type_entity_id|Ентитет чије стање wireless, AC, USB или charging одређује икону пуњења.
ulm_card_battery_charging_animation|Приказује анимацију када се открије пуњење.
ulm_card_battery_color_battery_level_danger|Наглашена боја на или испод прага ниске батерије.
ulm_card_battery_color_battery_level_warning|Наглашена боја на или испод прага упозорења.
ulm_card_battery_color_battery_level_ok|Наглашена боја изнад подешених прагова упозорења.
ulm_card_battery_name|Опциони назив који је компатибилан са извором.
ulm_card_media_player_enable_art|Користи слику тренутног албума, програма или медија када је доступна.
sonos_details_always_visible|Приказује све Sonos прекидаче и клизаче без одељка „Више детаља“ који може да се склопи.
use_media_info|Замењује уобичајено заглавље назива/стања насловом и извођачем тренутног медија када су доступни. И даље поштује прилагођене називе/текст, скривена поља и изричите режиме стања/назива/времена.
show_volume_level|Застарела опција; проценат јачине звука сада се приказује поред изабраног клизача.
volume_controls|Изаберите искључивање звука, клизач јачине звука или дугмад. Неподржане контроле су скривене; обришите све да сакријете контроле јачине звука.
media_controls|Изаберите контроле репродукције. Приказују се само контроле које ентитет подржава; обришите све да сакријете контроле медија.
collapsible_controls|Сакрива контроле када је стање off, unknown или unavailable, осим подржане контроле напајања. Непознатим и недоступним ентитетима не може да се управља.
ulm_card_media_player_enable_controls|Додаје дугмад за претходну нумеру, репродукцију/паузу и следећу нумеру.
ulm_card_media_player_enable_volume_slider|Омогућава подешавање јачине звука плејера са картице.
ulm_card_media_player_enable_volume_buttons|Додаје контроле за искључивање звука, смањивање и повећавање јачине звука.
ulm_card_media_player_enable_volume_adjust|Корак јачине звука од 0.01 до 1 (0.05 = 5%). Оставите празно за изворни корак плејера. Прилагођени корак захтева подршку за подешавање јачине звука.
ulm_card_media_player_collapsible|Скрива контроле репродукције и јачине звука док је плејер неактиван.
ulm_card_media_player_idle_off|Третира стање idle као искључено када су контроле које се склапају укључене.
ulm_card_media_player_player_controls_entity|Медијски плејер који прима позиве услуга репродукције и јачине звука.
ulm_card_media_player_more_info|Приказује податке о извођачу и албуму испод тренутног наслова.
ulm_card_media_player_power_button|Приказује подржане хардверске контроле напајања. Увек укључени плејери као што је Sonos уместо тога користе Standby (stop playback) и Resume playback; ово не искључује звучник. Дугме остаје видљиво када су остале контроле склопљене.
ulm_card_media_player_force_background_color|Користи изабрану наглашену боју као позадину активне картице.
ulm_card_media_player_color|Наглашена боја за активне контроле медијског плејера.
ulm_card_generic_color|Наглашена боја док је генерички ентитет активан.
ulm_card_generic_force_background_color|Испуњава позадину генеричке картице њеном бојом док је активна.
ulm_card_generic_swap_color|Наглашена боја измењеног генеричког распореда.
ulm_card_generic_swap_force_background_color|Испуњава позадину измењене генеричке картице њеном бојом док је активна.
ulm_card_navigate_color|Наглашена боја иконе навигације.
ulm_card_binary_sensor_color|Наглашена боја док је бинарни сензор активан.
ulm_card_binary_sensor_force_background_color|Користи наглашену боју сензора као позадину картице док је активан.
ulm_card_binary_sensor_icon|Опциона замена иконе бинарног сензора компатибилна са извором.
ulm_card_binary_sensor_name|Опциона замена назива бинарног сензора компатибилна са извором.
ulm_card_binary_sensor_show_last_changed|Приказује колико је времена прошло од промене стања сензора.
ulm_card_binary_sensor_alert_color|Наглашена боја док је сензор упозорења активан.
ulm_card_binary_sensor_alert_force_background_color|Користи боју упозорења као позадину картице док је активна.
ulm_card_binary_sensor_alert_icon|Опциона замена иконе упозорења компатибилна са извором.
ulm_card_binary_sensor_alert_name|Опциона замена назива упозорења компатибилна са извором.
ulm_card_binary_sensor_alert_show_last_changed|Приказује колико је времена прошло од промене стања упозорења.
ulm_card_input_boolean_icon|Опциона замена иконе улазног логичког ентитета компатибилна са извором.
ulm_card_input_boolean_name|Опциона замена назива улазног логичког ентитета компатибилна са извором.
ulm_custom_card_washer_power|Сензор тренутне потрошње снаге машине за прање веша.
ulm_custom_card_washer_remote_control|Ентитет чије стање true или on открива даљинске контроле машине.
ulm_custom_card_washer_machine_state|Ентитет стања рада, паузе или заустављености машине за прање веша.
ulm_custom_card_washer_machine_stop_state|Тачна вредност стања машине која означава да је машина заустављена.
ulm_custom_card_washer_job_state|Ентитет активне подешене фазе програма.
ulm_custom_card_washer_job_progress|Процентуални ентитет у траци напретка машине за прање веша.
ulm_custom_card_washer_job_states|До 5 именованих фаза програма са Material Design иконама.
ulm_custom_card_washer_delayed_start|Улазни логички ентитет којим управља контрола одложеног почетка.
ulm_custom_card_washer_delayed_starttime|Улазни датум и време који подешавају контроле одложеног почетка.
ulm_custom_card_washer_label_idle|Текст када машина мирује или је искључена.
ulm_custom_card_washer_label_configuring|Текст док се подешава одложени почетак.
ulm_custom_card_washer_label_running|Текст док машина ради.
ulm_custom_card_washer_start_action|Радња Home Assistant-а коју покреће команда за почетак.
ulm_custom_card_washer_pause_action|Радња Home Assistant-а коју покреће команда за паузу.
ulm_custom_card_washer_stop_action|Радња Home Assistant-а коју покреће команда за заустављање.
machine_state_entity|Ентитет стања рада, паузе, мировања или заустављености машине за прање или сушење.
program_stage_entity|Ентитет активне фазе програма машине за прање или сушење.
washer_power_entity|Сензор тренутне потрошње снаге машине за прање или сушење.
program_select_entity|Ентитет избора за падајућу листу програма изнад дугмади.
datetime_step|Минути које додају или одузимају дугмад горе и доле.
show_people|Приказује ко је код куће (лево) а ко је одсутан (десно) изнад дугмади сцена.
people_entities|Људи за приказ. Нове картице почињу са свим укућанима; додајте или уклоните по потреби.
light_show_brightness|Приказује клизач осветљености када светло подржава пригушивање.
light_show_members|Додаје падајући мени са свим светлима изабране групе, свако са својим дугметом упали/угаси.
light_members_expanded|Аутоматски отвара мени уместо да остане скупљен.
light_members_per_row|Број дугмади светала по реду у менију.
light_show_scenes|Додаје падајући мени са каруселом сцена из подручја светла. Попуњава се аутоматски, а сцене можете додавати и уклањати.
use_light_color|Боји икону и клизаче тренутном бојом светла.
show_color_temp_control|Приказује клизач температуре боје када га светло подржава.
show_color_control|Приказује клизач боје када светло подржава боје.
full_collapse_controls|Сакрива све, укључујући сцене и светла у групи, када је светло искључено.
show_extra_pollen|Приказује додатне сензоре полена испод три главна типа. Додајте колико желите.
datetime_single_row|Поставља наслов, дугмад и време у један ред.
datetime_manual_entry|Претвара време у поље у које можете кликнути и куцати.
power_switch_entity|Прекидач који користи дугме за напајање поред дугмади за паузу и стоп.
grid_power_entity|Сензор снаге мреже са знаком. Позитивне и негативне вредности приказују се стрелицом смера.
grid_phase_1_entity|Опциони сензор снаге фазе мреже L1.
grid_phase_2_entity|Опциони сензор снаге фазе мреже L2.
grid_phase_3_entity|Опциони сензор снаге фазе мреже L3.
solar_power_entity|Сензор тренутне укупне соларне производње.
solar_forecast_entity|Сензор очекиване соларне енергије за данас.
battery_level_entity|Сензор процента за средишњи прстен батерије.
battery_power_entity|Сензор снаге пуњења или пражњења батерије са знаком.
battery_1_level_entity|Опциони сензор процента јединице батерије 1.
battery_1_power_entity|Опциони сензор снаге јединице батерије 1.
battery_2_level_entity|Опциони сензор процента јединице батерије 2.
battery_2_power_entity|Опциони сензор снаге јединице батерије 2.
battery_3_level_entity|Опциони сензор процента јединице батерије 3.
battery_3_power_entity|Опциони сензор снаге јединице батерије 3.
ev_charger_power_entity|Опциони сензор снаге EV пуњача или места за пуњење.
energy_mode_entity|Опциони сензор или select са тренутним режимом рада енергије.
energy_auto_control_entity|Логички ентитет који показује да ли је активна аутоматска HEMS контрола.
electricity_price_entity|Опциони сензор тренутне цене електричне енергије.
tariff_markup_entity|Додатак по kWh који се додаје сваком сировом тарифном интервалу пре ПДВ-а.
tariff_vat_entity|Проценат који се додаје након тарифног додатка.
grid_phase_scale_max|Апсолутна снага фазе која испуњава горњи леви лук.
solar_scale_max|Соларна снага која испуњава доњи леви лук.
battery_unit_scale_max|Апсолутна снага једне батерије која испуњава горњи десни лук.
home_scale_max|Потрошња домаћинства која испуњава доњи десни лук.
energy_grid_label|Текст када је снага мреже близу нуле.
energy_grid_import_label|Текст док се снага преузима из мреже.
energy_grid_export_label|Текст док се снага предаје у мрежу.
energy_solar_label|Наслов изнад тренутне соларне производње.
energy_battery_label|Наслов изнад појединачних јединица батерије.
energy_home_label|Наслов изнад тренутне потрошње домаћинства.
energy_forecast_label|Текст испред данашње прогнозе соларне енергије.
energy_ev_label|Текст испред вредности снаге EV пуњача.
energy_charge_label|Текст испод процента батерије током пуњења.
energy_discharge_label|Текст испод процента батерије током пражњења.
energy_idle_label|Текст испод процента батерије док мирује.
energy_auto_label|Наставак ознаке када је аутоматска HEMS контрола укључена.
energy_manual_label|Наставак ознаке када је аутоматска HEMS контрола искључена.
mode_solar_first_label|Назив режима рада Smart Matching.
mode_smart_saving_label|Назив режима рада Dynamic Smart Matching.
mode_smart_trading_label|Назив режима Dynamic Trading + Smart Matching.
price_low_threshold|Тарифне вредности са свим накнадама испод ове границе користе боју ниске цене.
price_medium_threshold|Тарифне вредности са свим накнадама испод ове границе користе боју средње цене.
price_high_threshold|Тарифне вредности са свим накнадама испод ове границе користе боју високе цене.
price_critical_threshold|Тарифне вредности са свим накнадама на или изнад ове границе користе боју критичне цене.
show_grid_phases|Прикажи лукове три фазе и вредности L1, L2 и L3.
show_battery_units|Прикажи лукове, проценте и вредности снаге три батерије.
show_tariff_timeline|Прикажи данашње обојене тарифне интервале и ознаку тренутног времена.
import_color|Боја преузимања из мреже и лукова пражњења батерија.
export_color|Боја предаје енергије у мрежу.
solar_color|Боја лука соларне производње.
battery_color|Боја средишњег прстена батерије и лукова батерија које се пуне.
home_color|Боја лука потрошње домаћинства.
price_negative_color|Боја негативних тарифних интервала са свим накнадама.
price_low_color|Боја тарифних интервала са ниском укупном ценом.
price_medium_color|Боја тарифних интервала са средњом укупном ценом.
price_high_color|Боја тарифних интервала са високом укупном ценом.
price_critical_color|Боја тарифних интервала са критичном укупном ценом.
power_entity|Ентитет за приказ снаге специфичан за извор.
door_entity|Ентитет статуса врата машине за прање веша.
finished_entity|Ентитет статуса завршетка програма машине за прање веша.
battery_state_entity|Ентитет за откривање да ли се батерија пуни.
battery_warning_threshold|Ниво батерије на или испод овог процента користи боју упозорења. Подразумевано: 50%.
battery_low_threshold|Ниво батерије на или испод овог процента користи боју ниске батерије. Подразумевано: 20%.
battery_critical_threshold|Ниво батерије на или испод овог процента користи критичну боју. Подразумевано: 10%.
battery_healthy_color|Боја изнад прага упозорења. Подразумевано: green.
battery_warning_color|Боја између прагова упозорења и ниског нивоа. Подразумевано: yellow.
battery_low_color|Боја између прагова ниског и критичног нивоа. Подразумевано: orange.
battery_critical_color|Боја на или испод критичног прага. Подразумевано: red.
charger_type_entity|Опциони ентитет са активном врстом пуњача.
secondary_entity|Опциони секундарни ентитет када су главни метаподаци медија непотпуни.
darkMode|Користи тамну палету описану у изворној Sun Card документацији.
language|Регионална поставка за изворне ознаке и форматирање времена.
showAzimuth|Приказује тренутни соларни азимут испод лука Сунца.
showElevation|Приказује тренутну висину Сунца испод лука.
showMoon|Приказује Месец на заједничком хоризонту, његову фазу и положај, излазак и залазак и предстојеће датуме пуног и младог Месеца.
moon_entity|Сензор фазе Месеца. Ако је празно, аутоматски открива интеграцију Moon у Home Assistant-у.
moon_altitude_entity|Сензор висине Месеца. Ако је празно, аутоматски открива ефемеридне ентитете Astronomy Space Suite-а.
moon_azimuth_entity|Сензор азимута Месеца. Аутоматски се открива када је доступан.
moon_rising_entity|Опциони сензор временске ознаке следећег изласка Месеца.
moon_setting_entity|Опциони сензор временске ознаке следећег заласка Месеца.
moon_right_ascension_entity|Сензор ректасцензије Месеца. Аутоматски се открива када је доступан.
moon_declination_entity|Сензор деклинације Месеца. Аутоматски се открива када је доступан.
moon_distance_entity|Сензор удаљености Месеца. Аутоматски се открива када је доступан.
moon_angular_diameter_entity|Сензор привидног угаоног пречника Месеца. Аутоматски се открива када је доступан.
moon_phase_angle_entity|Сензор фазног угла Месеца. Аутоматски се открива када је доступан.
moon_illumination_entity|Сензор процента осветљености Месеца. Аутоматски се открива када је доступан.
moon_next_full_moon_entity|Сензор датума следећег пуног Месеца. Аутоматски се открива када је доступан.
moon_next_new_moon_entity|Сензор датума следећег младог Месеца. Аутоматски се открива када је доступан.
moon_above_horizon_entity|Логички сензор који показује да ли је Месец изнад хоризонта. Висина се користи као резервна вредност.
timeFormat|Изаберите изворни формат времена од 12 или 24 часа.
title|Опциони наслов изнад картице специфичне за извор.
ulm_custom_card_speedtest_download_speed_entity|Застарели изворни кључ за сензор мерача преузимања.
ulm_custom_card_speedtest_download_speed_color|Боја кружног мерача преузимања.
ulm_custom_card_speedtest_download_speed_max|Вредност сензора која испуњава мерач преузимања.
ulm_custom_card_speedtest_upload_speed_entity|Застарели изворни кључ за сензор мерача слања.
ulm_custom_card_speedtest_upload_speed_color|Боја кружног мерача слања.
ulm_custom_card_speedtest_upload_speed_max|Вредност сензора која испуњава мерач слања.
ulm_custom_card_speedtest_ping_entity|Застарели изворни кључ за сензор Ping мерача.
ulm_custom_card_speedtest_ping_color|Боја кружног Ping мерача.
ulm_custom_card_speedtest_ping_max|Вредност сензора која испуњава Ping мерач.
ulm_custom_card_speedtest_round|Заокружује вредности преузимања и слања на целе бројеве, а изворни приказ Ping-а остаје непромењен.
ulm_custom_card_divider_title_name|Застарели изворни кључ за велики наслов раздвајача или наслеђени поднаслов.
ulm_custom_card_divider_title_nav|Опциона путања коју користе површина наслова и дугме за повратак.
ulm_custom_card_divider_subtitle_name|Застарели документовани кључ за мањи поднаслов раздвајача.
ulm_card_homeassistant_entity|Опциони ентитет статуса укупних ажурирања за старе конфигурације.
ulm_card_homeassistant_core|Update, sensor или binary sensor са инсталираном и најновијом верзијом Core-а.
ulm_card_homeassistant_supervisor|Update, sensor или binary sensor са инсталираном и најновијом верзијом Supervisor-а.
ulm_card_homeassistant_os|Update, sensor или binary sensor са инсталираном и најновијом верзијом Home Assistant OS-а.
tablet_button_usb_entity|Прекидач или помоћни ентитет зелене USB контроле.
tablet_button_motion_entity|Ентитет покрета или присуства који укључује зелена контрола покрета.
tablet_button_display_entity|Прекидач или помоћни ентитет који укључује зелена контрола екрана.
tablet_restart_entity|Ентитет дугмета које притиска плава контрола поновног покретања.
tablet_maintenance_entity|Прекидач или помоћни ентитет који укључује наранџаста контрола одржавања.
tablet_reload_entity|Ентитет дугмета које притиска плава контрола поновног учитавања.
tablet_ram_entity|Сензор приказан у средишњој RAM метрици.
tablet_disk_entity|Сензор приказан у средишњој метрици диска.
tablet_power_entity|Ентитет приказан у средишњој метрици напајања.
energy_entity|Опциони сензор укупне потрошње енергије утичнице.
black_entity|Сензор преосталог процента црног тонера.
yellow_entity|Сензор преосталог процента жутог тонера.
magenta_entity|Сензор преосталог процента магента тонера.
cyan_entity|Сензор преосталог процента цијан тонера.
custom_card_pollen_tree_name|Опциона ознака ставке полена дрвећа; оставите празно за описни назив ентитета или локализовану подразумевану вредност.
custom_card_pollen_tree_icon|Опциона икона ставке полена дрвећа; оставите празно за икону ентитета или подразумевану вредност извора.
custom_card_pollen_grass_name|Опциона ознака ставке полена трава; оставите празно за описни назив ентитета или локализовану подразумевану вредност.
custom_card_pollen_grass_icon|Опциона икона ставке полена трава; оставите празно за икону ентитета или подразумевану вредност извора.
custom_card_pollen_weed_name|Опциона ознака ставке полена корова; оставите празно за описни назив ентитета или локализовану подразумевану вредност.
custom_card_pollen_weed_icon|Опциона икона ставке полена корова; оставите празно за икону ентитета или подразумевану вредност извора.
`;

export const serbianHelpers: Record<string, string> = parseRows(helperRows);
