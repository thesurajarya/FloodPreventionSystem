#include <WiFi.h>
#include <PubSubClient.h>

// --- NETWORK CREDENTIALS ---
const char* ssid = "YOUR_WIFI_SSID";           // Replace with your Wi-Fi name
const char* password = "YOUR_WIFI_PASSWORD";   // Replace with your Wi-Fi password
const char* mqtt_server = "192.168.1.X";       // Replace with your Laptop's IPv4 Address

WiFiClient espClient;
PubSubClient client(espClient);

// --- SENSOR PIN DEFINITIONS ---
// HC-SR04 Ultrasonic Sensor (Water Level)
const int trigPin = 5;
const int echoPin = 18;

// Analog Soil Moisture Sensor
const int soilPin = 32; 

// Variables for timing
unsigned long lastMsg = 0;
const long interval = 3000; // Send data every 3 seconds to match your React demo

void setup() {
  Serial.begin(115200);
  
  // Initialize Sensor Pins
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(soilPin, INPUT);

  setup_wifi();
  
  client.setServer(mqtt_server, 1883);
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  // Loop until we're reconnected to the broker
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP32Client-HydroGuard";
    
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected to Node.js Broker!");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

// Function to read the Ultrasonic sensor
float getWaterLevel() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  long duration = pulseIn(echoPin, HIGH);
  // Calculate distance in cm. 
  // (Speed of sound is 343m/s -> 0.0343 cm/uS)
  float distance = duration * 0.0343 / 2; 
  
  // For a hackathon demo container, you might invert this.
  // E.g., if container is 100cm deep: waterLevel = 100 - distance;
  return distance; 
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastMsg > interval) {
    lastMsg = now;

    // 1. Read Sensors
    float waterLevel = getWaterLevel();
    int soilMoistureRaw = analogRead(soilPin); // Ranges 0-4095 on ESP32
    
    // Convert raw analog to a mock "Rainfall Intensity" or "Saturation" percentage
    // Note: Most soil sensors output higher values when DRY. Adjust mapping as needed.
    int saturationPercent = map(soilMoistureRaw, 4095, 0, 0, 100); 

    // 2. Format as JSON Payload without needing an external library
    String payload = "{";
    payload += "\"waterLevel\":" + String(waterLevel) + ",";
    payload += "\"rainIntensity\":" + String(saturationPercent);
    payload += "}";

    // 3. Publish to the broker
    Serial.print("Publishing message: ");
    Serial.println(payload);
    
    client.publish("hydroguard/sensor1", payload.c_str());
  }
}