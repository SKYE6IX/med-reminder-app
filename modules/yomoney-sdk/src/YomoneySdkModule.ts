import { requireNativeModule } from "expo";
import { TokenizeOptions, TokenizeResult } from "./YomoneySdk.types";

type YomoneySdkModule = {
  startTokenize(options: TokenizeOptions): Promise<TokenizeResult>;
};

export default requireNativeModule<YomoneySdkModule>("YomoneySdk");
