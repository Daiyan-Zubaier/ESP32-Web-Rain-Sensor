#include "sensor_task.h"
#include "driver/adc.h"
#include "esp_adc_cal.h"
#include "shared.h"
#include "esp_log.h"
#include <stdio.h>
#include <stdlib.h>
#include <esp_adc_cal_types_legacy.h>

#define TAG "sensor"
#define SENSOR_ADC_CHANNEL ADC_CHANNEL_6    /* GPIO 34 */
#define SAMPLE_PERIOD_MS 5000 

static void adc_setup(void){
    adc1_config_width(ADC_WIDTH_BIT_12);    /* 12 bit Resolution (0-4095) */
    adc1_config_channel_atten(SENSOR_ADC_CHANNEL, ADC_ATTEN_DB_11);     /* 11 dB attenuation (Up to ~3.3V) */

}

void sensor_task(void *pv){
    esp_adc_cal_characteristics_t *adc_chars = calloc(1, sizeof(esp_adc_cal_characteristics_t));
    esp_adc_cal_value_t val_type = esp_adc_cal_characterize(ADC_UNIT_1, ADC_ATTEN_DB_11, ADC_WIDTH_BIT_12, 1100, adc_chars); /* callibration */
    printf(val_type);
    
    while(1){
        /* Reading raw adc values then converting it to milivolts */
        uint32_t raw = adc1_get_raw(SENSOR_ADC_CHANNEL);
        uint32_t mv = esp_adc_cal_raw_to_voltage(raw, adc_chars);

        /* Establish rain as percentage */
        float sensor_percent = 100.0f * ((float)mv / 3300.0f);

        /* Updating Global variables */
        latest_rain = sensor_percent; 
        xQueueSendToBack(rain_q, &sensor_percent, 0);

        ESP_LOGI(TAG, "Rain = %.1f %%", sensor_percent);
        vTaskDelay(SAMPLE_PERIOD_MS / portTICK_PERIOD_MS);
    }
}