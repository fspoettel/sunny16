interface FNumberType {
  stop: number,
  nominal: number,
}

interface FNumberExactType {
  stop: number,
  nominal: number,
  exact: number,
}

interface ShutterSpeedType {
  stop: number,
  nominal: string,
}

interface ShutterSpeedExactType {
  stop: number,
  nominal: string,
  exact: number,
}

type anyCameraValue = FNumberType | ShutterSpeedType;
type anyExactCameraValue = FNumberExactType | ShutterSpeedExactType;

interface cameraSetting {
  fNumber: number | null;
  shutterSpeed: string | null;
}

interface cameraSettings {
  ev: number;
  filmSpeed: number;
  settings: cameraSetting[];
}
