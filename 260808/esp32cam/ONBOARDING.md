# ESP32-CAM 프로젝트 온보딩 문서

## 1. 프로젝트 개요

ESP32-CAM 보드로 진행하는 개인 학습/실험 프로젝트 모음입니다. 카메라 캡처, 시리얼 통신, PWM LED 제어 같은 기초 실험에서 출발해, 최종적으로는 **카메라로 촬영한 손 모양(가위/바위/보)을 온디바이스 머신러닝(TensorFlow Lite)으로 실시간 인식하는 프로젝트**로 발전했습니다. Arduino(C++) 스케치와 Python 보조 스크립트가 하나의 파이프라인으로 엮여 있습니다.

## 2. 디렉토리 구조와 각 폴더의 역할

```
esp32cam/
├── reset/                  # 시리얼 연결·리셋 트러블슈팅 노트
├── focus/                  # 렌즈 초점 조절 방법
├── hwmods/                 # 하드웨어 개조 기록 (저전력 LED, 어댑터 보드)
├── pwm/                    # ESP32 PWM 채널로 LED 밝기 제어하는 실험 스케치
├── esp32cam-ascii/          # (실험 1) 이미지를 캡처해 ASCII 아트로 시리얼 출력
├── esp32cam-cmd/            # (실험 2) 이미지를 hex로 시리얼 덤프 → PC 전송
├── py-hex2png/              # hex 덤프 1장을 PNG로 변환하는 단발성 스크립트
├── py-capture/              # 주기적으로 캡처 명령을 보내고 자동으로 PNG 저장
└── rock-paper-scissors/     # 핵심 프로젝트: 가위바위보 인식 ML
    ├── data/                    # 학습용 이미지 데이터셋 (rock/paper/scissors/none)
    ├── logs/                    # esp32cam-train이 만든 원시 시리얼 로그
    ├── esp32cam-train/          # 학습 데이터 촬영용 스케치
    ├── esp32cam-predict/        # 학습된 모델로 온디바이스 추론하는 스케치
    └── hexs2pngs/               # 로그 파일(여러 장) → PNG 여러 장 일괄 변환
```

각 폴더는 "PC ↔ ESP32" 사이를 오가는 하나의 실험 사이클을 나타내며, 뒤로 갈수록 앞선 실험의 결과를 재사용합니다.

## 3. 핵심 파일 5개의 역할

| 순위 | 파일 | 역할 |
|---|---|---|
| 1 | `rock-paper-scissors/esp32cam-predict/esp32cam-predict.ino` | 카메라 프레임을 크롭·서브샘플링·정규화한 뒤 온보드 TFLite 모델로 가위바위보를 실시간 추론하는 최종 결과물 |
| 2 | `rock-paper-scissors/esp32cam-predict/rps32model.h` | `esp32cam-predict.ino`가 참조하는 학습된 CNN 가중치 데이터(TFLite 모델 바이트 배열) |
| 3 | `rock-paper-scissors/esp32cam-train/esp32cam-train.ino` | predict와 동일한 크롭/서브샘플링/히스토그램 평활화 파이프라인으로 학습용 이미지를 촬영해 시리얼로 출력 |
| 4 | `esp32cam-cmd/esp32cam-cmd.ino` | 원본 프레임을 캡처해 시리얼로 hex 덤프하는 범용 캡처 로직 — train/predict가 공유하는 카메라 초기화·캡처 패턴의 원형 |
| 5 | `rock-paper-scissors/hexs2pngs/hexs2pngs.py` | train 스케치가 뱉은 시리얼 hex 로그를 파싱해 PNG 학습 데이터셋으로 변환, ESP32 코드와 Python ML 파이프라인을 잇는 연결고리 |

**주의**: `esp32cam-train.ino`와 `esp32cam-predict.ino`는 `APP_CROP_X0/Y0/X1/Y1`, `APP_BLOCKSIZE`, `img_histeq()` 등 전처리 상수·함수를 그대로 복제해서 사용합니다. 학습 시 이미지를 만든 방식과 추론 시 이미지를 만드는 방식이 어긋나면 모델이 오작동하므로, 두 파일 간의 일관성 유지가 이 프로젝트의 핵심 규칙입니다.

## 4. 주요 코드 흐름

### 4-1. Arduino 스케치의 진입점
Arduino 프레임워크가 `setup()`을 1회, 이후 `loop()`을 무한 반복 호출합니다. 모든 스케치가 이 구조를 따릅니다.
- `setup()`: 시리얼 초기화 → LED(PWM) 초기화 → 카메라 초기화 → (predict의 경우) TFLite 모델 초기화
- `loop()`: 시리얼 입력을 한 글자씩 읽어 명령어로 분기하는 REPL 패턴 (`h`=도움말, `v`=버전, 숫자=플래시 세기 등)

### 4-2. 학습 데이터 생성 → 변환 파이프라인
```
esp32cam-train.ino (촬영)
  → 크롭(122,36)-(234,220) → 4x4 서브샘플링 → 히스토그램 평활화
  → cam_printframe()으로 hex+ASCII 아트를 시리얼 출력
  → 터미널에서 로그 파일로 저장 (예: rock.log)
      ↓
hexs2pngs.py (변환)
  → load(): 로그에서 "  0: "로 시작하는 이미지 블록을 찾아 파싱
  → to_int(): 각 줄의 hex 문자열을 픽셀 정수 리스트로 변환
  → analyse(): 모든 이미지 크기·픽셀 범위(0~255) 검증
  → save(): PIL로 그레이스케일 PNG 생성 (rock000.png, rock001.png, ...)
      ↓
data/{rock,paper,scissors,none}/ 에 정리 → 별도 ML 저장소에서 CNN 학습 → TFLite 변환 → rps32model.h로 이식
```

### 4-3. 추론(predict) 흐름
```
esp32cam-predict.ino
  setup(): fled_setup() → cam_setup() → tflu_setup(rps32model_data)
  loop() (app_auto=1이면 자동 반복):
    cam_capture() : 프레임 캡처 → 크롭 → 4x4 서브샘플링 → 히스토그램 평활화 → cam_outframe[]
    tflu_norm()   : cam_outframe[] (0~255) → tflu_frame[] (-1.0~+1.0), 학습 시와 동일한 방향으로 재배열
    tflu.predict(): TFLite 모델 추론 → output[4] (none/paper/rock/scissors 확률)
    tflu_ixmax()  : 최댓값 인덱스로 카테고리 결정 → 시리얼에 결과 출력(+ LED 깜빡임 연출)
```

## 5. 개발 시작하기

### 5-1. 하드웨어 준비물
- ESP32-CAM 보드 (AI-Thinker 모델 기준, `cammodel.h`에서 `CAMMODEL_AI_THINKER` 정의)
- USB-시리얼 어댑터 (ESP32-CAM 자체에는 USB 포트 없음) — 배선은 [프로젝트 README](README.md) 참고, FTDI 5V를 3V3에 연결하지 않도록 주의
- 업로드 시 IO0-GND 점프 필요 (`esp32cam-cmd.ino` 상단 주석 참고)

### 5-2. Arduino 개발 환경 설치
1. Arduino IDE 설치 후 ESP32 보드 패키지 추가
2. 보드 설정: `Tools > Board > ESP32 Wrover Module` (또는 AI Thinker ESP32-CAM)
3. `Tools > Partition Scheme > Huge APP (3MB No OTA/1MB SPIFFS)`
4. `esp32cam-predict.ino`는 추가로 `EloquentTinyML` 라이브러리 설치 필요 (Library Manager에서 검색)

### 5-3. 스케치 업로드 및 실행
1. IO0-GND 배선 후 리셋 버튼 눌러 플래시 모드 진입
2. Arduino IDE에서 원하는 스케치 업로드 (`esp32cam-cmd`, `esp32cam-train`, `esp32cam-predict` 중 선택)
3. 업로드 완료 후 IO0-GND 배선 제거, 리셋 버튼으로 재부팅
4. 시리얼 모니터(115200 baud)를 열고 `h`를 입력해 사용 가능한 명령어 확인

### 5-4. Python 스크립트 실행 (변환/캡처 도구)
각 Python 폴더(`py-hex2png`, `py-capture`, `rock-paper-scissors/hexs2pngs`)에 `setup.bat`/`run.bat`이 준비되어 있습니다.
```bat
:: 최초 1회, 가상환경 생성 및 의존성 설치
setup.bat

:: 실행 (가상환경 활성화 상태에서)
run.bat
```
`hexs2pngs.py`를 직접 실행할 경우:
```bash
python hexs2pngs.py ../logs/rock.log
```

### 5-5. 테스트
이 저장소에는 자동화된 단위 테스트가 없습니다. 검증은 다음과 같은 수동 절차로 이루어집니다.
- **하드웨어 동작 확인**: 스케치 업로드 후 시리얼 모니터에서 `cam : setup success`, `tflu : setup success` 등의 초기화 성공 메시지 확인
- **캡처 파이프라인 검증**: `esp32cam-cmd`로 캡처한 hex 덤프를 `py-hex2png`로 변환해 이미지가 정상적으로 나오는지 육안 확인
- **데이터 파이프라인 검증**: `hexs2pngs.py`의 `analyse()` 함수가 이미지 크기 불일치·픽셀 범위 초과를 자동으로 잡아줌 (실행 시 에러 없이 `found N correct images` 출력되면 통과)
- **모델 성능 검증**: `esp32cam-predict`를 실행해 실제 가위/바위/보 손 모양에 대한 예측 정확도를 육안으로 확인 (`t` 명령으로 상세 확률 출력 모드 전환 가능)
