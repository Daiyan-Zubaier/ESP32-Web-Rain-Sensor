#include <string.h>          // strncpy / strlcpy
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_log.h"
#include "esp_netif.h"       // NEW: replaces tcpip_adapter.h
#include "nvs_flash.h"
#include "freertos/FreeRTOS.h"
#include "freertos/event_groups.h"

#define WIFI_CONNECTED_BIT BIT0
static EventGroupHandle_t wifi_events;
static const char *TAG = "wifi_mgr";

/* ---------- event handler ---------- */
static void wifi_event_handler(void *arg,
                               esp_event_base_t base,
                               int32_t id,
                               void *data)
{
    if (base == WIFI_EVENT && id == WIFI_EVENT_STA_START) {
        esp_wifi_connect();                          // ADD () here
    } else if (base == WIFI_EVENT &&
               id   == WIFI_EVENT_STA_DISCONNECTED) {
        esp_wifi_connect();                          // retry
    } else if (base == IP_EVENT &&
               id   == IP_EVENT_STA_GOT_IP) {
        xEventGroupSetBits(wifi_events, WIFI_CONNECTED_BIT);
    }
}

/* ---------- public API ---------- */
void wifi_init_sta(const char *ssid, const char *pass)
{
    /* NVS is required by Wi-Fi driver */
    ESP_ERROR_CHECK(nvs_flash_init());

    /* NEW network stack */
    ESP_ERROR_CHECK(esp_netif_init());

    /* Default event loop */
    ESP_ERROR_CHECK(esp_event_loop_create_default());

    /* Create default station (interfaces WiFi <--> TCP/IP) */
    esp_netif_create_default_wifi_sta();

    /* Wi-Fi driver config & init */
    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_wifi_init(&cfg));

    /* Register event callbacks */
    ESP_ERROR_CHECK(esp_event_handler_register(
            WIFI_EVENT, ESP_EVENT_ANY_ID, wifi_event_handler, NULL));
    ESP_ERROR_CHECK(esp_event_handler_register(
            IP_EVENT, IP_EVENT_STA_GOT_IP, wifi_event_handler, NULL));

    /* Build connection parameters */
    wifi_config_t wifi_cfg = { 0 };
    strlcpy((char *)wifi_cfg.sta.ssid,     ssid,
            sizeof(wifi_cfg.sta.ssid));          // safer than strncpy
    strlcpy((char *)wifi_cfg.sta.password, pass,
            sizeof(wifi_cfg.sta.password));
    wifi_cfg.sta.threshold.authmode = WIFI_AUTH_WPA2_PSK;

    /* Apply config and start */
    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));
    ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_STA, &wifi_cfg));
    ESP_ERROR_CHECK(esp_wifi_start());

    /* Wait here until we’re connected */
    wifi_events = xEventGroupCreate();
    ESP_LOGI(TAG, "Waiting for Wi-Fi…");
    xEventGroupWaitBits(wifi_events, WIFI_CONNECTED_BIT,
                        pdFALSE, pdTRUE, portMAX_DELAY);
    ESP_LOGI(TAG, "Wi-Fi connected ✓");
}