class CustomizeData {
  private static instance: CustomizeData;

  private data!: Customize_Route;

  static getInstance() {
    if (!CustomizeData.instance) CustomizeData.instance = new CustomizeData();
    return CustomizeData.instance;
  }

  constructor() { }

  set(data: Customize_Route) {
    this.data = data;
  }

  get() {
    return this.data;
  }
}

export default CustomizeData.getInstance();
