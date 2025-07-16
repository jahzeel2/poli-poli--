export class LocalstorageService {
  constructor() {}

  public static setItem(key: string, data: string) {
    try {
      sessionStorage.setItem(key, data);
    } catch (error) {}
  }

  public static getItem(Key: string) {
    try {
      let data = sessionStorage.getItem(Key);

      return data;
    } catch (error) {
      return;
    }
  }

  public static clearItem(key: string) {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  }
}
