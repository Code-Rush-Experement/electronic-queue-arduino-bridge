#include <Servo.h>

int p1 = 8;
int p2 = 9;
int p3 = 10;
int p4 = 11;

int pServo = 5;
bool wasOn = false;

Servo servo;

void setup() {
  pinMode(p1, OUTPUT);
  pinMode(p2, OUTPUT);
  pinMode(p3, OUTPUT);
  pinMode(p4, OUTPUT);

  servo.attach(pServo);
  digitalWrite(pServo, 0); 

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

        if (led > 0) {
          servo.write(100);
          wasOn = true;
        } else {
          servo.write(0);
          wasOn = false;
        }
    }

    delay(100);
}

