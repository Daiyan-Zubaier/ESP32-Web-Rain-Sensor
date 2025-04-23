#include "shared.h"

/*  Objects are defined once here; all other files just include shared.h  */
QueueHandle_t rain_q       = NULL;
volatile float latest_rain = 0.0f;