#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#define WIFI_SSID "Wifi SSID"
#define WIFI_PASSWORD "Wifi Password"

/* Initialise STA mode and block until connected (or reboot on failure) */
void wifi_init_sta(const char *ssid, const char *pass);

#endif /* WIFI_MANAGER_H */