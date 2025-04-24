#include "web_server.h"
#include "shared.h"

#include "esp_http_server.h"
#include "esp_log.h"

static const char *TAG = "web";

static esp_err_t root_get_handler(httpd_req_t *req) {
    char html[256];
    snprintf(html, sizeof(html),
        "<!DOCTYPE html><html><head>"
        "<meta http-equiv='refresh' content='5'>"
        "<title>Rain Monitor</title></head><body>"
        "<h1>Rain Sensor</h1>"
        "<p>Current moisture: <strong>%.1f&nbsp;%%</strong></p>"
        "</body></html>", latest_rain);

    httpd_resp_send(req, html, HTTPD_RESP_USE_STRLEN);
    return ESP_OK;
}

void start_web_server(void) {
    httpd_config_t cfg = HTTPD_DEFAULT_CONFIG();
    httpd_handle_t server = NULL;
    ESP_ERROR_CHECK(httpd_start(&server, &cfg));

    httpd_uri_t root_uri = {
        .uri      = "/",
        .method   = HTTP_GET,
        .handler  = root_get_handler,
        .user_ctx = NULL
    };
    httpd_register_uri_handler(server, &root_uri);

    ESP_LOGI(TAG, "Web server started on http://<ESP32-IP>/");
}