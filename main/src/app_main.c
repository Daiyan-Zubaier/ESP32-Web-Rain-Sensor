#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#include "shared.h"          // rain_q and latest_rain
#include "wifi_manager.h"    // wifi_init_sta()
#include "sensor_task.h"     // sensor_task()
#include "web_server.h"      // start_web_server()



void app_main(void)
{
    /* Connect to Wi-Fi (blocks until IP acquired) */
    wifi_init_sta(WIFI_SSID, WIFI_PASSWORD);

    /* Create a queue for rain-percentage readings */
    rain_q = xQueueCreate(10, sizeof(float));
    if (rain_q == NULL) {
        printf("Queue creation failed—out of RAM?\n");
        return;
    }

    /* Launch the FreeRTOS task that samples the ADC */
    xTaskCreate(sensor_task,      /* function          */
                "sensor_task",    /* task name         */
                2048,             /* stack size bytes  */
                NULL,             /* parameter         */
                2,                /* priority          */
                NULL);            /* handle (unused)   */

    /* Start the HTTP server that shows live data */
    start_web_server();

    /* Idle this main thread forever */
    for (;;)
        vTaskDelay(portMAX_DELAY);
}