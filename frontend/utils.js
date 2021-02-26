/**
 * Utils Class with static methods to be used
 */
class Utils {
  static pi = Math.PI;

  /**
   * Converts degrees to radians
   * @param degrees
   */
  static degToRad(degrees) {
    return degrees * (this.pi / 180);
  }

  /**
   * Converts radians to degrees
   * @param radians
   */
  static radToDeg(radians) {
    return radians * (180 / this.pi);
  }
}
