import { registerWebModule, NativeModule } from 'expo';

// YomoneySdkModule is not available on the web platform.
class YomoneySdkModule extends NativeModule<{}> {}

export default registerWebModule(YomoneySdkModule, 'YomoneySdkModule');
