/*Set buffer to current thing 0 means the switch is off 1 means the switch is on */

int SIZE = 2;
int * compare;
char * buffer;
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  
  for (int i = 0; i < SIZE; i++) {
     pinMode(i, INPUT);
  }

 // compare = (int *) malloc(SIZE * sizeof(int));
 buffer = (char *) malloc(SIZE * sizeof(char));

  for (int i = 0; i < SIZE; i++) {
    buffer[i] = '0';
  }

  Serial.begin(9600);
  
}

void loop() {
  
  for (int i = 0; i < SIZE; i++) {
    if (digitalRead(i + 2) == HIGH) {
      buffer[i] = '0';
    } else {
      buffer[i] = '1';
    }
  }

  delay(500);

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






  
