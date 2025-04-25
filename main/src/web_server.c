#include "web_server.h"
#include "shared.h"

#include "esp_http_server.h"
#include "esp_log.h"

#include "cJSON.h"
#include <stdio.h>  

static const char *TAG = "web";

/* To handle api requests */
static esp_err_t api_rain_handler(httpd_req_t *req){
    /* Build JSON object to send */
    cJSON *root = cJSON_CreateObject(); 
    cJSON_AddNumberToObject(root, "rain", latest_rain); /* Adds rain as a key and latest_rain as value */
    char *json = cJSON_PrintUnformatted(root); /* Converts JSON object to string to send over network */
    cJSON_Delete(root); /* Free object (we don't need it anymore since we have the string now) */
    
    /* Add CORS Header so that any domain can access data */
    httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");

    /* Send JSON Response */
    httpd_resp_set_type(req, "application/json"); /* Response will be JSON not HTML */
    esp_err_t ret = httpd_resp_send(req, json, HTTPD_RESP_USE_STRLEN); /* HTTPD_RESP_USE_STRLEN does strlen(json) */

    free(json); 
    return ret;

}

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

    httpd_uri_t api_uri = {
        .uri      = "/api/rain",
        .method   = HTTP_GET,
        .handler  = api_rain_handler,
        .user_ctx = NULL
    };
    httpd_register_uri_handler(server, &api_uri);

    ESP_LOGI(TAG, "Web server started on http://<ESP32-IP>/");
}