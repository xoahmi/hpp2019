/*Set buffer to current thing 0 means the switch is off 1 means the switch is on */

int SIZE = 12;
int * compare;
char * buffer;
void setup() {
  
  pinMode(LED_BUILTIN, OUTPUT);
  
  for (int i = 2; i < 13; i++) {
     pinMode(i, INPUT);
  }

  for (int i = 22; i < 28; i++) {
     pinMode(i, INPUT);
  }

  buffer = (char *) malloc(SIZE * sizeof(char));

  for (int i = 0; i < SIZE; i++) {
    buffer[i] = '0';
  }
  
  Serial.begin(9600);
}

void loop() {

  int index = 0;

  set(index++, 2);
  set(index++, 3);
  set(index++, 4);
  set(index++, 5);
  set(index++, 6);
  set(index++, 8);
  set(index++, 9);
  set(index++, 22);
  set(index++, 23);
  set(index++, 24);
  set(index++, 25);
  set(index++, 26);

  delay(200);

  print();
}

void print() {
  for (int i = 0; i < SIZE; i++) {
    Serial.print(buffer[i]); 
  }
  Serial.print('\n');
}

bool pressed() {
  for (int i = 0; i < SIZE; i++) {
     if (buffer[i] - '0' == 1) {
          return true;
     }
  }
  return false;
}

void set(int index, int pin) {
  if (digitalRead(pin) == HIGH) {
      buffer[index] = '0';
    } else {
      buffer[index] = '1';
    }
}






  
