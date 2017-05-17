
int p1 = 8;
int p2 = 9;
int p3 = 10;
int p4 = 11;

void setup() {
  pinMode(p1, OUTPUT);
  pinMode(p2, OUTPUT);
  pinMode(p3, OUTPUT);
  pinMode(p4, OUTPUT);

  Serial.begin(9600);
  Serial.setTimeout(50);
}

void loop() {

    if(Serial.available() > 0) {
        int led = Serial.parseInt();

        digitalWrite(p1, LOW);
        digitalWrite(p2, LOW);        
        digitalWrite(p3, LOW);        
        digitalWrite(p4, LOW);
        
        if (led > 0) {
          digitalWrite(p1, HIGH);
        }
        if (led > 1) {
          digitalWrite(p2, HIGH);
        }
        if (led > 2) {
          digitalWrite(p3, HIGH);
        }
        if (led > 3) {
          digitalWrite(p4, HIGH);
        }

        Serial.println(led);
    }
}

