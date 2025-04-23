#ifndef SHARED_H
#define SHARED_H

#include "freertos/FreeRTOS.h"
#include "freertos/queue.h"

/*  Shared queue: holds one float (rain %) per message                */
extern QueueHandle_t rain_q;

/*  Latest value, updated by sensor_task, read by web_server           */
extern volatile float latest_rain;

#endif /* SHARED_H */