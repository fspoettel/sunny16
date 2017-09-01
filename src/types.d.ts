interface FNumberType {
  stop: number;
  nominal: number;
}

interface FNumberExactType {
  stop: number;
  nominal: number;
  exact: number;
}

interface ShutterSpeedType {
  stop: number;
  nominal: string;
}

interface ShutterSpeedExactType {
  stop: number;
  nominal: string;
  exact: number;
}

interface cameraSetting {
  fNumber: number | null;
  shutterSpeed: string | null;
}

interface cameraSettings {
  lightValue: number;
  filmSpeed: number;
  settings: cameraSetting[];
}

interface configI {
  fNumbers?: FNumberType[],
  shutterSpeeds?: ShutterSpeedType[],
}

type anyCameraValue = FNumberType|ShutterSpeedType;
type anyExactCameraValue = FNumberExactType|ShutterSpeedExactType;
